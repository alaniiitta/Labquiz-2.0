import React from "react";

/**
 * Renders a short explanation after an answer is submitted:
 * result, correct answer, explanation and a key idea to memorize.
 *
 * @param {object} props
 * @param {object|null} props.structured - Explanation object from explainQuestion()
 * @param {string} props.fallback - Plain-text fallback when no structured data exists
 * @param {string} props.correctAnswerText - Human-readable text of the correct answer
 * @param {boolean} props.isCorrect - Whether the user answered correctly
 */
export default function ExplanationDisplay({ structured, fallback, correctAnswerText, isCorrect }) {
  const explanation = structured?.porQueLaCorrecta || fallback;
  const key = structured?.claveMemorizar;

  return (
    <div className="explanationBlock">
      <p className={isCorrect ? "testStatus success" : "testStatus error"}>
        {isCorrect ? "✅ Correcto" : "❌ Incorrecto"}
      </p>
      <p>
        <strong>Respuesta correcta:</strong> {correctAnswerText}
      </p>

      {explanation && (
        <p className="explanationWhy">
          <span className="explanationIcon">🧠</span>
          <strong>Explicación:</strong> {explanation}
        </p>
      )}

      {key && (
        <p className="explanationKey">
          <span className="explanationIcon">⭐</span>
          <strong>Clave:</strong> {key}
        </p>
      )}
    </div>
  );
}
