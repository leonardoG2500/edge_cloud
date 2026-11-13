gsap.registerPlugin(ScrollTrigger);

// iOS Safari cambia la altura visible al mostrar/ocultar su barra.
// Sin esto, ScrollTrigger se recalcula solo y puede descolocar las
// animaciones (o dejar elementos sin revelar) al hacer scroll.
ScrollTrigger.config({ ignoreMobileResize: true });

const heroLogo = document.querySelector(".hero-logo");
const aboutLogo = document.querySelector(".about-logo");

// Centro y tamaño del elemento en coordenadas de página
const pageRect = (el) => {
    const r = el.getBoundingClientRect();
    return {
        cx: r.left + window.scrollX + r.width / 2,
        cy: r.top + window.scrollY + r.height / 2,
        w: r.width,
    };
};

const mm = gsap.matchMedia();

mm.add(
    {
        desktop:
            "(min-width: 992px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 991px) and (prefers-reduced-motion: no-preference)",
    },
    (context) => {
        const { desktop } = context.conditions;

        if (desktop) {
            // ESCRITORIO: la imagen del hero viaja hasta la de "Nosotros"
            gsap.set(aboutLogo, { opacity: 0 });

            gsap.to(heroLogo, {
                x: () => pageRect(aboutLogo).cx - pageRect(heroLogo).cx,
                y: () => pageRect(aboutLogo).cy - pageRect(heroLogo).cy,
                scale: () => pageRect(aboutLogo).w / pageRect(heroLogo).w,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top top",
                    endTrigger: aboutLogo,
                    end: "center 60%", // aterriza cuando la imagen destino está casi centrada
                    scrub: 0.6, // suaviza el seguimiento del scroll
                    invalidateOnRefresh: true, // recalcula si cambia el tamaño de pantalla
                },
            });
        } else {
            // MÓVIL: el logo del hero se desvanece al salir, el de "Nosotros" aparece con un reveal
            gsap.to(heroLogo, {
                scale: 0.85,
                opacity: 0,
                y: -30,
                ease: "none",
                scrollTrigger: {
                    trigger: heroLogo,
                    start: "center 40%",
                    end: "bottom top",
                    scrub: true,
                },
            });

            gsap.from(aboutLogo, {
                scale: 0.7,
                opacity: 0,
                rotate: -8,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: aboutLogo,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            });
        }
    },
);

/* ------------------------------------------------------------------ */
/* Animación de entrada del navbar (logo + botones)                    */
/* ------------------------------------------------------------------ */
// Al terminar (o si algo la interrumpe) quitamos los estilos inline:
// así los elementos quedan EXACTAMENTE en su posición natural, sin
// restos de translate que los dejen "un poco arriba".
const limpiarIntroNavbar = () =>
    gsap.set([".logo", ".btn2"], { clearProps: "transform,opacity" });

const introNavbar = gsap.timeline({
    onComplete: limpiarIntroNavbar,
    onInterrupt: limpiarIntroNavbar,
});

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    introNavbar
        .fromTo(
            ".logo",
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power2.inOut" },
            0,
        )
        .fromTo(
            ".btn2",
            { y: -200, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.02,
                ease: "power2.inOut",
            },
            0,
        );

    // Red de seguridad: si por cualquier motivo (pestaña en segundo plano,
    // frame perdido, etc.) la animación no llegó al final, forzamos el
    // estado final para que nunca se quede a medio camino.
    gsap.delayedCall(1.6, () => {
        if (introNavbar.progress() < 1) {
            introNavbar.progress(1);
            limpiarIntroNavbar();
        }
    });
}

// Las imágenes/fuentes cambian el layout al cargar: recalcula posiciones
window.addEventListener("load", () => ScrollTrigger.refresh());
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
}

