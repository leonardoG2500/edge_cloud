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

// Prueba
// import Swup from "https://unpkg.com/swup@4?module";

// const swup = new Swup();

mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
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
});

const track = document.getElementById("track");

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
