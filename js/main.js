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
