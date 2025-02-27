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
// Show loader on page load
document.addEventListener("DOMContentLoaded", function() {
  document.body.classList.add('loading');
});

// Hide loader when page is fully loaded
window.addEventListener("load", function() {
  document.body.classList.remove('loading');
  document.body.classList.add('loaded');
  setTimeout(function() {
      document.getElementById('loader-wrapper').style.display = 'none';
  }, 500); // Wait for the fade-out transition to complete
});




// //header img Prueba
// var headerBG = document.getElementById('bg')
// window.addEventListener('scroll', function(){
//     headerBG.style.opacity = 1 - +window.pageYOffset/550+''
//     headerBG.style.top = +window.pageYOffset+'px'
//     headerBG.style.backgroundPositionY = - +window.pageYOffset/2+'px'
// })


