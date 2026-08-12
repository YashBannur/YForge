package com.yforge.backend.service;

import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ExecutionService {

    private static final int TIMEOUT_SECONDS = 5;

    private static final Pattern METHOD_PATTERN = Pattern.compile(
            "public\\s+(?:static\\s+)?([\\w\\[\\]]+)\\s+(\\w+)\\s*\\(([^)]*)\\)"
    );

    private static final Pattern CLASS_PATTERN = Pattern.compile("\\bclass\\s+\\w+");

    public record TestResult(boolean passed, String actualOutput, String errorMessage) {}
    public record ExecutionOutcome(boolean compiled, String compileError, List<TestResult> results, long runtimeMs) {}

    public ExecutionOutcome runAgainstTestCases(String code, List<String> inputs, List<String> expectedOutputs) {

        String sourceToCompile;
        try {
            sourceToCompile = wrapIfNeeded(code);
        } catch (IllegalArgumentException e) {
            return new ExecutionOutcome(false, e.getMessage(), List.of(), 0);
        }

        Path tempDir;
        try {
            tempDir = Files.createTempDirectory("yforge_exec_");
        } catch (IOException e) {
            return new ExecutionOutcome(false, "Server error creating temp directory", List.of(), 0);
        }

        try {
            Path sourceFile = tempDir.resolve("Main.java");
            Files.writeString(sourceFile, sourceToCompile);

            ProcessBuilder compileBuilder = new ProcessBuilder("javac", "Main.java");
            compileBuilder.directory(tempDir.toFile());
            compileBuilder.redirectErrorStream(true);
            Process compileProcess = compileBuilder.start();

            String compileOutput = readStream(compileProcess.getInputStream());
            boolean compileFinished = compileProcess.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);

            if (!compileFinished) {
                compileProcess.destroyForcibly();
                return new ExecutionOutcome(false, "Compilation timed out", List.of(), 0);
            }
            if (compileProcess.exitValue() != 0) {
                return new ExecutionOutcome(false, compileOutput, List.of(), 0);
            }

            List<TestResult> results = new ArrayList<>();
            long totalStart = System.currentTimeMillis();

            for (int i = 0; i < inputs.size(); i++) {
                results.add(runSingleTest(tempDir, inputs.get(i), expectedOutputs.get(i)));
            }

            long totalTime = System.currentTimeMillis() - totalStart;
            return new ExecutionOutcome(true, null, results, totalTime);

        } catch (Exception e) {
            return new ExecutionOutcome(false, "Execution error: " + e.getMessage(), List.of(), 0);
        } finally {
            deleteDirectory(tempDir.toFile());
        }
    }

    private TestResult runSingleTest(Path tempDir, String input, String expectedOutput) {
        try {
            ProcessBuilder runBuilder = new ProcessBuilder("java", "-cp", ".", "Main");
            runBuilder.directory(tempDir.toFile());
            Process process = runBuilder.start();

            try (OutputStream stdin = process.getOutputStream()) {
                stdin.write(input.getBytes());
                stdin.flush();
            }

            boolean finished = process.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return new TestResult(false, null, "Time Limit Exceeded");
            }

            String output = readStream(process.getInputStream()).trim();
            String errorOutput = readStream(process.getErrorStream()).trim();

            if (process.exitValue() != 0 && !errorOutput.isBlank()) {
                return new TestResult(false, output, "Runtime Error: " + errorOutput);
            }

            boolean passed = output.equals(expectedOutput.trim());
            return new TestResult(passed, output, null);

        } catch (Exception e) {
            return new TestResult(false, null, "Execution error: " + e.getMessage());
        }
    }

    private String readStream(InputStream stream) throws IOException {
        return new String(stream.readAllBytes());
    }

    private void deleteDirectory(File dir) {
        File[] files = dir.listFiles();
        if (files != null) {
            for (File f : files) {
                if (f.isDirectory()) deleteDirectory(f);
                else f.delete();
            }
        }
        dir.delete();
    }

    // ===================== METHOD-MODE WRAPPING =====================

    /**
     * Decides whether the submitted code is a full program (contains its own class + main)
     * or a bare method that needs wrapping. Legacy problems are completely unaffected.
     */
    private String wrapIfNeeded(String studentCode) {
        if (CLASS_PATTERN.matcher(studentCode).find()) {
            return studentCode; // raw mode: unchanged, exactly current behavior
        }

        Matcher m = METHOD_PATTERN.matcher(studentCode);
        if (!m.find()) {
            throw new IllegalArgumentException(
                    "Could not detect a method signature. Expected something like:\n" +
                    "public <returnType> <methodName>(<parameters>) { ... }"
            );
        }

        String returnType = m.group(1).trim();
        String methodName = m.group(2).trim();
        String rawParams = m.group(3).trim();

        List<String[]> params = new ArrayList<>(); // each entry: [type, name]
        if (!rawParams.isEmpty()) {
            for (String rawParam : rawParams.split(",")) {
                String p = rawParam.trim();
                String[] tokens = p.split("\\s+");
                String name = tokens[tokens.length - 1];
                String type = p.substring(0, p.length() - name.length()).trim();
                params.add(new String[]{type, name});
            }
        }

        return buildWrapperSource(studentCode, returnType, methodName, params);
    }

    private String buildWrapperSource(String studentCode, String returnType, String methodName, List<String[]> params) {
        StringBuilder src = new StringBuilder();

        src.append("import java.io.*;\n\n");
        src.append("public class Main {\n\n");
        src.append(studentCode);
        src.append("\n\n");

        src.append("    public static void main(String[] args) throws Exception {\n");
        src.append("        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n");
        src.append("        Main solution = new Main();\n\n");

        List<String> argNames = new ArrayList<>();
        for (int i = 0; i < params.size(); i++) {
            String type = params.get(i)[0];
            String name = params.get(i)[1];
            argNames.add(name);

            src.append("        String __line").append(i).append(" = br.readLine();\n");
            src.append(buildParseLine(type, name, "__line" + i));
        }
        src.append("\n");

        String argsJoined = String.join(", ", argNames);

        if (returnType.equals("void")) {
            src.append("        solution.").append(methodName).append("(").append(argsJoined).append(");\n");

            String printedParamType = null;
            String printedParamName = null;
            for (String[] p : params) {
                if (p[0].endsWith("[]")) {
                    printedParamType = p[0];
                    printedParamName = p[1];
                    break;
                }
            }

            if (printedParamName != null) {
                src.append(buildPrintLine(printedParamType, printedParamName));
            } else {
                src.append("        System.out.println(\"\");\n");
            }
        } else {
            src.append("        ").append(returnType).append(" result = solution.")
               .append(methodName).append("(").append(argsJoined).append(");\n");
            src.append(buildPrintLine(returnType, "result"));
        }

        src.append("    }\n\n");
        src.append(buildHelperMethods());
        src.append("}\n");

        return src.toString();
    }

    private String buildParseLine(String type, String varName, String lineVar) {
        switch (type) {
            case "int[]":
                return "        int[] " + varName + " = parseIntArray(" + lineVar + ");\n";
            case "char[]":
                return "        char[] " + varName + " = parseCharArray(" + lineVar + ");\n";
            case "String[]":
                return "        String[] " + varName + " = parseStringArray(" + lineVar + ");\n";
            case "boolean[]":
                return "        boolean[] " + varName + " = parseBooleanArray(" + lineVar + ");\n";
            case "long[]":
                return "        long[] " + varName + " = parseLongArray(" + lineVar + ");\n";
            case "double[]":
                return "        double[] " + varName + " = parseDoubleArray(" + lineVar + ");\n";
            case "int":
                return "        int " + varName + " = Integer.parseInt(" + lineVar + ".trim());\n";
            case "long":
                return "        long " + varName + " = Long.parseLong(" + lineVar + ".trim());\n";
            case "double":
                return "        double " + varName + " = Double.parseDouble(" + lineVar + ".trim());\n";
            case "boolean":
                return "        boolean " + varName + " = Boolean.parseBoolean(" + lineVar + ".trim());\n";
            case "char":
                return "        char " + varName + " = parseCharScalar(" + lineVar + ");\n";
            case "String":
                return "        String " + varName + " = parseStringScalar(" + lineVar + ");\n";
            default:
                throw new IllegalArgumentException("Unsupported parameter type: " + type);
        }
    }

    private String buildPrintLine(String type, String varName) {
        switch (type) {
            case "int[]":
                return "        System.out.println(formatIntArray(" + varName + "));\n";
            case "char[]":
                return "        System.out.println(formatCharArray(" + varName + "));\n";
            case "String[]":
                return "        System.out.println(formatStringArray(" + varName + "));\n";
            case "boolean[]":
                return "        System.out.println(formatBooleanArray(" + varName + "));\n";
            case "long[]":
                return "        System.out.println(formatLongArray(" + varName + "));\n";
            case "double[]":
                return "        System.out.println(formatDoubleArray(" + varName + "));\n";
            case "int":
            case "long":
            case "double":
            case "boolean":
                return "        System.out.println(String.valueOf(" + varName + "));\n";
            case "char":
            case "String":
                return "        System.out.println(\"\\\"\" + " + varName + " + \"\\\"\");\n";
            default:
                throw new IllegalArgumentException("Unsupported return type: " + type);
        }
    }

    private String buildHelperMethods() {
        StringBuilder sb = new StringBuilder();

        sb.append("    private static String stripBrackets(String line) {\n")
          .append("        line = line.trim();\n")
          .append("        if (line.startsWith(\"[\") && line.endsWith(\"]\")) {\n")
          .append("            line = line.substring(1, line.length() - 1);\n")
          .append("        }\n")
          .append("        return line.trim();\n")
          .append("    }\n\n");

        sb.append("    private static int[] parseIntArray(String line) {\n")
          .append("        String inner = stripBrackets(line);\n")
          .append("        if (inner.isEmpty()) return new int[0];\n")
          .append("        String[] parts = inner.split(\",\");\n")
          .append("        int[] result = new int[parts.length];\n")
          .append("        for (int i = 0; i < parts.length; i++) result[i] = Integer.parseInt(parts[i].trim());\n")
          .append("        return result;\n")
          .append("    }\n\n");

        sb.append("    private static long[] parseLongArray(String line) {\n")
          .append("        String inner = stripBrackets(line);\n")
          .append("        if (inner.isEmpty()) return new long[0];\n")
          .append("        String[] parts = inner.split(\",\");\n")
          .append("        long[] result = new long[parts.length];\n")
          .append("        for (int i = 0; i < parts.length; i++) result[i] = Long.parseLong(parts[i].trim());\n")
          .append("        return result;\n")
          .append("    }\n\n");

        sb.append("    private static double[] parseDoubleArray(String line) {\n")
          .append("        String inner = stripBrackets(line);\n")
          .append("        if (inner.isEmpty()) return new double[0];\n")
          .append("        String[] parts = inner.split(\",\");\n")
          .append("        double[] result = new double[parts.length];\n")
          .append("        for (int i = 0; i < parts.length; i++) result[i] = Double.parseDouble(parts[i].trim());\n")
          .append("        return result;\n")
          .append("    }\n\n");

        sb.append("    private static boolean[] parseBooleanArray(String line) {\n")
          .append("        String inner = stripBrackets(line);\n")
          .append("        if (inner.isEmpty()) return new boolean[0];\n")
          .append("        String[] parts = inner.split(\",\");\n")
          .append("        boolean[] result = new boolean[parts.length];\n")
          .append("        for (int i = 0; i < parts.length; i++) result[i] = Boolean.parseBoolean(parts[i].trim());\n")
          .append("        return result;\n")
          .append("    }\n\n");

        sb.append("    private static char[] parseCharArray(String line) {\n")
          .append("        String inner = stripBrackets(line);\n")
          .append("        if (inner.isEmpty()) return new char[0];\n")
          .append("        String[] parts = inner.split(\",\");\n")
          .append("        char[] result = new char[parts.length];\n")
          .append("        for (int i = 0; i < parts.length; i++) {\n")
          .append("            String p = parts[i].trim();\n")
          .append("            if (p.startsWith(\"\\\"\") && p.endsWith(\"\\\"\") && p.length() >= 2) {\n")
          .append("                p = p.substring(1, p.length() - 1);\n")
          .append("            }\n")
          .append("            result[i] = p.isEmpty() ? ' ' : p.charAt(0);\n")
          .append("        }\n")
          .append("        return result;\n")
          .append("    }\n\n");

        sb.append("    private static String[] parseStringArray(String line) {\n")
          .append("        String inner = stripBrackets(line);\n")
          .append("        if (inner.isEmpty()) return new String[0];\n")
          .append("        String[] parts = inner.split(\",\");\n")
          .append("        String[] result = new String[parts.length];\n")
          .append("        for (int i = 0; i < parts.length; i++) {\n")
          .append("            String p = parts[i].trim();\n")
          .append("            if (p.startsWith(\"\\\"\") && p.endsWith(\"\\\"\") && p.length() >= 2) {\n")
          .append("                p = p.substring(1, p.length() - 1);\n")
          .append("            }\n")
          .append("            result[i] = p;\n")
          .append("        }\n")
          .append("        return result;\n")
          .append("    }\n\n");

        sb.append("    private static char parseCharScalar(String line) {\n")
          .append("        String p = line.trim();\n")
          .append("        if (p.startsWith(\"\\\"\") && p.endsWith(\"\\\"\") && p.length() >= 2) {\n")
          .append("            p = p.substring(1, p.length() - 1);\n")
          .append("        }\n")
          .append("        return p.isEmpty() ? ' ' : p.charAt(0);\n")
          .append("    }\n\n");

        sb.append("    private static String parseStringScalar(String line) {\n")
          .append("        String p = line.trim();\n")
          .append("        if (p.startsWith(\"\\\"\") && p.endsWith(\"\\\"\") && p.length() >= 2) {\n")
          .append("            p = p.substring(1, p.length() - 1);\n")
          .append("        }\n")
          .append("        return p;\n")
          .append("    }\n\n");

        sb.append("    private static String formatIntArray(int[] arr) {\n")
          .append("        StringBuilder sb = new StringBuilder(\"[\");\n")
          .append("        for (int i = 0; i < arr.length; i++) {\n")
          .append("            if (i > 0) sb.append(\",\");\n")
          .append("            sb.append(arr[i]);\n")
          .append("        }\n")
          .append("        sb.append(\"]\");\n")
          .append("        return sb.toString();\n")
          .append("    }\n\n");

        sb.append("    private static String formatLongArray(long[] arr) {\n")
          .append("        StringBuilder sb = new StringBuilder(\"[\");\n")
          .append("        for (int i = 0; i < arr.length; i++) {\n")
          .append("            if (i > 0) sb.append(\",\");\n")
          .append("            sb.append(arr[i]);\n")
          .append("        }\n")
          .append("        sb.append(\"]\");\n")
          .append("        return sb.toString();\n")
          .append("    }\n\n");

        sb.append("    private static String formatDoubleArray(double[] arr) {\n")
          .append("        StringBuilder sb = new StringBuilder(\"[\");\n")
          .append("        for (int i = 0; i < arr.length; i++) {\n")
          .append("            if (i > 0) sb.append(\",\");\n")
          .append("            sb.append(arr[i]);\n")
          .append("        }\n")
          .append("        sb.append(\"]\");\n")
          .append("        return sb.toString();\n")
          .append("    }\n\n");

        sb.append("    private static String formatBooleanArray(boolean[] arr) {\n")
          .append("        StringBuilder sb = new StringBuilder(\"[\");\n")
          .append("        for (int i = 0; i < arr.length; i++) {\n")
          .append("            if (i > 0) sb.append(\",\");\n")
          .append("            sb.append(arr[i]);\n")
          .append("        }\n")
          .append("        sb.append(\"]\");\n")
          .append("        return sb.toString();\n")
          .append("    }\n\n");

        sb.append("    private static String formatCharArray(char[] arr) {\n")
          .append("        StringBuilder sb = new StringBuilder(\"[\");\n")
          .append("        for (int i = 0; i < arr.length; i++) {\n")
          .append("            if (i > 0) sb.append(\",\");\n")
          .append("            sb.append('\\\"').append(arr[i]).append('\\\"');\n")
          .append("        }\n")
          .append("        sb.append(\"]\");\n")
          .append("        return sb.toString();\n")
          .append("    }\n\n");

        sb.append("    private static String formatStringArray(String[] arr) {\n")
          .append("        StringBuilder sb = new StringBuilder(\"[\");\n")
          .append("        for (int i = 0; i < arr.length; i++) {\n")
          .append("            if (i > 0) sb.append(\",\");\n")
          .append("            sb.append('\\\"').append(arr[i]).append('\\\"');\n")
          .append("        }\n")
          .append("        sb.append(\"]\");\n")
          .append("        return sb.toString();\n")
          .append("    }\n\n");

        return sb.toString();
    }
}