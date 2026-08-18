import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Editor from "@monaco-editor/react"
import { getProblemDetail, getHint, runCode, submitCode, getMyLastCode } from "../../api/problemApi"
import DifficultyBadge from "../../components/common/DifficultyBadge"
import ProtectedContent from "../../components/common/ProtectedContent"
import { loader } from "@monaco-editor/react"
import confetti from "canvas-confetti"

function fireConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ["#f97316", "#ea580c", "#4ade80", "#ffffff"],
  })
}

function ProblemDetail() {
  const { id } = useParams()
  const [problem, setProblem] = useState(null)
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [revealedHints, setRevealedHints] = useState([])
  const [hintError, setHintError] = useState("")
  const [showPasteWarning, setShowPasteWarning] = useState(false)
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [editorTheme, setEditorTheme] = useState(localStorage.getItem("yforge_editor_theme") || "vs-dark")

  useEffect(() => {
  Promise.all([getProblemDetail(id), getMyLastCode(id).catch(() => ({ data: {} }))])
    .then(([problemRes, codeRes]) => {
      setProblem(problemRes.data)
      setCode(codeRes.data.code || problemRes.data.starterCode || "")
    })
    .catch((err) => setError(err.response?.data?.message || "Failed to load problem"))
    .finally(() => setLoading(false))
}, [id])

  const handleRevealHint = async (hintNumber) => {
    setHintError("")
    try {
      const res = await getHint(id, hintNumber)
      setRevealedHints((prev) => [...prev, res.data])
    } catch (err) {
      setHintError(err.response?.data?.message || "Hint not available")
    }
  }


  const handleThemeChange = (theme) => {
  setEditorTheme(theme)
  localStorage.setItem("yforge_editor_theme", theme)
}

  const handleRun = async () => {
    setRunning(true)
    setResult(null)
    try {
      const res = await runCode(id, code)
      setResult(res.data)
    } catch (err) {
      setResult({ status: "ERROR", compileError: err.response?.data?.message || "Failed to run code" })
    } finally {
      setRunning(false)
    }
  }

  const handleSubmit = async () => {
  setSubmitting(true)
  setResult(null)
  try {
    const res = await submitCode(id, code)
    setResult(res.data)
    if (res.data.status === "PASSED") {
      fireConfetti()
    }
  } catch (err) {
    setResult({ status: "ERROR", compileError: err.response?.data?.message || "Failed to submit code" })
  } finally {
    setSubmitting(false)
  }
}

  const handleReset = () => {
  if (!window.confirm("Reset to starter code? Your current changes will be lost.")) return
  setCode(problem.starterCode || "")
}

  if (loading) return <p className="text-[var(--color-text-secondary)]">Loading problem...</p>
  if (error) return <p className="text-[var(--color-danger)]">{error}</p>

  const nextHintNumber = revealedHints.length + 1

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-120px)]">
      {/* Left: description panel */}
      <div className="overflow-y-auto bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-5">
        <ProtectedContent>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-xl font-bold">{problem.title}</h1>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            {problem.topic} · {problem.estimatedTimeMinutes} min
          </p>

          <p className="whitespace-pre-wrap text-sm mb-4">{problem.description}</p>

          {problem.constraints && (
            <>
              <h3 className="font-semibold text-sm mb-1">Constraints</h3>
              <p className="whitespace-pre-wrap text-sm text-[var(--color-text-secondary)] mb-4">
                {problem.constraints}
              </p>
            </>
          )}

          <h3 className="font-semibold text-sm mb-2">Examples</h3>
          {problem.visibleTestCases.map((tc, i) => (
            <div key={i} className="mb-3 text-sm">
              <p className="text-[var(--color-text-secondary)]">Input:</p>
              <pre className="bg-[var(--color-bg-tertiary)] rounded p-2 mb-1">{tc.input}</pre>
              <p className="text-[var(--color-text-secondary)]">Output:</p>
              <pre className="bg-[var(--color-bg-tertiary)] rounded p-2">{tc.expectedOutput}</pre>
            </div>
          ))}

          {/* Hints section */}
          <div className="mt-6 border-t border-[var(--color-border)] pt-4">
            <h3 className="font-semibold text-sm mb-2">Forge Hints 🔥</h3>
            {revealedHints.map((h) => (
              <div key={h.hintNumber} className="mb-2 text-sm p-2 rounded bg-[var(--color-bg-tertiary)]">
                <span className="text-[var(--color-forge-500)] font-medium">Hint {h.hintNumber}: </span>
                {h.hint}
              </div>
            ))}
            {hintError && <p className="text-xs text-[var(--color-danger)] mb-2">{hintError}</p>}
            {nextHintNumber <= 3 && (
              <button
                onClick={() => handleRevealHint(nextHintNumber)}
                className="text-sm text-[var(--color-forge-500)] hover:underline"
              >
                Reveal Hint {nextHintNumber}
              </button>
            )}
          </div>
        </ProtectedContent>
      </div>

      {/* Right: editor panel */}
      <div className="flex flex-col bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)]">
           <span className="text-sm text-[var(--color-text-secondary)]">Java</span>
            <select
              value={editorTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="text-xs bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded px-2 py-1 text-[var(--color-text-secondary)]"
            >
              <option value="vs-dark">Dark</option>
              <option value="vs">Light</option>
              <option value="hc-black">High Contrast</option>
            </select>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              disabled={running || submitting}
              className="text-sm bg-[var(--color-bg-tertiary)] px-3 py-1 rounded hover:opacity-80 disabled:opacity-50"
              title="Reset to starter code"
            >
              Reset
            </button>
            <button
              onClick={handleRun}
              disabled={running || submitting}
              className="text-sm bg-[var(--color-bg-tertiary)] px-3 py-1 rounded hover:opacity-80 disabled:opacity-50"
            >
              {running ? "Running..." : "Run"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={running || submitting}
              className="text-sm bg-[var(--color-forge-500)] text-white px-3 py-1 rounded hover:bg-[var(--color-forge-600)] disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        {showPasteWarning && (
          <div className="bg-[var(--color-forge-500)]/10 border-b border-[var(--color-forge-500)] text-[var(--color-forge-500)] text-sm px-4 py-2">
            Pasting is disabled in YForge. Write every line yourself. Keep forging. 🔥
          </div>
        )}

        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            language="java"
            theme={editorTheme}
            value={code}
            onChange={(value) => setCode(value ?? "")}
            onMount={(editor, monaco) => {
              editor.onDidPaste(() => {
                editor.trigger("source", "undo")
                setShowPasteWarning(true)
                setTimeout(() => setShowPasteWarning(false), 3000)
              })

              monaco.languages.registerCompletionItemProvider("java", {
                provideCompletionItems: (model, position) => {
                  const word = model.getWordUntilPosition(position)
                  const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                  }

                  const snippets = [
                    {
                      label: "sout",
                      insertText: "System.out.println($1);",
                      detail: "Print line",
                    },
                    {
                      label: "for",
                      insertText: "for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t$0\n}",
                      detail: "For loop",
                    },
                    {
                      label: "forEach",
                      insertText: "for (${1:int} ${2:item} : ${3:collection}) {\n\t$0\n}",
                      detail: "For-each loop",
                    },
                    {
                      label: "while",
                      insertText: "while (${1:condition}) {\n\t$0\n}",
                      detail: "While loop",
                    },
                    {
                      label: "if",
                      insertText: "if (${1:condition}) {\n\t$0\n}",
                      detail: "If statement",
                    },
                    {
                      label: "ifelse",
                      insertText: "if (${1:condition}) {\n\t$2\n} else {\n\t$0\n}",
                      detail: "If-else statement",
                    },
                    {
                      label: "main",
                      insertText: "public static void main(String[] args) {\n\t$0\n}",
                      detail: "Main method",
                    },
                    {
                      label: "scanner",
                      insertText: "Scanner sc = new Scanner(System.in);",
                      detail: "Create Scanner",
                    },
                    {
                      label: "arraylist",
                      insertText: "ArrayList<${1:Integer}> ${2:list} = new ArrayList<>();",
                      detail: "ArrayList declaration",
                    },
                    {
                      label: "hashmap",
                      insertText: "HashMap<${1:String}, ${2:Integer}> ${3:map} = new HashMap<>();",
                      detail: "HashMap declaration",
                    },
                    {
                      label: "trycatch",
                      insertText: "try {\n\t$1\n} catch (${2:Exception} e) {\n\t$0\n}",
                      detail: "Try-catch block",
                    },
                  ]

                  return {
                    suggestions: snippets.map((s) => ({
                      label: s.label,
                      kind: monaco.languages.CompletionItemKind.Snippet,
                      insertText: s.insertText,
                      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                      detail: s.detail,
                      range,
                    })),
                  }
                },
              })
            }}
            options={{
            fontSize: Number(localStorage.getItem("yforge_editor_fontsize")) || 14,
            minimap: { enabled: false },
            dropIntoEditor: { enabled: false },
            contextmenu: false,
            automaticLayout: true,
          }}
          />
        </div>

        {result && (
          <div className="border-t border-[var(--color-border)] p-4 max-h-64 overflow-y-auto">
            {result.compileError ? (
              <div>
                <p className="text-[var(--color-danger)] font-semibold mb-2">⚒ Compile Error</p>
                <pre className="text-xs text-[var(--color-danger)] whitespace-pre-wrap">{result.compileError}</pre>
              </div>
            ) : (
              <>
                <p
                  className={`font-semibold mb-2 ${
                    result.status === "PASSED" ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
                  }`}
                >
                  {result.status === "PASSED" ? "🔥 Solution Forged Successfully" : "⚒ Still Forging..."}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                  {result.passedTestCount}/{result.totalTestCount} test cases passed · {result.runtimeMs}ms
                </p>
                {result.testResults?.map((tr) => (
                  <div key={tr.testNumber} className="mb-2 text-sm p-2 rounded bg-[var(--color-bg-tertiary)]">
                    <span className={tr.passed ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}>
                      {tr.passed ? "✓" : "✗"} Test {tr.testNumber} {tr.hidden ? "🔒" : ""}
                    </span>
                    {!tr.hidden && !tr.passed && (
                      <div className="mt-1 text-xs text-[var(--color-text-secondary)]">
                        <p>Expected: {tr.expectedOutput}</p>
                        <p>Got: {tr.actualOutput || "(no output)"}</p>
                        {tr.errorMessage && <p className="text-[var(--color-danger)]">{tr.errorMessage}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProblemDetail