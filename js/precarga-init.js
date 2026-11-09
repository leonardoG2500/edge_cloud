try {
    const sinMovimiento = matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;

    // Con movimiento reducido nunca ocultamos ni animamos nada.
    // Sin esta clase, el CSS deja todo visible desde el primer pintado.
    if (!sinMovimiento) {
        const raiz = document.documentElement;
        raiz.classList.add("js-reveal");

        // Red de seguridad: si GSAP no arranca (CDN bloqueado, error, etc.),
        // mostramos todo a los ~3 s. Sin JS, esta clase nunca se agrega.
        window.setTimeout(() => {
            if (raiz.dataset.revealReady === "1") return;

            raiz.classList.remove("js-reveal");

            document.querySelectorAll("[data-reveal-item]").forEach((el) => {
                el.style.removeProperty("transform");
                el.style.removeProperty("opacity");
                el.style.removeProperty("visibility");
                el.classList.add("reveal-listo");
            });
        }, 3000);
    }
} catch (e) {}
