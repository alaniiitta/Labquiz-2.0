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

export function ProgressPage({ data }) {
  const accuracy = data.answered ? Math.round((data.correct / data.answered) * 100) : 0;

  return (
    <div>
      <div className="stats">
        <Stat icon="🎯" value={`${accuracy}%`} label="Aciertos" />
        <Stat icon="🧠" value={data.answered} label="Preguntas respondidas" />
        <Stat icon="✅" value={data.correct} label="Aciertos" />
        <Stat icon="❌" value={data.incorrect} label="Fallos" />
      </div>
      <section className="section card">
        <h3>{data.tests ? "Progreso por tema" : "Sin datos de progreso"}</h3>
        <p>
          {data.tests
            ? "Tu avance se guarda automáticamente mientras haces tests y las estadísticas se resumen al completar cada uno."
            : "Tu progreso se guardará automáticamente cuando empieces tus primeros tests."}
        </p>
      </section>
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
  const failedCount = topics.reduce(
    (sum, topic) =>
      sum +
      getQuestionBank(topic.id).filter((question) =>
        isQuestionCurrentlyFailed(data.progress[getQuestionIdForProgress(question)])
      ).length,
    0
  );

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
      <div className="reviewHero">
        <h2>Preguntas falladas</h2>
        <p>Tienes {failedCount} preguntas falladas pendientes de reforzar.</p>
        <button className="primary" onClick={() => onStart({ count: 30, mode: "failed", topicId: 0 })}>
          <Play /> Hacer test de falladas
        </button>
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