(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");

    document.querySelectorAll(".tiene-dropdown").forEach((item) => {
        const enlaces = item.querySelectorAll(".dd-menu li");
        if (!enlaces.length) return;

        item.addEventListener("dd:abrir", () => {
            if (!mq.matches) return;
            gsap.fromTo(
                enlaces,
                { autoAlpha: 0, y: 8 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.25,
                    stagger: 0.05,
                    ease: "power2.out",
                    overwrite: true,
                },
            );
        });
    });
})();

(() => {
    const slots = gsap.utils.toArray("#clientes-grid .cliente-slot");
    if (!slots.length) return;

    // Todos los logos (incluye los 4 que ya están en el HTML, con la MISMA ruta)
    const POOL = [
        { src: "assets/img/clientes/club_leon.webp", alt: "Cliente 1" },
        { src: "assets/img/clientes/envases.webp", alt: "Cliente 2" },
        { src: "assets/img/clientes/gobierno_gto.webp", alt: "Cliente 3" },
        { src: "assets/img/clientes/orbis.webp", alt: "Cliente 4" },
        { src: "assets/img/clientes/poder_judicial.webp", alt: "Cliente 5" },
        { src: "assets/img/clientes/psw.webp", alt: "Cliente 6" },
        { src: "assets/img/clientes/tsubaki.webp", alt: "Cliente 7" },
        { src: "assets/img/clientes/ryobi.webp", alt: "Cliente 8" },
    ];
    const INTERVALO = 2000; // ms entre cambios

    if (POOL.length <= slots.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Precarga para que el cambio no parpadee
    POOL.forEach((l) => {
        const i = new Image();
        i.src = l.src;
    });

    const enUso = new Set(
        slots.map((s) => s.querySelector("img").getAttribute("src")),
    );
    let ultimo = -1;
    let timer = null;

    const cambiar = () => {
        // Un cuadro al azar, distinto del último que cambió
        let idx;
        do {
            idx = gsap.utils.random(0, slots.length - 1, 1);
        } while (idx === ultimo);
        ultimo = idx;

        const slot = slots[idx];
        const actual = slot.querySelector("img");
        const libres = POOL.filter((l) => !enUso.has(l.src));
        const nuevo = gsap.utils.random(libres);

        const img = new Image();
        img.src = nuevo.src;
        img.alt = nuevo.alt;
        slot.appendChild(img);

        enUso.delete(actual.getAttribute("src"));
        enUso.add(nuevo.src);

        gsap.timeline({ onComplete: () => actual.remove() })
            .to(actual, {
                autoAlpha: 0,
                y: -18,
                duration: 0.4,
                ease: "power2.in",
            })
            .fromTo(
                img,
                { autoAlpha: 0, y: 18 },
                { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
                "-=0.1",
            );
    };

    const iniciar = () => {
        if (!timer) timer = setInterval(cambiar, INTERVALO);
    };
    const detener = () => {
        clearInterval(timer);
        timer = null;
    };

    // Solo corre mientras la sección está en pantalla
    ScrollTrigger.create({
        trigger: "#clientes",
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? iniciar() : detener()),
    });

    // Y se pausa si cambias de pestaña
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) detener();
        else if (
            ScrollTrigger.getAll().some(
                (t) => t.trigger?.id === "clientes" && t.isActive,
            )
        )
            iniciar();
    });
})();

/* ============================================================
   ANIMACIÓN DEL MODAL DE FORMULARIO
   - Se ejecuta solo si existe <dialog id="modal-form">.
   - Si GSAP no está disponible o el usuario prefiere menos
     movimiento, el modal abre y cierra sin animación.
   ============================================================ */
