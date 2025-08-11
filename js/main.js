(function ($) {
  "use strict";

  // Initiate the wowjs
  new WOW().init();

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $(".sticky-top").addClass("shadow-sm").css("top", "0px");
    } else {
      $(".sticky-top").removeClass("shadow-sm").css("top", "-100px");
    }
  });

  // Loader
  document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    const content = document.getElementById("contenido");

    // Mostrar loader al cargar la página
    window.addEventListener("load", () => {
      setTimeout(() => {
        loader.classList.add("fade-out");
        document.body.classList.remove("loading");
        content.style.display = "block";
      }, 800);
    });

    // Agregar transición solo a enlaces internos y sin target="_blank"
    const enlaces = document.querySelectorAll("a[href]");
    enlaces.forEach((link) => {
      link.addEventListener("click", (e) => {
        const url = link.href;
        const esMismaPagina = url === window.location.href;
        const esInterno = link.host === window.location.host;
        const abreNuevaPestaña = link.target === "_blank";

        if (
          !esInterno ||
          abreNuevaPestaña ||
          esMismaPagina ||
          url.includes("#")
        ) {
          return; // Dejamos que el navegador actúe normal
        }

        e.preventDefault(); // Evitamos navegación inmediata

        loader.classList.remove("fade-out");
        loader.style.opacity = "1";
        loader.style.visibility = "visible";
        document.body.classList.add("loading");

        setTimeout(() => {
          window.location.href = url;
        }, 800);
      });
    });

    // Manejar "volver atrás"
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        loader.classList.remove("fade-out");
        document.body.classList.add("loading");
        setTimeout(() => {
          loader.classList.add("fade-out");
          document.body.classList.remove("loading");
          content.style.display = "block";
        }, 600);
      }
    });
  });

  // Back to top button
  const backToTopButton = document.getElementById("backToTop");

  // Muestra el botón al hacer scroll
  window.addEventListener("scroll", () => {
    // Condición para mostrar el botón (puedes ajustarla)
    if (window.scrollY > 200) {
      backToTopButton.classList.add("visible");
      backToTopButton.style.opacity = 1;
    } else {
      backToTopButton.style.opacity = 0;
      setTimeout(() => {
        backToTopButton.classList.remove("visible");
      }, 300); // Tiempo de desvanecimiento
    }
  });

  // Función para subir al inicio con animación suave
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Animación suave
    });
    backToTopButton.style.opacity = 0;
    setTimeout(() => {
      backToTopButton.classList.remove("visible");
    }, 300); // Tiempo de desvanecimiento
  });

  // Project and Testimonial carousel
  $(".project-carousel, .testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    margin: 25,
    loop: true,
    center: true,
    dots: false,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });
})(jQuery);
