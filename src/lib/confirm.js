// Pregunta «¿seguro?». Dentro de claude.ai los cuadros del navegador (window.confirm) no se
// muestran y siempre contestan «no», así que allí se dibuja uno propio.
import { inClaude } from "./claudeSync.js";

export function askConfirm(message) {
 if (!inClaude()) return Promise.resolve(window.confirm(message));
 return new Promise(resolve => {
  const overlay = document.createElement("div");
  overlay.className = "confirmOverlay";
  overlay.innerHTML = `<div class="confirmBox" role="alertdialog" aria-modal="true"><p></p><div class="confirmActions"><button type="button" class="secondary">Cancelar</button><button type="button" class="primary">Aceptar</button></div></div>`;
  overlay.querySelector("p").textContent = message;
  const close = answer => { overlay.remove(); resolve(answer); };
  const [cancel, accept] = overlay.querySelectorAll("button");
  cancel.addEventListener("click", () => close(false));
  accept.addEventListener("click", () => close(true));
  overlay.addEventListener("click", event => { if (event.target === overlay) close(false); });
  document.body.appendChild(overlay);
  accept.focus();
 });
}
