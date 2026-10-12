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

gsap.from(".logo", {
    // color: "red",
    // backgroundColor: "yellow",
    y: -100,
    opacity: 0,
    // rotate: 360,
    // scale: 3,
    duration: 1,
    // delay: 2,
    ease: "power2.inOut",
});

gsap.from(".btn2", {
    y: -200,
    ease: "power2.inOut",
    opacity: 0,
    duration: 0.8,
    stagger: 0.02,
});

// Las imágenes cambian el layout al cargar: recalcula posiciones
window.addEventListener("load", () => ScrollTrigger.refresh());