(() => {
    const dialog = document.getElementById("modal-form");
    if (!dialog) return;

    const gsapApi = window.gsap;
    if (!gsapApi) return;

    const caja = dialog.querySelector(".modal-form__caja");
    if (!caja) return;

    const prefiereMenosMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    );

    let cerrando = false;

    dialog.addEventListener("modal-form:abierto", () => {
        cerrando = false;
        if (prefiereMenosMovimiento.matches) return;

        gsapApi.fromTo(
            caja,
            { autoAlpha: 0, y: 24 },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.28,
                ease: "power2.out",
                overwrite: true,
            },
        );
    });

    dialog.addEventListener("modal-form:cerrar", (evento) => {
        if (prefiereMenosMovimiento.matches || cerrando) return;

        // El JS del formulario cierra el <dialog> si no prevenimos el evento.
        if (evento.cancelable) evento.preventDefault();
        cerrando = true;

        gsapApi.to(caja, {
            autoAlpha: 0,
            y: 16,
            duration: 0.2,
            ease: "power2.in",
            overwrite: true,
            onComplete: () => {
                gsapApi.set(caja, {
                    clearProps: "opacity,visibility,transform",
                });
                gsapApi.set(dialog, { clearProps: "opacity,visibility" });
                cerrando = false;
                if (dialog.open) {
                    try {
                        dialog.close();
                    } catch (error) {
                        dialog.removeAttribute("open");
                    }
                }
            },
        });
    });

    // Red de seguridad: si la animación no termina, cierra igual.
    dialog.addEventListener("modal-form:cerrar", () => {
        if (!dialog.open) return;
        gsapApi.delayedCall(0.6, () => {
            if (!dialog.open || !cerrando) return;
            cerrando = false;
            gsapApi.set(caja, { clearProps: "opacity,visibility,transform" });
            try {
                dialog.close();
            } catch (error) {
                dialog.removeAttribute("open");
            }
        });
    });

    dialog.addEventListener("close", () => {
        cerrando = false;
        gsapApi.set(caja, { clearProps: "opacity,visibility,transform" });
        gsapApi.set(dialog, { clearProps: "opacity,visibility" });
    });
})();

/* ============================================================
   ANIMACIONES DE APARICIÓN (REVEAL) AL HACER SCROLL
   ------------------------------------------------------------
   Sistema independiente del resto de animaciones de este archivo.
   - Un tipo de entrada por sección (data-reveal) y overrides por elemento.
   - Un ScrollTrigger por sección corta o por bloque en secciones altas.
   - No toca .hero-logo, .about-logo, .about-image, proceso, las <img>
     de clientes, .navbar, <dialog>, #precarga ni .footer.
   ============================================================ */
