/*
========================================================

ASL Design System

Navbar Module

Responsibility:

Responsive Mobile Navigation

========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    const toggle =
        document.querySelector(".mobile-toggle");

    const menu =
        document.querySelector(".nav-menu");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {

        const expanded =
            toggle.getAttribute("aria-expanded") === "true";

        toggle.setAttribute(
            "aria-expanded",
            !expanded
        );

        menu.classList.toggle("open");

    });

    /*
    Close menu when a link is clicked
    */

    menu.querySelectorAll(".nav-link").forEach(link => {

        link.addEventListener("click", () => {

            menu.classList.remove("open");

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

    /*
    Restore desktop state after resize
    */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 992) {

            menu.classList.remove("open");

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });

});