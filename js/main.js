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
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 100, 'easeInOutExpo');
        return false;
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
var $loader = document.querySelector('.loader')

window.onload = function() {
  $loader.classList.remove('loader--active')
};

document.querySelector('.btn').addEventListener('click', function () {
  $loader.classList.add('loader--active')
  
  window.setTimeout(function () {
    $loader.classList.remove('loader--active')
  }, 5000)
})


document.addEventListener("DOMContentLoaded", () => {
    const customCursor = document.getElementById("custom-cursor");
  
    // Mover el cursor personalizado con el mouse
    document.addEventListener("mousemove", (e) => {
      customCursor.style.top = `${e.clientY}px`;
      customCursor.style.left = `${e.clientX}px`;
    });
  
    // Cambiar estilos al interactuar con enlaces u otros elementos
    document.querySelectorAll("a, button").forEach(el => {
      el.addEventListener("mouseenter", () => {
        customCursor.style.transform = "scale(1.5)"; // Agrandar el cursor
        customCursor.style.backgroundColor = "rgba(255, 126, 179, 0.3)"; // Color de fondo
      });
      el.addEventListener("mouseleave", () => {
        customCursor.style.transform = "scale(1)";
        customCursor.style.backgroundColor = "transparent";
      });
    });
  });

  let cursorX = 0, cursorY = 0;
let posX = 0, posY = 0;

document.addEventListener("mousemove", (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
});

function animateCursor() {
  posX += (cursorX - posX) * 0.1; // Interpolación suave
  posY += (cursorY - posY) * 0.1;

  customCursor.style.top = `${posY}px`;
  customCursor.style.left = `${posX}px`;

  requestAnimationFrame(animateCursor); // Loop continuo
}

animateCursor();


// //header img Prueba
// var headerBG = document.getElementById('bg')
// window.addEventListener('scroll', function(){
//     headerBG.style.opacity = 1 - +window.pageYOffset/550+''
//     headerBG.style.top = +window.pageYOffset+'px'
//     headerBG.style.backgroundPositionY = - +window.pageYOffset/2+'px'
// })