(() => {
    "use strict";

    const html = document.documentElement;

    const CONFIG = {
        selectorSecciones:
            "main section:not(.footer), main header.hero, main header.hero-section",
        selectorHeroe: "main header.hero, main header.hero-section",
        selectorItem: "[data-reveal-item]",
        selectorGrupo: "[data-reveal-group]",
        tipoPorDefecto: "arriba",
        inicio: "top 80%",
        factorSeccionAlta: 1.5,
        umbralInicio: 0.8,
        esperaPrecargaSeg: 4,
        paso: 0.1,
        retrasoHeroeInicio: 0.12,
        tipos: ["arriba", "izquierda", "derecha", "zoom", "grupo"],
    };

    const EXCLUIDOS = [
        ".footer",
        ".navbar",
        "footer",
        "dialog",
        "#precarga",
        ".hero-logo",
        ".about-logo",
        ".about-image",
        ".proceso-aro",
        ".aro",
        ".aro-nube",
        ".aro-ico",
        ".paso",
        ".cliente-slot img",
        ".carousel-track",
    ].join(",");

    const leerNumero = (nombre, respaldo) => {
        const valor = getComputedStyle(html).getPropertyValue(nombre).trim();
        const numero = parseFloat(valor);
        return Number.isFinite(numero) ? numero : respaldo;
    };

    const leerAjustes = () => ({
        distanciaY: leerNumero("--reveal-dist-y", 40),
        distanciaX: leerNumero("--reveal-dist-x", 50),
        escala: leerNumero("--reveal-escala", 0.92),
        duracion: leerNumero("--reveal-duracion", 0.65),
        stagger: leerNumero("--reveal-stagger", 0.09),
        retrasoHeroe: leerNumero("--reveal-retraso-hero", 0.35),
    });

    const esTipoValido = (valor) => CONFIG.tipos.indexOf(valor) !== -1;

    const tipoDe = (el, seccion, porDefecto) => {
        const propio = el.getAttribute("data-reveal");
        if (esTipoValido(propio)) return propio;

        const grupo = el.closest(CONFIG.selectorGrupo);
        if (grupo && grupo !== el && seccion.contains(grupo)) {
            const tipoGrupo = grupo.getAttribute("data-reveal");
            if (esTipoValido(tipoGrupo)) return tipoGrupo;
        }

        const tipoSeccion = seccion.getAttribute("data-reveal");
        if (esTipoValido(tipoSeccion)) return tipoSeccion;

        return porDefecto;
    };

    const estadoInicial = (tipo, ajustes, movil) => {
        const base = { autoAlpha: 0 };
        let normalizado = tipo;

        if (movil && (normalizado === "izquierda" || normalizado === "derecha")) {
            normalizado = "arriba";
        }

        if (normalizado === "izquierda") {
            return { ...base, x: -ajustes.distanciaX };
        }
        if (normalizado === "derecha") {
            return { ...base, x: ajustes.distanciaX };
        }
        if (normalizado === "zoom") {
            return { ...base, scale: ajustes.escala };
        }
        return { ...base, y: ajustes.distanciaY };
    };

    const marcarVisible = (elementos) => {
        elementos.forEach((el) => el.classList.add("reveal-listo"));
        gsap.set(elementos, {
            clearProps: "transform,opacity,visibility",
        });
    };

    const esAncestroItem = (el) => {
        const padre = el.parentElement;
        const ancestro = padre ? padre.closest(CONFIG.selectorItem) : null;
        return Boolean(ancestro);
    };

    const obtenerItems = (contenedor) => {
        if (!contenedor) return [];

        return Array.from(contenedor.querySelectorAll(CONFIG.selectorItem))
            .filter((el) => {
                if (el.closest(EXCLUIDOS)) return false;
                if (esAncestroItem(el)) return false;
                return !el.classList.contains("reveal-listo");
            });
    };

    const agruparItems = (items, seccion) => {
        const bloques = [];

        items.forEach((el) => {
            const grupo = el.closest(CONFIG.selectorGrupo);
            const grupoValido = grupo && seccion.contains(grupo) ? grupo : null;
            const ultimo = bloques[bloques.length - 1];

            if (grupoValido) {
                if (ultimo && ultimo.grupo === grupoValido) {
                    ultimo.items.push(el);
                } else {
                    bloques.push({
                        grupo: grupoValido,
                        items: [el],
                        trigger: grupoValido,
                    });
                }
                return;
            }

            bloques.push({ grupo: null, items: [el], trigger: el });
        });

        return bloques;
    };

    const tipoDeBloque = (bloque, seccion) => {
        if (bloque.grupo) {
            const tipoGrupo = bloque.grupo.getAttribute("data-reveal");
            if (esTipoValido(tipoGrupo) && tipoGrupo !== "grupo") {
                return tipoGrupo;
            }
        }
        return tipoDe(bloque.items[0], seccion, CONFIG.tipoPorDefecto);
    };

    const reproducirBloque = (bloque, seccion, ajustes, movil) => {
        const tipo = tipoDeBloque(bloque, seccion);
        const hacia = {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: ajustes.duracion,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: () => marcarVisible(bloque.items),
            onInterrupt: () => marcarVisible(bloque.items),
        };

        if (bloque.items.length > 1) {
            hacia.stagger = ajustes.stagger;
        }

        gsap.set(bloque.items, estadoInicial(tipo, ajustes, movil));
        gsap.to(bloque.items, hacia);
    };

    const crearTimelineSeccion = (bloques, seccion, ajustes, movil) => {
        const todos = bloques.reduce(
            (lista, bloque) => lista.concat(bloque.items),
            [],
        );
        const timeline = gsap.timeline({
            paused: true,
            onComplete: () => marcarVisible(todos),
            onInterrupt: () => marcarVisible(todos),
        });

        let posicion = 0;

        bloques.forEach((bloque) => {
            const tipo = tipoDeBloque(bloque, seccion);
            const hacia = {
                autoAlpha: 1,
                x: 0,
                y: 0,
                scale: 1,
                duration: ajustes.duracion,
                ease: "power2.out",
                overwrite: "auto",
            };

            if (bloque.items.length > 1) {
                hacia.stagger = ajustes.stagger;
            }

            gsap.set(bloque.items, estadoInicial(tipo, ajustes, movil));
            timeline.to(bloque.items, hacia, posicion);
            posicion += CONFIG.paso;
        });

        return timeline;
    };

    const crearTriggerBloque = (bloque, seccion, ajustes, movil) => {
        if (!bloque.trigger) return;

        const rect = bloque.trigger.getBoundingClientRect();
        if (rect.bottom <= 0) {
            marcarVisible(bloque.items);
            return;
        }

        gsap.set(
            bloque.items,
            estadoInicial(tipoDeBloque(bloque, seccion), ajustes, movil),
        );

        // Si el bloque ya está dentro del viewport al cargar, entra sin esperar
        // a que el usuario haga scroll.
        if (rect.top <= window.innerHeight * CONFIG.umbralInicio) {
            reproducirBloque(bloque, seccion, ajustes, movil);
            return;
        }

        ScrollTrigger.create({
            trigger: bloque.trigger,
            start: CONFIG.inicio,
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => reproducirBloque(bloque, seccion, ajustes, movil),
        });
    };

    const prepararSeccion = (seccion, ajustes, movil) => {
        if (!seccion) return;
        if (seccion.matches(".footer")) return;

        const items = obtenerItems(seccion);
        if (!items.length) return;

        const bloques = agruparItems(items, seccion);
        if (!bloques.length) return;

        const rect = seccion.getBoundingClientRect();
        if (rect.bottom <= 0) {
            marcarVisible(items);
            return;
        }

        const seccionAlta =
            rect.height > window.innerHeight * CONFIG.factorSeccionAlta;

        if (!seccionAlta) {
            const timeline = crearTimelineSeccion(
                bloques,
                seccion,
                ajustes,
                movil,
            );

            if (rect.top <= window.innerHeight * CONFIG.umbralInicio) {
                timeline.play();
                return;
            }

            ScrollTrigger.create({
                trigger: seccion,
                start: CONFIG.inicio,
                once: true,
                invalidateOnRefresh: true,
                onEnter: () => timeline.play(),
            });
            return;
        }

        bloques.forEach((bloque) => {
            if (
                bloque.grupo &&
                bloque.grupo.getBoundingClientRect().height >
                    window.innerHeight * CONFIG.factorSeccionAlta
            ) {
                bloque.items.forEach((el) => {
                    crearTriggerBloque(
                        { grupo: bloque.grupo, items: [el], trigger: el },
                        seccion,
                        ajustes,
                        movil,
                    );
                });
                return;
            }

            crearTriggerBloque(bloque, seccion, ajustes, movil);
        });
    };

    const iniciarHeroe = (heroe, ajustes, movil, retraso) => {
        const items = obtenerItems(heroe);
        if (!items.length) return;

        const timeline = gsap.timeline({
            delay: retraso,
            onComplete: () => marcarVisible(items),
            onInterrupt: () => marcarVisible(items),
        });

        let posicion = 0;

        items.forEach((el) => {
            const tipo = tipoDe(el, heroe, CONFIG.tipoPorDefecto);

            gsap.set(el, estadoInicial(tipo, ajustes, movil));
            timeline.to(
                el,
                {
                    autoAlpha: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: ajustes.duracion,
                    ease: "power2.out",
                    overwrite: "auto",
                },
                posicion,
            );
            posicion += CONFIG.paso;
        });
    };

    const revelarTodo = () => {
        html.classList.remove("js-reveal");
        html.dataset.revealReady = "1";
        document.querySelectorAll(CONFIG.selectorItem).forEach((el) => {
            el.classList.add("reveal-listo");
        });
        gsap.set(CONFIG.selectorItem, {
            clearProps: "transform,opacity,visibility",
        });
    };

    const mmReveal = gsap.matchMedia();

    mmReveal.add(
        {
            escritorio:
                "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
            movil: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
            reducido: "(prefers-reduced-motion: reduce)",
        },
        (contexto) => {
            const condiciones = contexto.conditions || {};

            if (condiciones.reducido) {
                revelarTodo();
                return;
            }

            try {
                const ajustes = leerAjustes();
                const movil = Boolean(condiciones.movil);
                const heroe = document.querySelector(CONFIG.selectorHeroe);
                let heroeIniciado = false;

                if (heroe) {
                    const itemsHeroe = obtenerItems(heroe);

                    if (itemsHeroe.length) {
                        itemsHeroe.forEach((el) => {
                            gsap.set(
                                el,
                                estadoInicial(
                                    tipoDe(el, heroe, CONFIG.tipoPorDefecto),
                                    ajustes,
                                    movil,
                                ),
                            );
                        });

                        const precarga = document.getElementById("precarga");
                        const esperarPrecarga =
                            html.classList.contains("con-precarga") &&
                            Boolean(precarga);
                        const heroeFuera =
                            heroe.getBoundingClientRect().bottom <= 0;

                        const arrancar = () => {
                            if (heroeIniciado) return;
                            heroeIniciado = true;

                            iniciarHeroe(
                                heroe,
                                ajustes,
                                movil,
                                heroe.matches("header.hero")
                                    ? CONFIG.retrasoHeroeInicio
                                    : ajustes.retrasoHeroe,
                            );
                        };

                        if (heroeFuera) {
                            // Al recargar a mitad de página, el hero ya no se ve.
                            marcarVisible(itemsHeroe);
                        } else if (esperarPrecarga) {
                            document.addEventListener(
                                "precarga:fin",
                                arrancar,
                                { once: true },
                            );
                            gsap.delayedCall(
                                CONFIG.esperaPrecargaSeg,
                                arrancar,
                            );
                        } else {
                            arrancar();
                        }
                    }
                }

                const secciones = Array.from(
                    document.querySelectorAll(CONFIG.selectorSecciones),
                ).filter(
                    (seccion) => !seccion.matches(CONFIG.selectorHeroe),
                );

                secciones.forEach((seccion) =>
                    prepararSeccion(seccion, ajustes, movil),
                );

                html.dataset.revealReady = "1";

                ScrollTrigger.refresh();

                const refrescar = () => ScrollTrigger.refresh();
                if (document.readyState === "complete") {
                    refrescar();
                } else {
                    window.addEventListener("load", refrescar, {
                        once: true,
                    });
                }
            } catch (error) {
                revelarTodo();
            }
        },
    );

    // Red de seguridad para Safari/iOS: si por el cambio de altura del
    // navegador un ScrollTrigger no se dispara, revela lo que ya está
    // dentro de la pantalla para que no quede invisible.
    const rescatarVisibles = () => {
        const pendientes = Array.from(
            document.querySelectorAll(
                CONFIG.selectorItem + ":not(.reveal-listo)",
            ),
        ).filter((el) => {
            if (el.closest(EXCLUIDOS)) return false;
            if (el.closest(CONFIG.selectorHeroe)) return false;
            if (esAncestroItem(el)) return false;
            const r = el.getBoundingClientRect();
            return r.bottom > 0 && r.top < window.innerHeight;
        });

        if (pendientes.length) marcarVisible(pendientes);
    };

    window.setTimeout(rescatarVisibles, 2500);

    window.addEventListener("pageshow", (event) => {
        if (!event.persisted) return;
        ScrollTrigger.refresh();
        window.setTimeout(rescatarVisibles, 300);
    });
})();
