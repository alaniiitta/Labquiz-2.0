import React from "react";
import { History, Play, Trophy } from "lucide-react";
import { topics, getQuestionBank } from "../lib/topics";
import {
  getQuestionIdForProgress,
  isQuestionCurrentlyFailed,
} from "../smartQuestionSelector";

function Stat({ icon, value, label }) {
  return (
    <div className="stat">
      <span>{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  );
}

export function ReviewPage({ go }) {
  return (
    <div>
      <div className="reviewHero">
        <h2>Tu zona de repaso</h2>
        <p>El repaso se activará cuando respondas tus primeras preguntas.</p>
        <button className="primary" onClick={() => go("test")}>
          Empezar un test
        </button>
      </div>
    </div>
  );
}

function getMasteryColor(pct) {
  if (pct >= 70) return "green";
  if (pct >= 40) return "yellow";
  return "red";
}

export function ProgressPage({ data }) {
  const accuracy = data.answered ? Math.round((data.correct / data.answered) * 100) : 0;

  const topicStats = topics.map((topic) => {
    const bank = getQuestionBank(topic.id);
    if (!bank.length) return null;
    let answered = 0;
    let correct = 0;
    let failed = 0;
    bank.forEach((question) => {
      const pid = getQuestionIdForProgress(question);
      const p = data.progress[pid];
      if (!p) return;
      if (p.vecesVista > 0) {
        answered++;
        correct += p.vecesAcertada ?? 0;
      }
      if (isQuestionCurrentlyFailed(p)) failed++;
    });
    const mastery = answered ? Math.round((correct / answered) * 100) : 0;
    const color = getMasteryColor(mastery);
    return { topic, bank, answered, correct, failed, mastery, color };
  }).filter(Boolean);

  return (
    <div>
      <div className="progressHero">
        <h2>Mi progreso</h2>
        <p>{data.tests} tests realizados · {data.answered} preguntas respondidas</p>
      </div>

      <div className="globalStats">
        <div className="globalStat">
          <small>Aciertos</small>
          <strong style={{ color: "#27a869" }}>{accuracy}%</strong>
          <small>{data.correct} correctas</small>
        </div>
        <div className="globalStat">
          <small>Respondidas</small>
          <strong>{data.answered}</strong>
          <small>de todas</small>
        </div>
        <div className="globalStat">
          <small>Fallos</small>
          <strong style={{ color: "#c94040" }}>{data.incorrect}</strong>
          <small>incorrectas</small>
        </div>
        <div className="globalStat">
          <small>Tests</small>
          <strong>{data.tests}</strong>
          <small>completados</small>
        </div>
      </div>

      <div className="topicsProgressSection">
        <h3>Progreso por tema</h3>
        <div className="domainLegend">
          <span><span className="dot red" />Iniciando (0–40%)</span>
          <span><span className="dot yellow" />Avanzando (40–70%)</span>
          <span><span className="dot green" />Dominado (70–100%)</span>
        </div>
        {topicStats.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>Empieza tus primeros tests para ver el progreso por tema.</p>
        ) : (
          <div className="topicsProgressTable">
            {topicStats.map(({ topic, bank, answered, correct, failed, mastery, color }) => (
              <div className="topicProgressRow" key={topic.id}>
                <div className="topicProgressHeader">
                  <span className="topicProgressName">
                    <b style={{ fontSize: 11, color: "var(--muted)" }}>T{String(topic.id).padStart(2, "0")} · </b>
                    {topic.title}
                  </span>
                  <span className={`topicProgressPct pct-${color}`}>{mastery}%</span>
                </div>
                <div className="topicProgressBar">
                  <i className={`bar-${color}`} style={{ width: `${mastery}%` }} />
                </div>
                <div className="topicProgressDetails">
                  <span><b>{answered}</b> respondidas</span>
                  <span><b>{correct}</b> correctas</span>
                  <span><b>{bank.length}</b> totales</span>
                  {failed > 0 && <span style={{ color: "#c94040" }}><b>{failed}</b> pendientes</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyDataPage({ title, message, go }) {
  return (
    <div className="emptyPage">
      <div className="emptyIcon">
        <History />
      </div>
      <h2>{title}</h2>
      <p>{message}</p>
      <button className="primary" onClick={() => go("test")}>
        <Play /> Empezar test
      </button>
    </div>
  );
}

export function WrongPage({ data, onStart, go }) {
  const failedItems = [];
  topics.forEach((topic) => {
    getQuestionBank(topic.id).forEach((question) => {
      const pid = getQuestionIdForProgress(question);
      const p = data.progress[pid];
      if (isQuestionCurrentlyFailed(p)) {
        failedItems.push({ question, topic, progress: p });
      }
    });
  });

  const failedCount = failedItems.length;

  if (!failedCount) {
    return (
      <EmptyDataPage
        title="Preguntas falladas"
        message="Aquí aparecerán las preguntas que respondas incorrectamente."
        go={go}
      />
    );
  }

  return (
    <div>
      <div className="wrongHero">
        <h2>Preguntas falladas</h2>
        <p>Revisa y practica estas preguntas para reforzar tus conocimientos.</p>
        <div className="wrongStats">
          <div className="wrongStat">
            <strong>{failedCount}</strong>
            <small>Pendientes</small>
          </div>
        </div>
        <button className="primary" onClick={() => onStart({ count: Math.min(30, failedCount), mode: "failed", topicId: 0 })}>
          <Play /> Hacer test de falladas
        </button>
      </div>

      <div className="wrongList">
        {failedItems.map(({ question, topic, progress }, idx) => {
          const attempts = progress?.vecesVista ?? 0;
          const wrongAns = progress?.respuestaElegida;
          return (
            <div className="wrongItem" key={question.id ?? idx}>
              <p className="wrongQ">{question.question}</p>
              <div className="wrongAnswers">
                {question.answers.map((ans, i) => {
                  const isCorrect = i === question.correctAnswer;
                  const isWrong = wrongAns !== undefined && i === wrongAns && !isCorrect;
                  return (
                    <div
                      key={i}
                      className={`wrongAnswer ${isCorrect ? "correct-ans" : isWrong ? "wrong-ans" : "other-ans"}`}
                    >
                      <span className="ansLetter">{String.fromCharCode(65 + i)}</span>
                      {ans}
                    </div>
                  );
                })}
              </div>
              <div className="wrongMeta">
                <span>Tema {String(topic.id).padStart(2, "0")} · {topic.title}</span>
                {attempts > 0 && <span className="failTag">{attempts} intentos</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HistoryPage({ data, go }) {
  if (!data.history.length) {
    return <EmptyDataPage title="Historial" message="Todavía no has realizado ningún test." go={go} />;
  }

  return (
    <div>
      <div className="pageIntro">
        <div>
          <span className="eyebrow">HISTORIAL</span>
          <h2>Tests realizados</h2>
        </div>
      </div>
      <div className="historyList">
        {data.history.map((session, index) => (
          <article className="historyItem" key={`${session.completedAt}-${index}`}>
            <div>
              <b>
                {session.topicIds?.length > 1
                  ? "Todos los temas"
                  : `Tema ${String(session.topicId).padStart(2, "0")}`}
              </b>
              <small>{new Date(session.completedAt).toLocaleString("es-ES")}</small>
            </div>
            <strong>
              {session.correct}/{session.answered}
            </strong>
          </article>
        ))}
      </div>
      <button className="primary" onClick={() => go("test")}>
        <Play /> Hacer otro test
      </button>
    </div>
  );
}

export function SimulacrumPage({ go }) {
  return (
    <div>
      <section className="simHero">
        <Trophy />
        <h2>Simulacro de oposición</h2>
        <p>El simulacro estará disponible cuando haya preguntas cargadas.</p>
        <button className="secondary" onClick={() => go("test")}>
          Ver temas disponibles
        </button>
      </section>
    </div>
  );
}
