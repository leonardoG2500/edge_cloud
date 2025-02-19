(function ($) {
    "use strict";


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });


    
  
    // Back to top button

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




    // $(window).scroll(function () {
    //     if ($(this).scrollTop() > 300) {
    //         $('.back-to-top').fadeIn('slow');
    //     } else {
    //         $('.back-to-top').fadeOut('slow');
    //     }
    // });
    // $('.back-to-top').click(function () {
    //     $('html, body').animate({scrollTop: 0}, 100, 'easeInOutExpo');
    //     return false;
    // });

    

    // Project and Testimonial carousel
    $(".project-carousel, .testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
			0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);


//Boton de carga
window.addEventListener("load", () => {
      const loader = document.getElementById("loader");
      const mainContent = document.querySelector("main");

      setTimeout(() => {
        loader.classList.add("hidden");
        setTimeout(() => {
          loader.style.display = "none";
          mainContent.style.display = "block";
        }, 500); // Tiempo para que se complete la transición de difuminado
      }, 1500); // Duración de la pantalla de carga (1.5 segundos)
    });

    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        const loader = document.getElementById("loader");
        const mainContent = document.querySelector("main");

        loader.style.display = "flex";
        mainContent.style.display = "none";
        loader.classList.remove("hidden");

        setTimeout(() => {
          loader.classList.add("hidden");
          setTimeout(() => {
            loader.style.display = "none";
            mainContent.style.display = "block";
          }, 500);
        }, 1500);
      }
    });




// //header img Prueba
// var headerBG = document.getElementById('bg')
// window.addEventListener('scroll', function(){
//     headerBG.style.opacity = 1 - +window.pageYOffset/550+''
//     headerBG.style.top = +window.pageYOffset+'px'
//     headerBG.style.backgroundPositionY = - +window.pageYOffset/2+'px'
// })


