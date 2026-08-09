package com.yforge.backend.service;

import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;

@Service
public class ExecutionService {

    private static final int TIMEOUT_SECONDS = 5;

    public record TestResult(boolean passed, String actualOutput, String errorMessage) {}
    public record ExecutionOutcome(boolean compiled, String compileError, List<TestResult> results, long runtimeMs) {}

    public ExecutionOutcome runAgainstTestCases(String code, List<String> inputs, List<String> expectedOutputs) {
        Path tempDir;
        try {
            tempDir = Files.createTempDirectory("yforge_exec_");
        } catch (IOException e) {
            return new ExecutionOutcome(false, "Server error creating temp directory", List.of(), 0);
        }

        try {
            Path sourceFile = tempDir.resolve("Main.java");
            Files.writeString(sourceFile, code);

            // ---- Compile ----
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

            // ---- Run against each test case ----
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
}