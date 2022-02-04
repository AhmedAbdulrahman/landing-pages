import css from "./styles.scss";
import { setupPrevNextBtns, disablePrevNextBtns } from "./scripts/prevAndNextButtons";

// const Splitting = require("splitting");
import EmblaCarousel from 'embla-carousel'

(function () {
    // Fall back for IE
    if (!"IntersectionObserver" in window) {
        document.querySelectorAll(querySelector).forEach((i) => {
            if (i) {
                i.classList.add(className);
            }
        });
        return;
    }

    // Sliders
    const emblaCarousels = [
        {
            container: '.embla',
            viewport: '.embla__viewport',
            options: {
                dragFree: true,
                containScroll: 'trimSnaps',
                slidesToScroll: 3
            }
        },
        {
            container: '.product-category--main.embla',
            viewport: '.product-category-viewport.embla__viewport',
            options: {
                dragFree: true,
                slidesToScroll: 3,
                startIndex: 1
            }
        },
        {
            container: '.produts-list__slider',
            viewport: '.produts-list__slider.embla__viewport',
            prevBtn: '.embla__button--prev',
            nextBtn: '.embla__button--next',
            options: {
                slidesToScroll: 1,
                containScroll: "trimSnaps",
            }
        },
        {
            container: '.benefit-list__slider',
            viewport: '.benefit-list__slider.embla__viewport',
            options: {
                dragFree: true,
                slidesToScroll: 1,
                containScroll: "trimSnaps",
            }
        },
    ]

    emblaCarousels.forEach(emblaCarousel => {
        const wrap = document.querySelector(emblaCarousel.container);
        const viewPort = wrap.querySelector(emblaCarousel.viewport);
        const embla = EmblaCarousel(viewPort, emblaCarousel.options);

        if ( emblaCarousel.prevBtn !== undefined && emblaCarousel.nextBtn !== undefined ) {
            const prevBtn = wrap.querySelector( emblaCarousel.prevBtn);
            const nextBtn = wrap.querySelector( emblaCarousel.nextBtn);

            setupPrevNextBtns(prevBtn, nextBtn, embla);
        }
    });

})();
