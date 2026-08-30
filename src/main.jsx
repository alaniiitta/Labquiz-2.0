import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Home,
  Brain,
  RotateCcw,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  FileText,
  LayoutGrid,
  CircleX,
  Play,
  Star,
  History,
  Trophy,
  Zap,
} from "lucide-react";
import "./styles.css";

import { parsePdfQuestions } from "./pdfPipeline.js";
import { explainQuestion } from "./lib/explainQuestion.js";
import ExplanationDisplay from "./components/ExplanationDisplay.jsx";
import {
  getQuestionIdForProgress,
  isQuestionCurrentlyFailed,
  recordQuestionAnswer,
  selectQuestionsByMode,
  shuffleQuestionOptions,
} from "./smartQuestionSelector.js";
import { getQuestionBank, topics } from "./lib/topics";
import {
  clearTestSession,
  loadSavedTest,
  loadUserData,
  saveUserData,
  saveTestSession,
} from "./lib/storage";
import {
  EmptyDataPage,
  HistoryPage,
  ProgressPage,
  ReviewPage,
  SimulacrumPage,
  WrongPage,
} from "./components/SecondaryPages";
import {
  getStreakEmoji,
  getWeeklyStats,
  getTodayStats,
  getWeakestTopic,
  getGlobalMasteryFromProgress,
} from "./lib/analytics";

const pdfFiles = import.meta.glob("/pdfs/*.pdf", {
  query: "?url",
  import: "default",
  eager: true,
});

const getPdfUrl = (id) =>
  Object.entries(pdfFiles).find(([path]) =>
    new RegExp(`(?:tema|topic)[-_\\s]*${String(id).padStart(2, "0")}(?:\\D|$)`, "i").test(path)
  )?.[1]
  ?? Object.entries(pdfFiles).find(([path]) =>
    new RegExp(`(?:tema|topic)[-_\\s]*${id}(?:\\D|$)`, "i").test(path)
  )?.[1];

const getAnswerExplanation = (question) => {
  const explanation = String(question.explanation || "").trim();
  if (explanation && !explanation.includes("automáticamente por el resaltado")) return explanation;
  return null;
};

const computeMastery = (bank, progress) => {
  if (!bank.length) return 0;
  const total = bank.reduce(
    (sum, question, index) => sum + (progress[getQuestionIdForProgress(question, index)]?.nivelDominio ?? 0),
    0
  );
  return Math.round((total / (bank.length * 5)) * 1000) / 10;
};

const getTopicMastery = (topicId, progress) => computeMastery(getQuestionBank(topicId), progress);
const getGlobalMastery = (progress) => computeMastery(topics.flatMap((topic) => getQuestionBank(topic.id)), progress);

const testModes = [
  ["smart", "Test inteligente", "Combina preguntas nuevas y repasos", Brain],
  ["failed", "Preguntas falladas", "Refuerza tus errores", CircleX],
  ["new", "Preguntas nuevas", "Avanza por el banco", FileText],
  ["review", "Repaso", "Practica lo pendiente", RotateCcw],
];

function BottomNav({ page, go, failedCount }) {
  const items = [
    ["home", "Inicio", Home],
    ["test", "Test", Brain],
    ["wrong", "Falladas", CircleX],
    ["progress", "Progreso", BarChart3],
    ["history", "Historial", History],
  ];
  return (
    <nav className="bottomNav">
      {items.map(([id, label, Icon]) => (
        <button key={id} className={page === id ? "active" : ""} onClick={() => go(id)}>
          <Icon />
          {id === "wrong" && failedCount > 0 && (
            <span className="bnBadge">{failedCount > 99 ? "99+" : failedCount}</span>
          )}
          {label}
        </button>
      ))}
    </nav>
  );
}

