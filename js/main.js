"use strict";

// Información proporcionada por Jaasiel. No ampliar el alcance sin confirmarlo.
// Las capturas de desarrollo se distinguen del material todavía pendiente.
// repositorio: añadir una URL real; vacío mantiene el enlace oculto.
const proyectos = {
  king: {
    nombre: "KING",
    tipo: "01 / PROYECTO PERSONAL",
    descripcion: "KING es un proyecto personal de Jaasiel Delgado Reyes: un asistente local orientado a automatizar y controlar funciones del sistema en Linux. Las tecnologías conocidas son Python, Ollama, Playwright, Linux y Git. Las imágenes muestran componentes reales de la interfaz en vistas de desarrollo. El enlace al repositorio está pendiente.",
    tecnologias: ["Python", "Ollama", "Playwright", "Linux", "Git"],
    caracteristicas: ["Asistente de ejecución local.", "Automatización y control de funciones del sistema.", "Entorno de trabajo: Linux."],
    imagen: "assets/images/projects/king/king-01.webp",
    alt: "KING: cinco estados del componente visual Galaxy",
    notaImagen: "CAPTURA REAL / COMPONENTE DE INTERFAZ EN DESARROLLO",
    repositorio: ""
  },
  "blind-echoes": {
    nombre: "Blind Echoes",
    tipo: "02 / PERSONAL · VIDEOJUEGO EN DESARROLLO",
    descripcion: "Blind Echoes es mi proyecto personal de videojuego en desarrollo para Roblox. Trabajo en el entorno, la ambientación, la interacción y la experiencia. Las capturas corresponden a etapas de desarrollo del entorno y escenas de pruebas; el juego todavía no está terminado.",
    tecnologias: ["Roblox"],
    caracteristicas: ["Proyecto personal de videojuego en desarrollo.", "Trabajo en entorno, ambientación, interacción y experiencia.", "Plataforma: Roblox."],
    imagen: "assets/images/projects/blind-echoes/blind-echoes-01.webp",
    alt: "Blind Echoes: vista elevada del blockout de bosque y sus caminos",
    notaImagen: "CAPTURA REAL / BLOCKOUT DEL ENTORNO EN DESARROLLO",
    repositorio: ""
  },
  ecotrack: {
    nombre: "EcoTrack",
    tipo: "03 / ACADÉMICO · CONCEPTUAL",
    descripcion: "EcoTrack es un proyecto académico y conceptual relacionado con la gestión inteligente de residuos urbanos. Se presenta como trabajo universitario en esa etapa; no se afirma que sea un producto comercial terminado. Las tecnologías, el material visual y el alcance funcional detallado todavía no han sido proporcionados.",
    tecnologias: [],
    caracteristicas: ["Contexto académico y conceptual.", "Tema: gestión inteligente de residuos urbanos."],
    imagen: "assets/images/proyectos/ecotrack.svg",
    alt: "Placeholder tipográfico de EcoTrack; material real pendiente",
    repositorio: ""
  },
  calzoski: {
    nombre: "Calzoski Kitchen",
    tipo: "04 / ACADÉMICO · DISEÑO DE INTERFAZ",
    descripcion: "Calzoski Kitchen es un proyecto académico de diseño de interfaz: un prototipo para tres tipos de usuario de un restaurante, mesero, cocinero y cajero. Su contexto es UX, prototipado e interfaces. No se ha confirmado un backend ni se han proporcionado las tecnologías o las capturas reales del prototipo.",
    tecnologias: [],
    caracteristicas: ["Interfaces para mesero, cocinero y cajero.", "Trabajo académico de UX y prototipado.", "Alcance confirmado: diseño de interfaz."],
    imagen: "assets/images/proyectos/calzoski.svg",
    alt: "Placeholder tipográfico de Calzoski Kitchen; captura real pendiente",
    repositorio: ""
  }
};

// Menú móvil. Sin JavaScript, los enlaces permanecen visibles.
const menu = document.querySelector("#menu-principal");
const menuToggle = document.querySelector(".menu-toggle");
const mobileQuery = window.matchMedia("(max-width: 800px)");
document.documentElement.classList.add("js");
menuToggle.hidden = !mobileQuery.matches;

function cerrarMenu() {
  menu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}
menuToggle.addEventListener("click", () => {
  const abierto = menu.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(abierto));
});
mobileQuery.addEventListener("change", () => {
  menuToggle.hidden = !mobileQuery.matches;
  cerrarMenu();
});
menu.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    cerrarMenu();
    menuToggle.focus();
  }
});
menu.querySelectorAll("a").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    cerrarMenu();
    const seccion = document.querySelector(enlace.getAttribute("href"));
    // El foco acompaña al salto para que el siguiente Tab continúe en la sección.
    seccion.setAttribute("tabindex", "-1");
    seccion.focus({ preventScroll: true });
  });
});

