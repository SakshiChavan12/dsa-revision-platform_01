import { useState } from "react";

/* =========================================================
   MOCK DATA
========================================================= */

const MOCK_LISTS = [
  {
    id: 1,
    name: "Blind 75 - My List",
    count: 25,
    questions: [
      { id: 101, title: "Two Sum", difficulty: "Easy" },
      { id: 102, title: "Add Two Numbers", difficulty: "Medium" },
      {
        id: 103,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
      },
      {
        id: 104,
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
      },
      { id: 105, title: "LRU Cache", difficulty: "Hard" },
      { id: 106, title: "Valid Parentheses", difficulty: "Easy" },
    ],
  },
];

const DEFAULT_QUESTION = {
  id: 101,
  title: "Two Sum",
  difficulty: "Easy",
  description:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation:
        "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
  ],
  constraints:
    "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
};

/* =========================================================
   PRACTICE COMPONENT
========================================================= */

const Practice = () => {
  const [selectedListId, setSelectedListId] = useState(1);
  const [currentQuestion, setCurrentQuestion] =
    useState(DEFAULT_QUESTION);

  const [selectedLanguage, setSelectedLanguage] =
    useState("JavaScript (Node.js)");

  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);

  const currentList = MOCK_LISTS.find(
    (list) => list.id === selectedListId
  );

  /* =========================================================
     ACTIONS
  ========================================================= */

  const handleStartPractice = () => {
    if (!currentList || currentList.questions.length === 0) {
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * currentList.questions.length
    );

    const selectedQuestion =
      currentList.questions[randomIndex];

    setCurrentQuestion({
      ...DEFAULT_QUESTION,
      ...selectedQuestion,
      description: DEFAULT_QUESTION.description,
      examples: DEFAULT_QUESTION.examples,
    });

    setHintLevel(0);
    setShowSolution(false);
    setTestResults(null);
  };

  const handleSelectQuestion = (question) => {
    setCurrentQuestion({
      ...DEFAULT_QUESTION,
      ...question,
    });

    setHintLevel(0);
    setShowSolution(false);
    setTestResults(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);

    setTimeout(() => {
      setTestResults([
        {
          id: 1,
          status: "Passed",
        },
        {
          id: 2,
          status: "Failed",
        },
        {
          id: 3,
          status: "Not Run",
        },
      ]);

      setIsRunning(false);
    }, 1000);
  };

  const handleGetHint = () => {
    if (hintLevel < 4) {
      setHintLevel((previous) => previous + 1);
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === "Easy") return "#22c55e";
    if (difficulty === "Medium") return "#eab308";
    return "#ef4444";
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        boxSizing: "border-box",
      }}
    >
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "var(--text-primary)",
            margin: "0 0 8px 0",
          }}
        >
          Practice
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Choose a list and let DSA Trainer randomly pick a
          question for you.
        </p>
      </div>

      {/* =====================================================
          MAIN WORKSPACE
      ====================================================== */}

      <div
        className="practice-workspace"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(220px, 1fr) minmax(280px, 1.2fr) minmax(320px, 1.5fr)",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* ===================================================
            COLUMN 1 - MY LISTS
        ==================================================== */}

        <div
          className="card-glow"
          style={{
            padding: "20px",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Panel Header */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              borderBottom:
                "1px solid var(--border-subtle)",
              paddingBottom: "12px",
            }}
          >
            <span
              style={{
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              My Lists
            </span>

            <select
              value={selectedListId}
              onChange={(event) =>
                setSelectedListId(
                  Number(event.target.value)
                )
              }
              style={{
                background: "var(--bg-app)",
                border:
                  "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
                borderRadius: "6px",
                padding: "6px 8px",
                fontSize: "0.8rem",
                maxWidth: "150px",
              }}
            >
              {MOCK_LISTS.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>

          {/* Questions */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              minWidth: 0,
            }}
          >
            {currentList?.questions.map((question) => (
              <div
                key={question.id}
                onClick={() =>
                  handleSelectQuestion(question)
                }
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 10px",
                  borderRadius: "7px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background:
                    currentQuestion.id === question.id
                      ? "rgba(124, 92, 252, 0.15)"
                      : "transparent",
                  borderLeft:
                    currentQuestion.id === question.id
                      ? "2px solid var(--accent-purple)"
                      : "2px solid transparent",
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "0.83rem",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                    flex: 1,
                    minWidth: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {question.title}
                </span>

                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: getDifficultyColor(
                      question.difficulty
                    ),
                    flexShrink: 0,
                  }}
                >
                  {question.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================
            COLUMN 2 - PRACTICE ACTION
        ==================================================== */}

        <div
          className="card-glow"
          style={{
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            minHeight: "400px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              marginBottom: "24px",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                background:
                  "rgba(124, 92, 252, 0.1)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
                color: "var(--accent-purple)",
              }}
            >
              <i
                className="fa-solid fa-shuffle"
                style={{
                  fontSize: "28px",
                }}
              ></i>
            </div>

            <h3
              style={{
                color: "var(--text-primary)",
                margin: "0 0 8px 0",
                fontSize: "1.25rem",
              }}
            >
              Ready to Practice?
            </h3>

            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              We will randomly pick a question from
              your selected list.
            </p>
          </div>

          <button
            onClick={handleStartPractice}
            className="btn-primary"
            style={{
              padding: "12px 48px",
              fontSize: "1rem",
              width: "100%",
              maxWidth: "280px",
            }}
          >
            Start Practice
          </button>

          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.8rem",
              lineHeight: 1.5,
              marginTop: "16px",
            }}
          >
            You can't skip or pick a question.
            <br />
            Solve and improve. 💪
          </p>
        </div>

        {/* ===================================================
            COLUMN 3 - QUESTION + EDITOR
        ==================================================== */}

        <div
          className="card-glow"
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          {/* Question Header */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              borderBottom:
                "1px solid var(--border-subtle)",
              paddingBottom: "12px",
              minWidth: 0,
            }}
          >
            <div
              style={{
                minWidth: 0,
                flex: 1,
              }}
            >
              <h3
                style={{
                  color: "var(--text-primary)",
                  margin: "0 0 4px 0",
                  fontSize: "1.1rem",
                  overflowWrap: "anywhere",
                }}
              >
                {currentQuestion.title}
              </h3>

              <span
                style={{
                  fontSize: "0.75rem",
                  color: getDifficultyColor(
                    currentQuestion.difficulty
                  ),
                  fontWeight: 600,
                }}
              >
                {currentQuestion.difficulty}
              </span>
            </div>

            <select
              value={selectedLanguage}
              onChange={(event) =>
                setSelectedLanguage(event.target.value)
              }
              style={{
                background: "var(--bg-app)",
                border:
                  "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
                borderRadius: "6px",
                padding: "6px 8px",
                fontSize: "0.8rem",
                flexShrink: 0,
                maxWidth: "170px",
              }}
            >
              <option>JavaScript (Node.js)</option>
              <option>Python</option>
              <option>Java</option>
            </select>
          </div>

          {/* Description */}

          <div
            style={{
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              maxHeight: "140px",
              overflowY: "auto",
              overflowWrap: "anywhere",
              paddingRight: "4px",
            }}
          >
            {currentQuestion.description}
          </div>

          {/* Code Editor */}

          <div
            style={{
              background: "var(--bg-app)",
              border:
                "1px solid var(--border-subtle)",
              borderRadius: "8px",
              padding: "16px",
              fontFamily:
                "'Fira Code', 'Courier New', monospace",
              fontSize: "0.8rem",
              color: "#a5b3ce",
              minHeight: "180px",
              maxHeight: "260px",
              overflow: "auto",
              lineHeight: 1.7,
              whiteSpace: "pre",
              boxSizing: "border-box",
            }}
          >
            <div>
              <span style={{ color: "#c792ea" }}>
                function
              </span>{" "}
              <span style={{ color: "#ffcb6b" }}>
                twoSum
              </span>
              <span style={{ color: "#89ddff" }}>
                (nums, target)
              </span>{" "}
              {"{"}
            </div>

            <div style={{ paddingLeft: "16px" }}>
              <span style={{ color: "#c792ea" }}>
                const
              </span>{" "}
              map ={" "}
              <span style={{ color: "#c792ea" }}>
                new
              </span>{" "}
              <span style={{ color: "#82aaff" }}>
                Map
              </span>
              ();
            </div>

            <div style={{ paddingLeft: "16px" }}>
              <span style={{ color: "#c792ea" }}>
                for
              </span>{" "}
              (
              <span style={{ color: "#c792ea" }}>
                let
              </span>{" "}
              i ={" "}
              <span style={{ color: "#f78c6c" }}>
                0
              </span>
              ; i &lt; nums.length; i++) {"{"}
            </div>

            <div style={{ paddingLeft: "32px" }}>
              <span style={{ color: "#c792ea" }}>
                const
              </span>{" "}
              complement = target - nums[i];
            </div>

            <div style={{ paddingLeft: "32px" }}>
              <span style={{ color: "#c792ea" }}>
                if
              </span>{" "}
              (map.has(complement)) {"{"}
            </div>

            <div style={{ paddingLeft: "48px" }}>
              <span style={{ color: "#c792ea" }}>
                return
              </span>{" "}
              [map.get(complement), i];
            </div>

            <div style={{ paddingLeft: "32px" }}>
              {"}"}
            </div>

            <div style={{ paddingLeft: "16px" }}>
              {"}"}
            </div>

            <div>{"}"}</div>
          </div>

          {/* Action Buttons */}

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "4px",
            }}
          >
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="btn-outline"
              style={{
                flex: 1,
                padding: "10px 0",
                fontSize: "0.85rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                minWidth: 0,
              }}
            >
              {isRunning ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <>
                  <i className="fa-solid fa-play"></i>
                  Run Code
                </>
              )}
            </button>

            <button
              className="btn-primary"
              style={{
                flex: 1,
                padding: "10px 0",
                fontSize: "0.85rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                minWidth: 0,
              }}
            >
              <i className="fa-solid fa-check"></i>
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          HINTS + TEST CASES + SOLUTION
      ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(280px, 1fr) minmax(280px, 1fr)",
          gap: "24px",
        }}
      >
        {/* ===================================================
            HINTS
        ==================================================== */}

        <div
          className="card-glow"
          style={{
            padding: "20px",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              borderBottom:
                "1px solid var(--border-subtle)",
              paddingBottom: "12px",
              marginBottom: "16px",
            }}
          >
            <h4
              style={{
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Hints
            </h4>

            <button
              onClick={handleGetHint}
              disabled={hintLevel >= 4}
              className="btn-primary"
              style={{
                padding: "6px 16px",
                fontSize: "0.8rem",
              }}
            >
              {hintLevel >= 4
                ? "All Hints Used"
                : "Get Hint"}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {[1, 2, 3, 4].map((hint, index) => (
              <div
                key={hint}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "10px",
                  background: "var(--bg-app)",
                  border:
                    "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  opacity:
                    index < hintLevel ? 1 : 0.55,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background:
                      index < hintLevel
                        ? "var(--accent-purple)"
                        : "#4B5563",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  {hint}
                </div>

                <div
                  style={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.85rem",
                      color:
                        index < hintLevel
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                      lineHeight: 1.5,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {index < hintLevel
                      ? "Try using a hash map to store numbers and their indices as you iterate through the array."
                      : `Hint ${hint} is locked. Click "Get Hint" to unlock.`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================
            TEST CASES + SOLUTION
        ==================================================== */}

        <div
          className="card-glow"
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            minWidth: 0,
          }}
        >
          {/* TEST CASES */}

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                borderBottom:
                  "1px solid var(--border-subtle)",
                paddingBottom: "8px",
                marginBottom: "12px",
              }}
            >
              <h4
                style={{
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                Test Cases
              </h4>

              <button
                className="btn-outline"
                style={{
                  padding: "5px 12px",
                  fontSize: "0.75rem",
                }}
              >
                View Test Cases
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                fontSize: "0.85rem",
              }}
            >
              {testResults ? (
                testResults.map((test, index) => (
                  <div
                    key={test.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      padding: "8px",
                      background:
                        index % 2 === 0
                          ? "var(--bg-app)"
                          : "transparent",
                      borderRadius: "4px",
                    }}
                  >
                    <span
                      style={{
                        color:
                          "var(--text-secondary)",
                      }}
                    >
                      Test Case {test.id}
                    </span>

                    <span
                      style={{
                        color:
                          test.status === "Passed"
                            ? "#22c55e"
                            : test.status === "Failed"
                            ? "#ef4444"
                            : "var(--text-secondary)",
                      }}
                    >
                      {test.status}
                    </span>
                  </div>
                ))
              ) : (
                <p
                  style={{
                    color:
                      "var(--text-secondary)",
                    fontSize: "0.8rem",
                    textAlign: "center",
                    padding: "12px 0",
                    margin: 0,
                  }}
                >
                  Run code to view test results.
                </p>
              )}
            </div>
          </div>

          {/* SOLUTION */}

          <div
            style={{
              borderTop:
                "1px solid var(--border-subtle)",
              paddingTop: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <h4
                style={{
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                Solution
              </h4>

              <button
                onClick={() =>
                  setShowSolution(
                    (previous) => !previous
                  )
                }
                className="btn-primary"
                style={{
                  padding: "5px 16px",
                  fontSize: "0.8rem",
                }}
              >
                {showSolution
                  ? "Hide"
                  : "View Solution"}
              </button>
            </div>

            {showSolution && (
              <div
                style={{
                  background: "var(--bg-app)",
                  border:
                    "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  padding: "16px",
                  fontFamily:
                    "'Fira Code', 'Courier New', monospace",
                  fontSize: "0.8rem",
                  color: "#a5b3ce",
                  lineHeight: 1.7,
                  overflowX: "auto",
                }}
              >
                <div>
                  <span style={{ color: "#c792ea" }}>
                    function
                  </span>{" "}
                  <span style={{ color: "#ffcb6b" }}>
                    twoSum
                  </span>
                  <span style={{ color: "#89ddff" }}>
                    (nums, target)
                  </span>{" "}
                  {"{"}
                </div>

                <div style={{ paddingLeft: "16px" }}>
                  <span style={{ color: "#c792ea" }}>
                    const
                  </span>{" "}
                  map ={" "}
                  <span style={{ color: "#c792ea" }}>
                    new
                  </span>{" "}
                  <span style={{ color: "#82aaff" }}>
                    Map
                  </span>
                  ();
                </div>

                <div style={{ paddingLeft: "16px" }}>
                  <span style={{ color: "#c792ea" }}>
                    for
                  </span>{" "}
                  (
                  <span style={{ color: "#c792ea" }}>
                    let
                  </span>{" "}
                  i ={" "}
                  <span style={{ color: "#f78c6c" }}>
                    0
                  </span>
                  ; i &lt; nums.length; i++) {"{"}
                </div>

                <div style={{ paddingLeft: "32px" }}>
                  <span style={{ color: "#c792ea" }}>
                    const
                  </span>{" "}
                  complement = target - nums[i];
                </div>

                <div style={{ paddingLeft: "32px" }}>
                  <span style={{ color: "#c792ea" }}>
                    if
                  </span>{" "}
                  (map.has(complement)) {"{"}
                </div>

                <div style={{ paddingLeft: "48px" }}>
                  <span style={{ color: "#c792ea" }}>
                    return
                  </span>{" "}
                  [map.get(complement), i];
                </div>

                <div style={{ paddingLeft: "32px" }}>
                  {"}"}
                </div>

                <div style={{ paddingLeft: "16px" }}>
                  {"}"}
                </div>

                <div>{"}"}</div>

                {/* Complexity */}

                <div
                  style={{
                    borderTop:
                      "1px solid var(--border-subtle)",
                    marginTop: "12px",
                    paddingTop: "12px",
                    fontFamily: "sans-serif",
                    fontSize: "0.85rem",
                  }}
                >
                  <p
                    style={{
                      margin: "2px 0",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                        color:
                          "var(--text-secondary)",
                      }}
                    >
                      Time Complexity:
                    </span>{" "}
                    O(n)
                  </p>

                  <p
                    style={{
                      margin: "2px 0",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                        color:
                          "var(--text-secondary)",
                      }}
                    >
                      Space Complexity:
                    </span>{" "}
                    O(n)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          PROGRESS SUMMARY
      ====================================================== */}

      <div
        className="card-glow"
        style={{
          padding: "24px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "24px",
          marginTop: "8px",
        }}
      >
        {/* Progress Circle */}

        <div
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
            }}
          >
            Today's Progress
          </div>

          <div
            style={{
              position: "relative",
              width: "90px",
              height: "90px",
              margin: "10px auto 0",
            }}
          >
            <svg
              viewBox="0 0 36 36"
              style={{
                transform: "rotate(-90deg)",
                width: "100%",
                height: "100%",
              }}
            >
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--border-subtle)"
                strokeWidth="3"
              />

              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--accent-purple)"
                strokeWidth="3"
                strokeDasharray="60, 100"
              />
            </svg>

            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform:
                  "translate(-50%, -50%)",
                fontWeight: "bold",
                color: "var(--text-primary)",
                fontSize: "1rem",
              }}
            >
              3/5
            </div>
          </div>
        </div>

        {/* Progress Details */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              fontSize: "0.85rem",
            }}
          >
            <span
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Solved
            </span>

            <span
              style={{
                color: "#22c55e",
                fontWeight: 600,
              }}
            >
              3
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              fontSize: "0.85rem",
            }}
          >
            <span
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Wrong
            </span>

            <span
              style={{
                color: "#ef4444",
                fontWeight: 600,
              }}
            >
              1
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              fontSize: "0.85rem",
            }}
          >
            <span
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Pending
            </span>

            <span
              style={{
                color: "var(--text-secondary)",
              }}
            >
              1
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              fontSize: "0.85rem",
              borderTop:
                "1px solid var(--border-subtle)",
              paddingTop: "8px",
              marginTop: "4px",
            }}
          >
            <span
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Accuracy
            </span>

            <span
              style={{
                color: "#22c55e",
                fontWeight: 600,
              }}
            >
              77.8%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;


