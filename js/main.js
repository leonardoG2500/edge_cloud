(function () {
    const items = Array.from(document.querySelectorAll(".tl-item"));
    const railFill = document.getElementById("railFill");
    const timeline = document.getElementById("timeline");
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;

    // Si el usuario prefiere menos movimiento, mostramos todo activado de una vez.
    if (prefersReducedMotion) {
        items.forEach((item) => item.classList.add("is-active"));
        if (railFill) railFill.style.height = "100%";
        return;
    }

    // Activa cada checkpoint cuando cruza la línea de referencia (40% desde arriba).
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-active");
                }
            });
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    items.forEach((item) => observer.observe(item));

    // Llena el riel según cuánto se ha recorrido la sección del timeline.
    let ticking = false;

    function updateRailFill() {
        const rect = timeline.getBoundingClientRect();
        const viewportReference = window.innerHeight * 0.4;
        const progressed = viewportReference - rect.top;
        const ratio = Math.min(Math.max(progressed / rect.height, 0), 1);
        railFill.style.height = ratio * 100 + "%";
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateRailFill);
            ticking = true;
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateRailFill();
})();
