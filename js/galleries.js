"use strict";

// Capturas existentes del proyecto: vistas de componentes, no mockups.
const capturasKing = [
  { src: "assets/images/projects/king/king-01.webp", alt: "KING: cinco estados del componente visual Galaxy", caption: "01 / GALAXY · ESTADOS VISUALES" },
  { src: "assets/images/projects/king/king-02.webp", alt: "KING: cinco estados del componente visual Digital Eye", caption: "02 / DIGITAL EYE · ESTADOS VISUALES" },
  { src: "assets/images/projects/king/king-03.webp", alt: "KING: estados idle, listening, thinking, speaking y error del componente Horror", caption: "03 / HORROR · ESTADOS VISUALES" }
];
const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)");
const galeriaKing = document.querySelector('[data-gallery="king"]');
const miniaturas = [...galeriaKing.querySelectorAll("[data-gallery-index]")];
let indiceKing = 0;
let solicitudKing = 0;

async function seleccionarKing(indice) {
  const solicitud = ++solicitudKing;
  if (indice === indiceKing) {
    galeriaKing.removeAttribute("aria-busy");
    return;
  }
  const captura = capturasKing[indice];
  const actual = galeriaKing.querySelector("[data-gallery-main]");
  const nueva = actual.cloneNode();
  const estado = galeriaKing.querySelector("[data-gallery-status]");
  nueva.src = captura.src;
  nueva.alt = captura.alt;
  nueva.loading = "eager";
  galeriaKing.setAttribute("aria-busy", "true");
  try {
    await nueva.decode();
    if (solicitud !== solicitudKing) return;
    actual.replaceWith(nueva);
    indiceKing = indice;
    miniaturas.forEach((boton, posicion) => boton.setAttribute("aria-pressed", String(posicion === indice)));
    galeriaKing.querySelector("[data-gallery-caption]").textContent = captura.caption;
    galeriaKing.querySelector("[data-gallery-original]").href = captura.src;
    estado.textContent = `Captura ${indice + 1} de ${capturasKing.length}: ${captura.caption.split(" / ")[1]}`;
    if (!movimientoReducido.matches) {
      nueva.animate([{ opacity: .2, translate: "4px 0" }, { opacity: 1, translate: "0 0" }], { duration: 240, easing: "ease-out" });
    }
  } catch {
    if (solicitud === solicitudKing) estado.textContent = "No se pudo cargar esta captura. Puedes volver a intentarlo.";
  } finally {
    if (solicitud === solicitudKing) galeriaKing.removeAttribute("aria-busy");
  }
}
galeriaKing.querySelector(".king-thumbnails").hidden = false;
miniaturas.forEach((boton, indice) => {
  boton.addEventListener("click", () => seleccionarKing(indice));
  boton.addEventListener("keydown", (event) => {
    const destinos = { ArrowRight: (indice + 1) % miniaturas.length, ArrowLeft: (indice + miniaturas.length - 1) % miniaturas.length, Home: 0, End: miniaturas.length - 1 };
    if (!(event.key in destinos)) return;
    event.preventDefault();
    miniaturas[destinos[event.key]].focus();
    seleccionarKing(destinos[event.key]);
  });
});
const escenarioKing = galeriaKing.querySelector(".king-stage");
let gestoKing = null;
escenarioKing.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch") gestoKing = { x: event.clientX, y: event.clientY };
});
escenarioKing.addEventListener("pointercancel", () => { gestoKing = null; });
escenarioKing.addEventListener("pointerup", (event) => {
  if (!gestoKing) return;
  const distancia = event.clientX - gestoKing.x;
  const vertical = Math.abs(event.clientY - gestoKing.y);
  gestoKing = null;
  if (Math.abs(distancia) > 50 && vertical < 50) seleccionarKing((indiceKing + (distancia < 0 ? 1 : capturasKing.length - 1)) % capturasKing.length);
});

// Blind Echoes mantiene un archivo horizontal con desplazamiento nativo táctil.
const galeriaBlind = document.querySelector('[data-gallery="blind-echoes"]');
const tiraBlind = galeriaBlind.querySelector(".blind-rail");
const vistasBlind = [...tiraBlind.querySelectorAll("figure")];
const anteriorBlind = galeriaBlind.querySelector("[data-gallery-prev]");
const siguienteBlind = galeriaBlind.querySelector("[data-gallery-next]");
let indiceBlind = 0;
let cuadroPendiente = false;

function actualizarBlind() {
  const inicio = tiraBlind.getBoundingClientRect().left;
  const distancias = vistasBlind.map((vista) => Math.abs(vista.getBoundingClientRect().left - inicio));
  indiceBlind = distancias.indexOf(Math.min(...distancias));
  anteriorBlind.disabled = indiceBlind === 0;
  siguienteBlind.disabled = indiceBlind === vistasBlind.length - 1;
  galeriaBlind.querySelector("[data-gallery-count]").textContent = `0${indiceBlind + 1} / 0${vistasBlind.length}`;
  galeriaBlind.querySelector("[data-gallery-status]").textContent = `Vista ${indiceBlind + 1} de ${vistasBlind.length}`;
}
function desplazarBlind(indice) {
  const vista = vistasBlind[Math.max(0, Math.min(indice, vistasBlind.length - 1))];
  const desplazamiento = vista.getBoundingClientRect().left - tiraBlind.getBoundingClientRect().left + tiraBlind.scrollLeft;
  tiraBlind.scrollTo({ left: desplazamiento, behavior: movimientoReducido.matches ? "instant" : "smooth" });
}
galeriaBlind.querySelector(".gallery-controls").hidden = false;
anteriorBlind.addEventListener("click", () => desplazarBlind(indiceBlind - 1));
siguienteBlind.addEventListener("click", () => desplazarBlind(indiceBlind + 1));
tiraBlind.addEventListener("keydown", (event) => {
  // Las flechas pertenecen al rail cuando tiene foco, no a sus enlaces.
  if (event.target !== tiraBlind) return;
  const destinos = { ArrowRight: indiceBlind + 1, ArrowLeft: indiceBlind - 1, Home: 0, End: vistasBlind.length - 1 };
  if (!(event.key in destinos)) return;
  event.preventDefault();
  desplazarBlind(destinos[event.key]);
});
tiraBlind.addEventListener("scroll", () => {
  if (cuadroPendiente) return;
  cuadroPendiente = true;
  requestAnimationFrame(() => { actualizarBlind(); cuadroPendiente = false; });
}, { passive: true });
window.addEventListener("resize", actualizarBlind);
actualizarBlind();
