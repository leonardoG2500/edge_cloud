(() => {
    const forms = document.querySelectorAll("#form-contacto");
    if (!forms.length) return;

    const modal = document.getElementById("form-modal");
    if (!modal) return;
    
    const modalIcon = document.getElementById("modal-icon");
    const modalTitle = document.getElementById("modal-title");
    const modalText = document.getElementById("modal-text");
    const closeBtns = modal.querySelectorAll("[data-modal-close]");

    const openModal = ({ type = "success", title, text }) => {
        if (!modalIcon) return;
        modalIcon.className = "modal__icon";
        if (type === "success") {
            modalIcon.classList.add("success");
            modalIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        } else if (type === "error") {
            modalIcon.classList.add("error");
            modalIcon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        } else {
            modalIcon.classList.add("warning");
            modalIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
        }

        if (modalTitle) modalTitle.textContent = title;
        if (modalText) modalText.textContent = text;
        modal.classList.add("is-active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        modal.classList.remove("is-active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    };

    closeBtns.forEach((btn) => btn.addEventListener("click", closeModal));
    const overlay = modal.querySelector(".modal__overlay");
    if (overlay) overlay.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-active")) {
            closeModal();
        }
    });

    forms.forEach((form) => {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const privacy = form.querySelector('input[name="privacidad"]');
            if (privacy && !privacy.checked) {
                openModal({
                    type: "warning",
                    title: "Aviso de privacidad",
                    text: "Debes leer y aceptar el aviso de privacidad para poder enviar tu solicitud.",
                });
                privacy.focus();
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : "";
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Enviando...";
            }

            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: form.method || "POST",
                    body: formData,
                });

                const data = await response.json().catch(() => ({}));

                if (response.ok && data.success) {
                    openModal({
                        type: "success",
                        title: "¡Envío exitoso!",
                        text: "Gracias por contactarnos. Hemos recibido tu proyecto y te responderemos a la brevedad.",
                    });
                    form.reset();
                    return;
                }

                const msg = (data.message || "").toLowerCase();

                if (msg.includes("bot") || msg.includes("spam") || data.error === "spam") {
                    openModal({
                        type: "warning",
                        title: "Verificación fallida",
                        text: "Parece que se detectó actividad sospechosa. Inténtalo nuevamente o contáctanos por WhatsApp.",
                    });
                    return;
                }

                if (msg.includes("too many") || msg.includes("rate") || response.status === 429) {
                    openModal({
                        type: "warning",
                        title: "Demasiados envíos",
                        text: "Has realizado muchos envíos en poco tiempo. Por favor, espera unos minutos e inténtalo de nuevo.",
                    });
                    return;
                }

                openModal({
                    type: "error",
                    title: "Error al enviar",
                    text: data.message || "Ocurrió un error al enviar tu solicitud. Por favor, inténtalo de nuevo o contáctanos por WhatsApp.",
                });
            } catch (error) {
                openModal({
                    type: "error",
                    title: "Error de conexión",
                    text: "No pudimos conectarnos con el servidor. Verifica tu conexión a internet e inténtalo nuevamente.",
                });
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }
        });
    });
})();
