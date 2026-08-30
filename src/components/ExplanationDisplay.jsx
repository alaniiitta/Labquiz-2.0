import React from "react";

/**
 * Renders a structured educational explanation after an answer is submitted.
 *
 * @param {object} props
 * @param {object|null} props.structured - Explanation object from explainQuestion()
 * @param {string} props.fallback - Plain-text fallback when no structured data exists
 * @param {string} props.correctAnswerText - Human-readable text of the correct answer
 * @param {boolean} props.isCorrect - Whether the user answered correctly
 */
export default function ExplanationDisplay({ structured, fallback, correctAnswerText, isCorrect }) {
  if (!structured) {
    return (
      <div className="explanationBlock">
        <p className={isCorrect ? "testStatus success" : "testStatus error"}>
          {isCorrect ? "✅ Correcto" : "❌ Incorrecto"}
        </p>
        <p>
          <strong>Respuesta correcta:</strong> {correctAnswerText}
        </p>
        {fallback && (
          <p>
            <strong>Explicación:</strong> {fallback}
          </p>
        )}
      </div>
    );
  }

  const { porQueLaCorrecta, porQueNoLasOtras, ojoEnElExamen, claveMemorizar } = structured;

  return (
    <div className="explanationBlock">
      <p className={isCorrect ? "testStatus success" : "testStatus error"}>
        {isCorrect ? "✅ Correcto" : "❌ Incorrecto"}
      </p>
      <p>
        <strong>Respuesta correcta:</strong> {correctAnswerText}
      </p>

      {porQueLaCorrecta && (
        <p className="explanationWhy">
          <span className="explanationIcon">🧠</span>
          <strong>Por qué:</strong> {porQueLaCorrecta}
        </p>
      )}

      {ojoEnElExamen && (
        <p className="explanationWarning">
          <span className="explanationIcon">⚠️</span>
          <strong>Ojo en el examen:</strong> {ojoEnElExamen}
        </p>
      )}

      {claveMemorizar && (
        <p className="explanationKey">
          <span className="explanationIcon">⭐</span>
          <strong>Clave para memorizar:</strong> {claveMemorizar}
        </p>
      )}

      {porQueNoLasOtras && Object.keys(porQueNoLasOtras).length > 0 && (
        <div className="explanationOthers">
          <p>
            <strong>Por qué NO las otras:</strong>
          </p>
          <ul>
            {Object.entries(porQueNoLasOtras).map(([letter, reason]) => (
              <li key={letter}>
                <strong>{letter}:</strong> {reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
