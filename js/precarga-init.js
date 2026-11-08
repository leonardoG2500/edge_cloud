try {
    const sinMovimiento = matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!sessionStorage.getItem("precarga") && !sinMovimiento) {
        document.documentElement.classList.add("con-precarga");
    }
} catch (e) {}
