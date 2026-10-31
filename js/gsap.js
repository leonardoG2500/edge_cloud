gsap.registerPlugin(ScrollTrigger);

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
