const toggle = document.querySelector(".navbar__toggle");
const menu = document.querySelector(".navbar__menu");

toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.classList.toggle("is-active");
    toggle.setAttribute("aria-expanded", isOpen);
});

// Cierra el menú al hacer clic en un enlace (útil en one-page con anclas)
menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.classList.remove("is-active");
        toggle.setAttribute("aria-expanded", "false");
    });
});

const navbar = document.querySelector(".navbar");
const scrollThreshold = 50; // px de scroll antes de activar el efecto

let ticking = false;

function updateNavbar() {
    if (window.scrollY > scrollThreshold) {
        navbar.classList.add("is-scrolled");
    } else {
        navbar.classList.remove("is-scrolled");
    }
    ticking = false;
}

window.addEventListener(
    "scroll",
    () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    },
    { passive: true },
);

updateNavbar(); // por si la página carga ya con scroll (ej. al recargar)

(() => {
    const items = document.querySelectorAll(".tiene-dropdown");
    if (!items.length) return;

    // Hover solo con mouse y pantalla grande (mismo breakpoint que el CSS)
    const hoverMQ = window.matchMedia("(min-width: 769px) and (hover: hover)");

    const abrir = (item) => {
        cerrarTodos(item);
        item.classList.add("abierto");
        item.querySelector(".dd-toggle").setAttribute("aria-expanded", "true");
        item.dispatchEvent(new CustomEvent("dd:abrir", { bubbles: true }));
    };

    const cerrar = (item) => {
        item.classList.remove("abierto");
        item.querySelector(".dd-toggle").setAttribute("aria-expanded", "false");
    };

    const cerrarTodos = (excepto) =>
        items.forEach((i) => i !== excepto && cerrar(i));

    items.forEach((item) => {
        const btn = item.querySelector(".dd-toggle");
        let timer;

        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            item.classList.contains("abierto") ? cerrar(item) : abrir(item);
        });

        item.addEventListener("mouseenter", () => {
            if (!hoverMQ.matches) return;
            clearTimeout(timer);
            abrir(item);
        });
        item.addEventListener("mouseleave", () => {
            if (!hoverMQ.matches) return;
            timer = setTimeout(() => cerrar(item), 150);
        });

        // Si el foco sale del item con Tab, se cierra
        item.addEventListener("focusout", (e) => {
            if (!item.contains(e.relatedTarget)) cerrar(item);
        });
    });

    // Clic fuera
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".tiene-dropdown")) cerrarTodos();
    });

    // Escape: cierra y devuelve el foco al botón
    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        const abierto = document.querySelector(".tiene-dropdown.abierto");
        if (!abierto) return;
        cerrar(abierto);
        abierto.querySelector(".dd-toggle").focus();
    });

    // Al cambiar de breakpoint, reinicia el estado
    hoverMQ.addEventListener("change", () => cerrarTodos());

    // Si el panel móvil se cierra (hamburguesa), cierra también el acordeón.
    // Observa la clase is-open, así no tocas tu JS actual.
    const menu = document.getElementById("navbar-menu");
    if (menu) {
        new MutationObserver(() => {
            if (!menu.classList.contains("is-open")) cerrarTodos();
        }).observe(menu, { attributes: true, attributeFilter: ["class"] });
    }
})();

if (
    typeof mm !== "undefined" &&
    typeof gsap !== "undefined" &&
    typeof ScrollTrigger !== "undefined"
) {
    mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
            const aro = document.querySelector(".aro");
            const iconos = gsap.utils.toArray(".aro-ico");

            // Ángulo (en grados, sentido horario desde arriba) donde está cada icono
            // en el aro SIN girar. Medidos de tu imagen; confírmalos con el SVG final.
            const anguloIcono = [-16, 63, 158, 257];
            const OBJETIVO = 90; // 3 en punto

            gsap.utils.toArray(".paso").forEach((paso, i) => {
                const rot = OBJETIVO - anguloIcono[i];

                ScrollTrigger.create({
                    trigger: paso,
                    start: "top 55%",
                    end: "bottom 55%",
                    onToggle: (self) => {
                        paso.classList.toggle("activo", self.isActive);
                        if (!self.isActive) return;
                        gsap.to(aro, {
                            rotation: rot,
                            duration: 0.9,
                            ease: "power2.inOut",
                        });
                        gsap.to(iconos, {
                            rotation: -rot,
                            duration: 0.9,
                            ease: "power2.inOut",
                        });
                    },
                });
            });
        },
    );
}

