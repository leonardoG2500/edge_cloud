gsap.from(".logo", {
    // color: "red",
    // backgroundColor: "yellow",
    y: -100,
    opacity: 0,
    // rotate: 360,
    // scale: 3,
    duration: 1,
    // delay: 2,
    ease: "power2.inOut",
});

gsap.from(".btn2", {
    y: -200,
    ease: "power2.inOut",
    duration: 0.8,
    stagger: 0.025,
});