// Resalta la sección que ocupa el centro de la pantalla.
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      menu.querySelectorAll("a").forEach((enlace) => {
        if (enlace.getAttribute("href") === `#${entrada.target.id}`) {
          enlace.setAttribute("aria-current", "location");
        } else {
          enlace.removeAttribute("aria-current");
        }
      });
    }
  });
}, { rootMargin: "-20% 0px -50% 0px" });
document.querySelectorAll("main > section").forEach((seccion) => observador.observe(seccion));

// Dialog nativo: admite cierre con Escape. Tab recorre solo sus controles.
const dialogo = document.querySelector("#project-dialog");
let botonOrigen = null;
dialogo.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const controles = [...dialogo.querySelectorAll("button, a[href]")].filter((elemento) => !elemento.hidden);
  const primero = controles[0];
  const ultimo = controles[controles.length - 1];
  if (event.shiftKey && document.activeElement === primero) {
    event.preventDefault();
    ultimo.focus();
  } else if (!event.shiftKey && document.activeElement === ultimo) {
    event.preventDefault();
    primero.focus();
  }
});
document.querySelectorAll("[data-project]").forEach((boton) => {
  boton.addEventListener("click", () => {
    const proyecto = proyectos[boton.dataset.project];
    botonOrigen = boton;
    document.querySelector("#dialog-type").textContent = proyecto.tipo;
    document.querySelector("#dialog-title").textContent = proyecto.nombre;
    document.querySelector("#dialog-description").textContent = proyecto.descripcion;
    const imagen = document.querySelector("#dialog-image");
    imagen.src = proyecto.imagen;
    imagen.alt = proyecto.alt;
    document.querySelector("#dialog-image-note").textContent = proyecto.notaImagen || "MATERIAL REAL PENDIENTE / PLACEHOLDER";
    const tecnologias = document.querySelector("#dialog-technologies");
    const caracteristicas = document.querySelector("#dialog-features");
    tecnologias.replaceChildren();
    caracteristicas.replaceChildren();
    if (proyecto.tecnologias.length === 0) {
      const pendiente = document.createElement("p");
      pendiente.className = "technology-pending";
      pendiente.textContent = "Tecnologías pendientes de confirmar.";
      tecnologias.append(pendiente);
    }
    proyecto.tecnologias.forEach((nombre) => {
      const etiqueta = document.createElement("span");
      etiqueta.textContent = nombre;
      tecnologias.append(etiqueta);
    });
    proyecto.caracteristicas.forEach((texto) => {
      const elemento = document.createElement("li");
      elemento.textContent = texto;
      caracteristicas.append(elemento);
    });
    const repositorio = document.querySelector("#dialog-repository");
    repositorio.hidden = !esURLExterna(proyecto.repositorio);
    if (repositorio.hidden) {
      repositorio.removeAttribute("href");
    } else {
      repositorio.href = proyecto.repositorio;
    }
    document.body.classList.add("modal-open");
    dialogo.showModal();
  });
});
document.querySelector(".dialog-close").addEventListener("click", () => dialogo.close());
dialogo.addEventListener("click", (event) => {
  const limites = dialogo.getBoundingClientRect();
  if (event.target === dialogo && (event.clientX < limites.left || event.clientX > limites.right || event.clientY < limites.top || event.clientY > limites.bottom)) {
    dialogo.close();
  }
});
dialogo.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  botonOrigen?.focus();
});

function esURLExterna(url) {
  try {
    const direccion = new URL(url);
    return direccion.protocol === "https:" || direccion.protocol === "http:";
  } catch {
    return false;
  }
}


// Demostración local: no hay peticiones, almacenamiento ni envío de mensajes.
const formulario = document.querySelector("#contact-form");
const estado = document.querySelector("#form-status");
const obligatorios = ["nombre", "correo", "mensaje"];

function errorDelCampo(campo) {
  const valor = campo.value.trim();
  if (!valor) {
    return { nombre: "Escribe tu nombre.", correo: "Escribe tu correo electrónico.", mensaje: "Escribe un mensaje; no puede contener solo espacios." }[campo.id];
  }
  if (campo.id === "correo" && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor) || campo.validity.typeMismatch)) {
    return "Introduce un correo válido, por ejemplo nombre@dominio.com.";
  }
  return "";
}
function mostrarError(campo) {
  const error = errorDelCampo(campo);
  document.querySelector(`#error-${campo.id}`).textContent = error;
  campo.setAttribute("aria-invalid", String(Boolean(error)));
  return error;
}
formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  let primerError = null;
  obligatorios.forEach((id) => {
    const campo = document.getElementById(id);
    if (mostrarError(campo) && !primerError) primerError = campo;
  });
  estado.classList.toggle("is-error", Boolean(primerError));
  if (primerError) {
    estado.textContent = "Revisa los campos indicados antes de validar el formulario.";
    primerError.focus();
  } else {
    estado.textContent = "Formulario validado correctamente. Esta es una demostración: el mensaje no se ha enviado ni guardado.";
  }
});
formulario.addEventListener("input", (event) => {
  estado.textContent = "";
  if (event.target.hasAttribute("aria-invalid")) mostrarError(event.target);
});
document.querySelector("#validate-button").disabled = false;
