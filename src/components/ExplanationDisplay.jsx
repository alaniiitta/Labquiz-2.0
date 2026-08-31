import React from "react";

/**
 * Renders a structured educational explanation after an answer is submitted.
 *
 * @param {object} props
 * @param {object|null} props.structured - Explanation object from explainQuestion()
 * @param {string} props.fallback - Plain-text fallback when no structured data exists
 * @param {string} props.correctAnswerText - Human-readable text of the correct answer
 * @param {string} props.selectedAnswerText - Human-readable text of the selected answer
 * @param {boolean} props.isCorrect - Whether the user answered correctly
 */
export default function ExplanationDisplay({ structured, fallback, correctAnswerText, selectedAnswerText, isCorrect }) {
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

  const {
    porQueLaCorrecta,
    motivosPorOpcion,
    claveMemorizar,
    fuente,
    advertenciaRevision,
  } = structured;
  const motivoDeLaSeleccion = !isCorrect
    ? motivosPorOpcion?.[selectedAnswerText]
    : null;

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
          <strong>Explicación:</strong> {porQueLaCorrecta}
        </p>
      )}

      {motivoDeLaSeleccion && (
        <p className="explanationWrong">
          <strong>Por qué tu opción no es correcta:</strong> {motivoDeLaSeleccion}
        </p>
      )}

      {claveMemorizar && (
        <p className="explanationKey">
          <span className="explanationIcon">⭐</span>
          <strong>Clave:</strong> {claveMemorizar}
        </p>
      )}

      {fuente && (
        <p className="explanationSource">
          <strong>Fuente:</strong> {fuente}
        </p>
      )}

      {advertenciaRevision && (
        <p className="explanationWarning">
          <strong>Nota de revisión:</strong> {advertenciaRevision}
        </p>
      )}
    </div>
  );
}