function App() {
  const [page, setPage] = useState("home");
  const [mobile, setMobile] = useState(false);
  const [testConfig, setTestConfig] = useState({ count: 30, mode: "smart", topicId: 0 });
  const [testEntry, setTestEntry] = useState(0);
  const [userData, setUserData] = useState(loadUserData);

  useEffect(() => {
    saveUserData(userData);
  }, [userData]);

  const savedTestAvailable = Boolean(loadSavedTest()?.testQuestions?.length);

  const failedCount = useMemo(
    () =>
      topics.reduce(
        (sum, topic) =>
          sum +
          getQuestionBank(topic.id).filter((q) =>
            isQuestionCurrentlyFailed(userData.progress[getQuestionIdForProgress(q)])
          ).length,
        0
      ),
    [userData.progress]
  );

  const go = (nextPage) => {
    setPage(nextPage);
    setMobile(false);
    window.scrollTo(0, 0);
  };

  const openTopicPicker = () => {
    clearTestSession();
    setTestConfig((prev) => ({ ...prev, topicId: null }));
    setTestEntry((entry) => entry + 1);
    go("test");
  };

  const startTest = (config) => {
    clearTestSession();
    setTestConfig(config);
    setTestEntry((entry) => entry + 1);
    go("test");
  };

  return (
    <div className="app">
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <div className="brand">
          <div className="logo">LQ</div>
          <span>
            LabQuiz <b>2.0</b>
          </span>
        </div>

        <button className="close" onClick={() => setMobile(false)}>
          <X />
        </button>

        <nav className="nav">
          {[
            ["home", "Inicio", Home],
            ["test", "Hacer test", Brain],
            ["wrong", "Falladas", CircleX],
            ["review", "Repaso", RotateCcw],
            ["progress", "Mi progreso", BarChart3],
            ["history", "Historial", History],
            ["favorites", "Favoritas", Star],
            ["simulacrum", "Simulacro", Trophy],
          ].map(([id, label, Icon]) => (
            <button key={id} className={page === id ? "active" : ""} onClick={() => go(id)}>
              <Icon />
              <span>{label}</span>
            </button>
          ))}

          <button onClick={openTopicPicker}>
            <LayoutGrid />
            <span>Test por tema</span>
          </button>
        </nav>

        <div className="sidecard">
          <Brain />
          <strong>Tu preparación</strong>
          <small>Construye tu dominio tema a tema.</small>
        </div>
      </aside>

      <main>
        <header className={page === "home" ? "homeHeader" : ""}>
          <button className="mobileMenu" onClick={() => setMobile(true)}>
            <Menu />
          </button>
          <div>
            <span className="eyebrow">OPOSICIONES · LABORATORIO</span>
            <h1>{page === "home" ? "Hola, Alana 👋" : pageTitle(page)}</h1>
          </div>
        </header>

        {page === "home" && (
          <HomePage
            data={userData}
            onStart={startTest}
            onResumeSavedTest={() => go("test")}
            savedTestAvailable={savedTestAvailable}
          />
        )}

        {page === "test" && (
          <TestPage
            key={testEntry}
            go={go}
            initialConfig={testConfig}
            questionProgress={userData.progress}
            lastTestResult={userData.history[userData.history.length - 1] ?? null}
            onQuestionAnswered={(next) => setUserData((prev) => ({ ...prev, progress: next }))}
            onSessionComplete={(result) =>
              setUserData((prev) => ({
                ...prev,
                tests: prev.tests + 1,
                answered: prev.answered + result.answered,
                correct: prev.correct + result.correct,
                incorrect: prev.incorrect + result.incorrect,
                history: [...prev.history, result],
              }))
            }
          />
        )}

        {page === "review" && <ReviewPage go={go} />}
        {page === "progress" && <ProgressPage data={userData} />}
        {page === "wrong" && <WrongPage data={userData} onStart={startTest} go={go} />}
        {page === "favorites" && (
          <EmptyDataPage
            title="Favoritas"
            message="Aquí aparecerán las preguntas que marques como favoritas."
            go={go}
          />
        )}
        {page === "history" && <HistoryPage data={userData} go={go} />}
        {page === "simulacrum" && <SimulacrumPage go={go} />}
      </main>
      <BottomNav page={page} go={go} failedCount={failedCount} />
    </div>
  );
}