const track = document.getElementById("track");

if (track && typeof gsap !== "undefined") {
    // Clonamos los logos para loop infinito
    const logos = [...track.children];
    logos.forEach((logo) => {
        const clone = logo.cloneNode(true);
        track.appendChild(clone);
    });

    // Calculamos ancho total
    const trackWidth = track.scrollWidth;

    // Animación infinita
    gsap.to(track, {
        x: -trackWidth / 2,
        duration: 40,
        ease: "linear",
        repeat: -1,
    });
}

/* ============================================================
   FORMULARIO DE CONTACTO - Web3Forms
   - Se ejecuta en todas las páginas, pero no hace nada si no hay
     formulario (if (!form) return).
   - Toda la configuración cambiable está en CONFIG.
   ============================================================ */
(() => {
    "use strict";

    const form = document.querySelector("#form-contacto");
    if (!form) return;

    /* ------------------------------------------------------------------
       CONFIGURACIÓN DE ENVÍO
       Cambia aquí la URL, el formato de respuesta y el access_key.
       Al migrar a PHP: cambia endpoint y, si PHP responde HTML/texto,
       pon formatoRespuesta: "texto".
       La access_key de Web3Forms es pública; si tu plan lo permite,
       restríngela a tu dominio desde el panel de Web3Forms.
       ------------------------------------------------------------------ */
    const CONFIG = Object.freeze({
        // Clave pública de Web3Forms. Es la única que debes cambiar aquí.
        accessKey: "964a720c-3bef-4e26-8bf9-e03caa636681",
        endpoint: "https://api.web3forms.com/submit",
        formatoRespuesta: "json", // "json" | "texto"
        timeoutMs: 15000,
        whatsappNumero: "524791493088", // número con lada de país, solo dígitos
        whatsappMensaje: "Hola, quiero cotizar un proyecto",
        avisoPrivacidad: "/aviso-privacidad/",
    });

    /* ------------------------------------------------------------------
       MENSAJES DE LOS MODALES
       ------------------------------------------------------------------ */
    const MENSAJES = {
        exito: {
            titulo: "¡Gracias!",
            texto: "Recibimos tu solicitud y te responderemos en menos de 24 horas.",
            botones: ["cerrar", "whatsapp"],
        },
        error: {
            titulo: "No pudimos enviar tu solicitud",
            texto: "Tus datos siguen en el formulario. Intenta de nuevo o escríbenos por WhatsApp.",
            botones: ["reintentar", "whatsapp"],
        },
        spam: {
            titulo: "No pudimos verificar tu solicitud",
            texto: "Intenta de nuevo en unos segundos.",
            botones: ["reintentar"],
        },
        limite: {
            titulo: "Demasiados envíos",
            texto: "Espera unos minutos o escríbenos por WhatsApp.",
            botones: ["entendido", "whatsapp"],
        },
        sinconexion: {
            titulo: "Sin conexión",
            texto: "Parece que no hay internet. Tus datos siguen aquí; intenta de nuevo cuando vuelvas a conectarte.",
            botones: ["reintentar"],
        },
    };

    const ETIQUETAS_BOTON = {
        cerrar: "Cerrar",
        entendido: "Entendido",
        reintentar: "Reintentar",
    };

    /* ------------------------------------------------------------------
       ESTADO DEL FORMULARIO Y UTILIDADES DE VALIDACIÓN
       ------------------------------------------------------------------ */
    const CAMPOS = [
        {
            name: "nombre",
            error: "error-nombre",
            vacio: "Ingresa tu nombre",
        },
        {
            name: "empresa",
            error: "error-empresa",
            vacio: "Ingresa el nombre de tu empresa",
        },
        {
            name: "email",
            error: "error-correo",
            vacio: "Ingresa tu correo",
        },
        {
            name: "telefono",
            error: "error-telefono",
            vacio: "Ingresa tu teléfono",
        },
        {
            name: "servicio",
            error: "error-servicio",
            vacio: "Selecciona un servicio",
        },
        {
            name: "mensaje",
            error: "error-mensaje",
            vacio: "Cuéntanos brevemente tu proyecto",
        },
        {
            name: "privacidad",
            error: "error-privacidad",
            vacio: "Debes aceptar el aviso de privacidad para enviar tu solicitud",
        },
    ];

    const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    let intentoEnvio = false;
    let enviando = false;

    const botonEnvio = form.querySelector('button[type="submit"]');
    const estadoEnvio = form.querySelector("#form-estado");
    const honeypot = form.querySelector('input[name="botcheck"]');
    const textoBoton = botonEnvio
        ? botonEnvio.textContent.trim()
        : "Enviar solicitud";

    const enlaceAviso = form.querySelector('a[href*="aviso"]');
    if (enlaceAviso) enlaceAviso.href = CONFIG.avisoPrivacidad;

    const campoAccessKey = form.querySelector('input[name="access_key"]');
    if (campoAccessKey) campoAccessKey.value = CONFIG.accessKey;
    if (CONFIG.endpoint) form.setAttribute("action", CONFIG.endpoint);

    const campos = CAMPOS.map((def) => ({
        def,
        el: form.elements.namedItem(def.name),
        errorEl: form.querySelector(
            '.form-error[data-error-para="' + def.name + '"]',
        ),
    }));

    function anunciar(texto) {
        if (estadoEnvio) estadoEnvio.textContent = texto;
    }

    // Parte de los numeros +52, Se puede agregar más
    function telefonoValido(valor) {
        const digitos = String(valor).replace(/\D/g, "");
        if (digitos.length === 10) return true;
        if (digitos.length === 12 && digitos.startsWith("52")) return true;
        if (digitos.length === 13 && digitos.startsWith("521")) return true;
        return false;
    }

    function mensajeDeError(def, el) {
        if (!el) return "";
        if (def.name === "privacidad") {
            return el.checked ? "" : def.vacio;
        }

        const valor = String(el.value || "").trim();
        if (!valor) return def.vacio;

        if (def.name === "email" && !RE_EMAIL.test(valor)) {
            return "Ingresa un correo válido";
        }
        if (def.name === "telefono" && !telefonoValido(valor)) {
            return "Ingresa un teléfono de 10 dígitos";
        }
        return "";
    }

    function aplicarError(registro, mensaje) {
        if (!registro.el) return;
        if (mensaje) {
            registro.el.setAttribute("aria-invalid", "true");
            if (registro.errorEl) registro.errorEl.textContent = mensaje;
        } else {
            registro.el.removeAttribute("aria-invalid");
            if (registro.errorEl) registro.errorEl.textContent = "";
        }
    }

    function validarCampo(registro) {
        const mensaje = mensajeDeError(registro.def, registro.el);
        aplicarError(registro, mensaje);
        return !mensaje;
    }

    function validarFormulario(enfocarPrimero) {
        let primeroInvalido = null;

        campos.forEach((registro) => {
            const mensaje = mensajeDeError(registro.def, registro.el);
            aplicarError(registro, mensaje);
            if (mensaje && !primeroInvalido) primeroInvalido = registro.el;
        });

        if (primeroInvalido && enfocarPrimero) primeroInvalido.focus();
        return !primeroInvalido;
    }

    function limpiarErrores() {
        campos.forEach((registro) => aplicarError(registro, ""));
    }

    function ponerEnviando(activo) {
        if (activo) {
            form.setAttribute("aria-busy", "true");
            if (botonEnvio) {
                botonEnvio.disabled = true;
                botonEnvio.textContent = "Enviando...";
            }
            anunciar("Enviando...");
            return;
        }

        form.removeAttribute("aria-busy");
        if (botonEnvio) {
            botonEnvio.disabled = false;
            botonEnvio.textContent = textoBoton;
        }
        if (estadoEnvio && estadoEnvio.textContent === "Enviando...") {
            estadoEnvio.textContent = "";
        }
    }

    /* ------------------------------------------------------------------
       RESPUESTA DE WEB3FORMS
       Aísla el mapeo para ajustarlo cuando pruebes respuestas reales.
       ------------------------------------------------------------------ */
    function clasificarRespuesta({ status, ok, data }) {
        const mensaje = String(
            (data && (data.message || data.error)) || "",
        ).toLowerCase();

        if (status === 429) return "limite";
        if (data && data.success === true) return "exito";
        if (/spam|botcheck|bot check|\bbot\b|captcha/.test(mensaje))
            return "spam";
        if (!ok || (data && data.success === false)) return "error";
        return "error";
    }

    async function leerRespuesta(respuesta) {
        if (CONFIG.formatoRespuesta === "texto") {
            const texto = await respuesta.text();
            return { success: respuesta.ok, message: texto };
        }
        try {
            return await respuesta.json();
        } catch (error) {
            return {};
        }
    }

    /* ------------------------------------------------------------------
       MODAL ÚNICO REUTILIZABLE
       ------------------------------------------------------------------ */
    const modal = document.getElementById("modal-form");
    const modalTitulo = modal ? modal.querySelector("#modal-titulo") : null;
    const modalTexto = modal ? modal.querySelector("#modal-texto") : null;
    const modalAcciones = modal
        ? modal.querySelector("[data-modal-acciones]")
        : null;

    let accionReintentar = null;
    let focoAlCerrar = null;

    function urlWhatsApp() {
        const numero = String(CONFIG.whatsappNumero || "").replace(/\D/g, "");
        const mensaje = encodeURIComponent(CONFIG.whatsappMensaje || "");
        return "https://wa.me/" + numero + "?text=" + mensaje;
    }

    function crearBotonAccion(tipo) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "boton modal-form__btn";
        boton.dataset.accion = "";
        boton.textContent = ETIQUETAS_BOTON[tipo] || "Cerrar";
        boton.addEventListener("click", () => {
            if (tipo === "reintentar") {
                const reintentar = accionReintentar;
                cerrarModal(true);
                if (typeof reintentar === "function") reintentar();
                return;
            }
            cerrarModal();
        });
        return boton;
    }

    function abrirModal(estado, alReintentar, origen) {
        const configuracion = MENSAJES[estado] || MENSAJES.error;

        accionReintentar =
            typeof alReintentar === "function" ? alReintentar : null;
        focoAlCerrar =
            origen instanceof HTMLElement ? origen : botonEnvio || null;

        if (!modal || !modalTitulo || !modalTexto || !modalAcciones) {
            return false;
        }

        const enlaceWhatsApp = modalAcciones.querySelector("[data-modal-wa]");

        modal.dataset.estado = estado;
        modalTitulo.textContent = configuracion.titulo;
        modalTexto.textContent = configuracion.texto;

        modalAcciones
            .querySelectorAll("[data-accion]")
            .forEach((elemento) => elemento.remove());

        if (enlaceWhatsApp) {
            enlaceWhatsApp.hidden = true;
            enlaceWhatsApp.textContent =
                estado === "exito" ? "Escribir por WhatsApp" : "WhatsApp";
            if (configuracion.botones.includes("whatsapp")) {
                enlaceWhatsApp.href = urlWhatsApp();
                enlaceWhatsApp.hidden = false;
            }
        }

        configuracion.botones.forEach((tipo) => {
            if (tipo === "whatsapp") return;
            const boton = crearBotonAccion(tipo);
            if (enlaceWhatsApp) {
                modalAcciones.insertBefore(boton, enlaceWhatsApp);
            } else {
                modalAcciones.appendChild(boton);
            }
        });

        if (!modal.open) {
            if (typeof modal.showModal === "function") {
                try {
                    modal.showModal();
                } catch (error) {
                    modal.setAttribute("open", "");
                }
            } else {
                modal.setAttribute("open", "");
            }
        }

        modal.dispatchEvent(new CustomEvent("modal-form:abierto"));
        return true;
    }

    function cerrarModal(inmediato) {
        if (!modal || !modal.open) return;

        if (inmediato) {
            modal.close();
            return;
        }

        const evento = new CustomEvent("modal-form:cerrar", {
            cancelable: true,
        });
        const cerrarSinAnimacion = modal.dispatchEvent(evento);
        if (cerrarSinAnimacion) modal.close();
    }

    if (modal) {
        modal.querySelectorAll("[data-modal-cerrar]").forEach((boton) => {
            boton.addEventListener("click", () => cerrarModal());
        });

        modal.addEventListener("cancel", (evento) => {
            evento.preventDefault();
            cerrarModal();
        });

        modal.addEventListener("close", () => {
            // Si se cerró y volvió a abrir de inmediato (p. ej. Reintentar),
            // no robamos el foco ni borramos la acción del modal nuevo.
            if (modal.open) return;

            accionReintentar = null;
            if (focoAlCerrar && document.contains(focoAlCerrar)) {
                focoAlCerrar.focus();
            } else if (botonEnvio) {
                botonEnvio.focus();
            }
        });

        // Clic en el fondo (opcional, pero cómodo en móvil)
        modal.addEventListener("click", (evento) => {
            if (evento.target === modal) cerrarModal();
        });

        // Refuerzo del foco atrapado (los navegadores ya lo hacen con showModal)
        modal.addEventListener("keydown", (evento) => {
            if (evento.key !== "Tab") return;

            const enfocables = Array.from(
                modal.querySelectorAll(
                    'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
                ),
            ).filter((el) => el.offsetParent !== null);

            if (!enfocables.length) return;

            const primero = enfocables[0];
            const ultimo = enfocables[enfocables.length - 1];

            if (evento.shiftKey && document.activeElement === primero) {
                evento.preventDefault();
                ultimo.focus();
            } else if (!evento.shiftKey && document.activeElement === ultimo) {
                evento.preventDefault();
                primero.focus();
            }
        });
    }

    /* ------------------------------------------------------------------
       ENVÍO
       ------------------------------------------------------------------ */
    async function procesarEnvio() {
        if (enviando) return;

        intentoEnvio = true;
        if (!validarFormulario(true)) return;

        // La casilla se valida también en lógica, no solo con required.
        if (honeypot && honeypot.checked) {
            if (!abrirModal("spam", procesarEnvio, botonEnvio)) {
                anunciar(MENSAJES.spam.titulo + " " + MENSAJES.spam.texto);
            }
            return;
        }

        if (typeof navigator !== "undefined" && navigator.onLine === false) {
            if (!abrirModal("sinconexion", procesarEnvio, botonEnvio)) {
                anunciar(
                    MENSAJES.sinconexion.titulo +
                        " " +
                        MENSAJES.sinconexion.texto,
                );
            }
            return;
        }

        enviando = true;
        ponerEnviando(true);

        const controlador = new AbortController();
        const temporizador = setTimeout(
            () => controlador.abort(),
            CONFIG.timeoutMs,
        );

        try {
            const datos = new FormData(form);
            datos.set("access_key", CONFIG.accessKey);

            const respuesta = await fetch(form.action || CONFIG.endpoint, {
                method: "POST",
                body: datos,
                headers: { Accept: "application/json" },
                signal: controlador.signal,
            });

            const data = await leerRespuesta(respuesta);
            const estado = clasificarRespuesta({
                status: respuesta.status,
                ok: respuesta.ok,
                data,
            });

            if (estado === "exito") {
                form.reset();
                limpiarErrores();
                intentoEnvio = false;
            }

            if (!abrirModal(estado, procesarEnvio, botonEnvio)) {
                const mensaje = MENSAJES[estado] || MENSAJES.error;
                anunciar(mensaje.titulo + " " + mensaje.texto);
            }
        } catch (error) {
            if (!abrirModal("sinconexion", procesarEnvio, botonEnvio)) {
                anunciar(
                    MENSAJES.sinconexion.titulo +
                        " " +
                        MENSAJES.sinconexion.texto,
                );
            }
        } finally {
            clearTimeout(temporizador);
            enviando = false;
            ponerEnviando(false);
        }
    }

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();
        procesarEnvio();
    });

    // Después del primer intento: validar al escribir y al salir del campo.
    campos.forEach((registro) => {
        if (!registro.el) return;

        const esCheckbox = registro.def.name === "privacidad";
        const esSelect = registro.el.tagName === "SELECT";

        if (esCheckbox || esSelect) {
            registro.el.addEventListener("change", () => {
                if (!intentoEnvio) return;
                validarCampo(registro);
            });
        } else {
            registro.el.addEventListener("input", () => {
                if (!intentoEnvio) return;
                validarCampo(registro);
            });
            registro.el.addEventListener("blur", () => {
                if (!intentoEnvio) return;
                validarCampo(registro);
            });
        }
    });

    form.addEventListener("reset", () => {
        // El reset nativo ocurre después del evento: limpiamos en el siguiente tick.
        window.setTimeout(() => {
            limpiarErrores();
            intentoEnvio = false;
        }, 0);
    });
})();