const pageTitle = (page) => ({
  test: "Test",
  review: "Modo repaso",
  progress: "Progreso",
  wrong: "Preguntas falladas",
  favorites: "Favoritas",
  history: "Historial",
  simulacrum: "Simulacro",
}[page]);

function HomePage({ data, onStart, savedTestAvailable, onResumeSavedTest }) {
  const [count, setCount] = useState(30);
  const [mode, setMode] = useState("smart");
  const [topicId, setTopicId] = useState(0);

  const streak = data.streak ?? 0;
  const streakEmoji = getStreakEmoji(streak);
  const weeklyStats = useMemo(() => getWeeklyStats(data.history), [data.history]);
  const today = useMemo(() => getTodayStats(data.history), [data.history]);
  const weakest = useMemo(() => getWeakestTopic(data.progress), [data.progress]);
  const globalMastery = useMemo(() => getGlobalMasteryFromProgress(data.progress), [data.progress]);
  const maxTotal = Math.max(...weeklyStats.map((d) => d.total), 1);

  const savedSession = loadSavedTest();
  const savedTopicLabel = savedSession
    ? savedSession.selectedTopicId === 0
      ? "Todos los temas"
      : topics.find((t) => t.id === savedSession.selectedTopicId)?.title ?? "Test guardado"
    : null;
  const savedProgress = savedSession
    ? `${(savedSession.i ?? 0) + 1} / ${savedSession.testQuestions?.length ?? "?"}`
    : null;

  return (
    <div className="testHome">
      {/* ── Quick stats bar ── */}
      <div className="dashQuickStats">
        <div className="dashStat">
          <span className="dashStatEmoji">{streakEmoji}</span>
          <strong>{streak}</strong>
          <small>racha</small>
        </div>
        <div className="dashStat">
          <span className="dashStatEmoji">📝</span>
          <strong>{today.tests}</strong>
          <small>tests hoy</small>
        </div>
        <div className="dashStat">
          <span className="dashStatEmoji">✅</span>
          <strong>{today.correct}</strong>
          <small>aciertos hoy</small>
        </div>
        <div className="dashStat">
          <span className="dashStatEmoji">🎯</span>
          <strong>{globalMastery}%</strong>
          <small>dominio global</small>
        </div>
      </div>

      {/* ── Resume card ── */}
      {savedTestAvailable && (
        <div className="dashResumeCard">
          <div className="dashResumeInfo">
            <span className="dashResumeBadge">En curso</span>
            <strong>{savedTopicLabel}</strong>
            {savedProgress && <small>Pregunta {savedProgress}</small>}
          </div>
          <button className="primary dashResumeBtn" onClick={onResumeSavedTest}>
            <Play /> Continuar
          </button>
        </div>
      )}

      {/* ── Recommended topic ── */}
      {weakest && (
        <div className="dashRecommend">
          <Zap size={16} />
          <span>
            <b>Próximo recomendado:</b> {weakest.topic.title}
            <small> · dominio {weakest.mastery}%</small>
          </span>
          <button
            className="secondary dashRecommendBtn"
            onClick={() => onStart({ count, mode: "smart", topicId: weakest.topic.id })}
          >
            Practicar
          </button>
        </div>
      )}

      {/* ── Weekly mini-chart ── */}
      <div className="dashWeekly">
        <span className="dashWeeklyTitle">Últimos 7 días</span>
        <div className="dashBars">
          {weeklyStats.map((day) => (
            <div className="dashBarCol" key={day.dateStr}>
              <div className="dashBarTrack">
                <div
                  className="dashBarCorrect"
                  style={{ height: `${maxTotal ? (day.correct / maxTotal) * 100 : 0}%` }}
                  title={`${day.correct} aciertos`}
                />
                <div
                  className="dashBarIncorrect"
                  style={{ height: `${maxTotal ? (day.incorrect / maxTotal) * 100 : 0}%` }}
                  title={`${day.incorrect} fallos`}
                />
              </div>
              <span className="dashBarLabel">{day.label}</span>
            </div>
          ))}
        </div>
        <div className="dashBarLegend">
          <span><i className="legendDot legendGreen" />Aciertos</span>
          <span><i className="legendDot legendRed" />Fallos</span>
        </div>
      </div>

      {/* ── Test launch ── */}
      <section className="testLaunch">
        <span className="eyebrow">LABQUIZ</span>
        <h2>
          Practica. Aprende. <em>Repite.</em>
        </h2>
        <p>Tests rápidos y enfocados para preparar tus oposiciones.</p>
        <button className="launchButton" onClick={() => onStart({ count, mode, topicId })}>
          <Play /> Hacer test
        </button>
      </section>

      <section className="testSetup">
        <div className="setupGroup">
          <span>Número de preguntas</span>
          <div className="choiceRow">
            {[10, 20, 30, 50].map((value) => (
              <button className={count === value ? "selected" : ""} key={value} onClick={() => setCount(value)}>
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="setupGroup">
          <span>Tipo de test</span>
          <div className="modeGrid">
            {testModes.map(([id, label, description, Icon]) => (
              <button className={mode === id ? "selected" : ""} key={id} onClick={() => setMode(id)}>
                <Icon />
                <span>
                  <b>{label}</b>
                  <small>{description}</small>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="setupGroup topicSetup">
          <label htmlFor="test-topic">Tema del test</label>
          <select id="test-topic" value={topicId} onChange={(event) => setTopicId(Number(event.target.value))}>
            <option value={0}>Todos los temas</option>
            {topics.map((topic) => (
              <option value={topic.id} key={topic.id}>
                Tema {String(topic.id).padStart(2, "0")} · {topic.title}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="testHomeFooter">
        <span>{data.tests} tests realizados</span>
        <div className="testHomeActions">
          <button className="textBtn" onClick={() => onStart({ count, mode, topicId })}>
            Empezar con esta configuración <ChevronRight />
          </button>
        </div>
      </section>
    </div>
  );
}

function TestPage({ go, initialConfig, questionProgress, onQuestionAnswered, onSessionComplete, lastTestResult }) {
  const [savedSession] = useState(loadSavedTest);
  const [startTime] = useState(() => Date.now());
  const [selectedTopicId, setSelectedTopicId] = useState(savedSession?.selectedTopicId ?? initialConfig?.topicId ?? null);
  const [testConfig, setTestConfig] = useState(savedSession?.testConfig ?? (initialConfig || { count: 30, mode: "smart", topicId: 0 }));
  const [i, setI] = useState(savedSession?.i ?? 0);
  const [score, setScore] = useState(savedSession?.score ?? 0);
  const [skippedCount, setSkippedCount] = useState(savedSession?.skippedCount ?? 0);
  const [selectedAnswer, setSelectedAnswer] = useState(savedSession?.selectedAnswer ?? null);
  const [showResult, setShowResult] = useState(Boolean(savedSession?.showResult));
  const [done, setDone] = useState(Boolean(savedSession?.done));
  const [loadedQuestions, setLoadedQuestions] = useState({});
  const [loading, setLoading] = useState(false);
  const [testQuestions, setTestQuestions] = useState(savedSession?.testQuestions ?? []);
  const [failedQuestions, setFailedQuestions] = useState(savedSession?.failedQuestions ?? []);
  const [restoredSession, setRestoredSession] = useState(Boolean(savedSession?.testQuestions?.length));
  const [answerResult, setAnswerResult] = useState(null); // "correct" | "incorrect"
  const [questionKey, setQuestionKey] = useState(0);

  const currentTopic = useMemo(
    () => (selectedTopicId === 0 ? { id: 0, title: "Todos los temas" } : topics.find((t) => t.id === selectedTopicId) ?? null),
    [selectedTopicId]
  );

  const totalQuestions = testQuestions.length;
  const q = testQuestions[i] ?? null;

  useEffect(() => {
    if (!testQuestions.length) return;
    saveTestSession({
      selectedTopicId,
      testConfig,
      i,
      score,
      skippedCount,
      selectedAnswer,
      showResult,
      done,
      testQuestions,
      failedQuestions,
    });
  }, [
    selectedTopicId,
    testConfig,
    i,
    score,
    skippedCount,
    selectedAnswer,
    showResult,
    done,
    testQuestions,
    failedQuestions,
  ]);

  useEffect(() => {
    if (selectedTopicId === null || testQuestions.length) return;

    const topicIds = selectedTopicId === 0 ? topics.map((topic) => topic.id) : [selectedTopicId];
    const missing = topicIds.filter(
      (topicId) =>
        !loadedQuestions[topicId]
        && !getQuestionBank(topicId).length
        && getPdfUrl(topicId)
    );

    if (!missing.length) {
      const available = topicIds.flatMap((topicId) =>
        (loadedQuestions[topicId] ?? getQuestionBank(topicId)).map((question) => ({
          ...question,
          topicId,
          id: question.id ?? `${topicId}-${question.number}`,
        }))
      );

      setTestQuestions(
        selectQuestionsByMode(
          available,
          questionProgress,
          testConfig.count,
          testConfig.mode,
          selectedTopicId === 0 ? null : selectedTopicId
        ).map((question) => shuffleQuestionOptions(question))
      );
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all(
      missing.map((topicId) =>
        parsePdfQuestions(getPdfUrl(topicId)).then((questions) => [
          topicId,
          questions.map((question) => ({
            ...question,
            topicId,
            id: question.id ?? `${topicId}-${question.number}`,
          })),
        ])
      )
    )
      .then((entries) => {
        if (!cancelled) {
          setLoadedQuestions((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
        }
      })
      .catch((error) => console.error("No se pudo cargar el PDF del tema", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedTopicId, loadedQuestions, testConfig.count, testConfig.mode, questionProgress, testQuestions.length]);

  const resetSelection = () => {
    clearTestSession();
    setRestoredSession(false);
    setSelectedTopicId(null);
    setI(0);
    setScore(0);
    setSkippedCount(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setDone(false);
    setTestQuestions([]);
    setFailedQuestions([]);
  };

  const finishTest = (nextSkippedCount = skippedCount) => {
    const answeredCount = Math.max(totalQuestions - nextSkippedCount, 0);
    const finalCorrect = score;
    clearTestSession();

    onSessionComplete?.({
      topicId: selectedTopicId,
      topicIds: [...new Set(testQuestions.map((question) => question.topicId))],
      answered: answeredCount,
      correct: finalCorrect,
      incorrect: Math.max(answeredCount - finalCorrect, 0),
      skipped: nextSkippedCount,
      percentage: answeredCount ? Math.round((finalCorrect / answeredCount) * 100) : 0,
      questionIds: testQuestions.map((question) => getQuestionIdForProgress(question, 0)),
      completedAt: new Date().toISOString(),
    });

    setDone(true);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answerIndex) => {
    if (!q || showResult) return;
    const isCorrect = answerIndex === q.correctAnswer;
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setAnswerResult(isCorrect ? "correct" : "incorrect");
    onQuestionAnswered?.(recordQuestionAnswer(q, questionProgress, isCorrect, Date.now(), answerIndex));
    if (isCorrect) setScore((prev) => prev + 1);
    else setFailedQuestions((prev) => [...prev, q]);
  };

  const handleNext = () => {
    setAnswerResult(null);
    setQuestionKey((k) => k + 1);
    if (i >= totalQuestions - 1) {
      finishTest();
      return;
    }
    setI((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleSkip = () => {
    if (!q || showResult) return;
    const nextSkippedCount = skippedCount + 1;
    setSkippedCount(nextSkippedCount);
    setAnswerResult(null);
    setQuestionKey((k) => k + 1);

    if (i >= totalQuestions - 1) {
      finishTest(nextSkippedCount);
      return;
    }

    setI((prev) => prev + 1);
  };

  if (selectedTopicId === null) {
    const globalMastery = getGlobalMastery(questionProgress);

    return (
      <div className="testThemeSelector">
        <div className="testMeta">
          <span>SELECCIÓN DE TEMA</span>
          <b>{topics.length} temas</b>
        </div>

        <div className="testTopicsGrid">
          <button
            className="topicSelectCard"
            onClick={() => {
              setSelectedTopicId(0);
              setI(0);
              setScore(0);
              setSkippedCount(0);
              setSelectedAnswer(null);
              setShowResult(false);
              setDone(false);
            }}
          >
            <span className="badge">TEST GLOBAL</span>
            <h3>Todos los temas</h3>
            <small>Todos los bancos disponibles</small>
            <div className="topicMastery">
              <div>
                <span>Dominio global</span>
                <b>{globalMastery}%</b>
              </div>
              <i>
                <em style={{ width: `${globalMastery}%` }} />
              </i>
            </div>
          </button>

          {topics.map((topic) => {
            const bank = getQuestionBank(topic.id);
            const questionCount = bank.length;
            const available = questionCount || getPdfUrl(topic.id);
            const mastery = getTopicMastery(topic.id, questionProgress);
            const failedInTopic = bank.filter((q) =>
              isQuestionCurrentlyFailed(questionProgress[getQuestionIdForProgress(q)])
            ).length;
            const masteryColor = mastery >= 70 ? "green" : mastery >= 40 ? "yellow" : "red";
            const masteryEmoji = mastery >= 70 ? "🟢" : mastery >= 40 ? "🟡" : "🔴";

            return (
              <button
                key={topic.id}
                className={`topicSelectCard mastery-${masteryColor}`}
                onClick={() => {
                  setSelectedTopicId(topic.id);
                  setI(0);
                  setScore(0);
                  setSkippedCount(0);
                  setSelectedAnswer(null);
                  setShowResult(false);
                  setDone(false);
                }}
              >
                <div className="topicCardHeader">
                  <span className="badge">Tema {String(topic.id).padStart(2, "0")}</span>
                  <span className="topicMasteryEmoji">{masteryEmoji}</span>
                  {failedInTopic > 0 && (
                    <span className="topicFailedBadge">{failedInTopic > 99 ? "99+" : failedInTopic}</span>
                  )}
                </div>
                <h3>{topic.title}</h3>
                <small>
                  {available
                    ? questionCount
                      ? `${questionCount} preguntas`
                      : "Preguntas disponibles"
                    : "Próximamente"}
                </small>
                {available && (
                  <div className="topicMastery">
                    <div>
                      <span>Dominio</span>
                      <b>{mastery}%</b>
                    </div>
                    <i>
                      <em style={{ width: `${mastery}%` }} />
                    </i>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="result card">
        <div className="resultIcon">📄</div>
        <h2>Cargando preguntas</h2>
        <p>Estamos leyendo el PDF del tema seleccionado.</p>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="result card">
        <div className="resultIcon">📘</div>
        <h2>Este tema aún no tiene preguntas</h2>
        <p>El banco de preguntas está preparado para añadirse desde archivos separados por tema.</p>
        <button className="primary" onClick={resetSelection}>
          Volver a temas
        </button>
      </div>
    );
  }

  if (done) {
    const answeredCount = Math.max(totalQuestions - skippedCount, 0);
    const accuracy = answeredCount ? Math.round((score / answeredCount) * 100) : 0;
    const incorrectCount = Math.max(answeredCount - score, 0);
    const elapsedSec = Math.round((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsedSec / 60);
    const secs = elapsedSec % 60;
    const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

    const prevAccuracy = lastTestResult?.percentage ?? null;
    const diff = prevAccuracy !== null ? accuracy - prevAccuracy : null;

    const grade =
      accuracy >= 85 ? { label: "¡Excelente! 🎉", cls: "excellent" } :
      accuracy >= 70 ? { label: "Muy bien 👍", cls: "good" } :
      accuracy >= 50 ? { label: "Regular", cls: "regular" } :
      { label: "Necesitas practicar más", cls: "needsWork" };

    // Donut chart (SVG)
    const total = answeredCount + skippedCount || 1;
    const correctPct = (score / total) * 100;
    const incorrectPct = (incorrectCount / total) * 100;
    const skippedPct = (skippedCount / total) * 100;
    const r = 40;
    const circ = 2 * Math.PI * r;
    const c1 = (correctPct / 100) * circ;
    const c2 = (incorrectPct / 100) * circ;
    const c3 = (skippedPct / 100) * circ;
    const offset1 = 0;
    const offset2 = circ - c1;
    const offset3 = circ - c1 - c2;

    // Recommendation
    let recommendation = null;
    if (incorrectCount > 0 && failedQuestions.length > 0) {
      recommendation = "🔄 Repasa tus errores para fortalecer el dominio.";
    } else if (accuracy >= 85) {
      recommendation = "🚀 ¡Genial! Prueba un nuevo tema para seguir avanzando.";
    } else {
      recommendation = "💡 Sigue practicando este tema para mejorar tu dominio.";
    }

    return (
      <div className="resultScreen">
        <span className="resultIcon">🏆</span>
        <h2 className="resultTitle">Test completado</h2>
        <div className="resultScore">
          <strong>{score}</strong>
          <span>/ {answeredCount || totalQuestions}</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <span className={`resultBadge ${grade.cls}`}>{grade.label}</span>
        </div>
        {diff !== null && (
          <p className={`resultCompare ${diff > 0 ? "up" : diff < 0 ? "down" : ""}`}>
            Comparado con tu último test: <b>{diff > 0 ? `↑ +${diff}%` : diff < 0 ? `↓ ${diff}%` : "= igual"}</b>
          </p>
        )}

        {/* Donut chart */}
        <div className="resultDonut">
          <svg viewBox="0 0 100 100" width="100" height="100">
            <circle cx="50" cy="50" r={r} fill="none" stroke="#e8eeed" strokeWidth="14" />
            {score > 0 && (
              <circle
                cx="50" cy="50" r={r} fill="none"
                stroke="#27a869" strokeWidth="14"
                strokeDasharray={`${c1} ${circ - c1}`}
                strokeDashoffset={circ / 4}
                strokeLinecap="round"
              />
            )}
            {incorrectCount > 0 && (
              <circle
                cx="50" cy="50" r={r} fill="none"
                stroke="#c94040" strokeWidth="14"
                strokeDasharray={`${c2} ${circ - c2}`}
                strokeDashoffset={circ / 4 - c1}
                strokeLinecap="round"
              />
            )}
            {skippedCount > 0 && (
              <circle
                cx="50" cy="50" r={r} fill="none"
                stroke="#bbb" strokeWidth="14"
                strokeDasharray={`${c3} ${circ - c3}`}
                strokeDashoffset={circ / 4 - c1 - c2}
                strokeLinecap="round"
              />
            )}
            <text x="50" y="54" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1a2a22">{accuracy}%</text>
          </svg>
          <div className="donutLegend">
            <span><i style={{ background: "#27a869" }} />{score} aciertos</span>
            <span><i style={{ background: "#c94040" }} />{incorrectCount} fallos</span>
            {skippedCount > 0 && <span><i style={{ background: "#bbb" }} />{skippedCount} omitidas</span>}
          </div>
        </div>

        <div className="resultStats">
          <div className="resultStat correct-stat">
            <small>Aciertos</small>
            <strong>{score}</strong>
            <small>{accuracy}%</small>
          </div>
          <div className="resultStat incorrect-stat">
            <small>Fallos</small>
            <strong>{incorrectCount}</strong>
            <small>{answeredCount ? Math.round((incorrectCount / answeredCount) * 100) : 0}%</small>
          </div>
          <div className="resultStat skipped-stat">
            <small>Omitidas</small>
            <strong>{skippedCount}</strong>
            <small>sin responder</small>
          </div>
        </div>
        <p className="resultTime">⏱ Tiempo dedicado: {timeStr}</p>

        {/* Failed questions preview */}
        {failedQuestions.length > 0 && (
          <div className="resultFailedPreview">
            <h3>Preguntas en las que fallaste ({failedQuestions.length})</h3>
            <ul>
              {failedQuestions.slice(0, 3).map((fq, idx) => (
                <li key={fq.id ?? idx}>{fq.question.length > 80 ? fq.question.slice(0, 80) + "…" : fq.question}</li>
              ))}
              {failedQuestions.length > 3 && <li className="muted">…y {failedQuestions.length - 3} más</li>}
            </ul>
          </div>
        )}

        {/* Recommendation */}
        <div className="resultRecommendation">
          <p>{recommendation}</p>
        </div>

        <div className="resultActions">
          {failedQuestions.length > 0 && (
            <button
              className="primary"
              onClick={() => {
                setTestQuestions(failedQuestions);
                setI(0);
                setScore(0);
                setSkippedCount(0);
                setFailedQuestions([]);
                setAnswerResult(null);
                setDone(false);
              }}
            >
              🔁 Repasar {failedQuestions.length} fallos
            </button>
          )}
          <button
            className="secondary"
            onClick={() => {
              setI(0);
              setScore(0);
              setSkippedCount(0);
              setSelectedAnswer(null);
              setShowResult(false);
              setAnswerResult(null);
              setDone(false);
            }}
          >
            Repetir test
          </button>
          <button className="secondary" onClick={resetSelection}>
            Cambiar test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="testWrap">
      <div className="testMeta">
        <span>{currentTopic?.title?.toUpperCase() || "TEST"}</span>
        <b>
          {i + 1} / {totalQuestions}
        </b>
      </div>

      <div className="progressLine">
        <i style={{ width: `${((i + 1) / totalQuestions) * 100}%` }} />
      </div>

      <div className={`testCard${answerResult ? ` answerFeedback-${answerResult}` : ""}`} key={questionKey}>
        <span className="badge">
          {selectedTopicId === 0 ? "TEST GLOBAL" : `Tema ${String(currentTopic.id).padStart(2, "0")}`}
        </span>

        {restoredSession && <p className="testResumeHint">Has retomado tu test guardado.</p>}

        <h2 className="questionFade">{q.question}</h2>

        <div className="answers">
          {q.answers.map((answer, index) => {
            const isCorrect = index === q.correctAnswer;
            const isSelected = selectedAnswer === index;
            const isWrongSelected = showResult && isSelected && !isCorrect;
            let cls = "";
            if (showResult) {
              if (isCorrect) cls = "correct";
              else if (isSelected) cls = `incorrect${isWrongSelected ? " shake" : ""}`;
            } else if (isSelected) {
              cls = "selected";
            }
            return (
              <button
                key={answer + index}
                type="button"
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={cls}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {answer}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={`answerFeedbackIcon ${answerResult}`}>
            {answerResult === "correct" ? "✓" : "✗"}
          </div>
        )}

        {showResult && (
          <ExplanationDisplay
            structured={explainQuestion(q, q.topicId)}
            fallback={getAnswerExplanation(q)}
            correctAnswerText={q.answers[q.correctAnswer]}
            isCorrect={selectedAnswer === q.correctAnswer}
          />
        )}

        <div className="testActions">
          {showResult ? (
            <button className="primary" onClick={handleNext}>
              {i === totalQuestions - 1 ? "Ver resultado" : "Siguiente"}
            </button>
          ) : (
            <button className="secondary" onClick={handleSkip}>
              {i === totalQuestions - 1 ? "Terminar sin responder" : "Siguiente sin responder"}
            </button>
          )}
          <button className="secondary" onClick={resetSelection}>
            Cambiar test
          </button>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
