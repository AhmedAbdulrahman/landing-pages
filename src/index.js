import css from "./styles.scss";
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
            options: {
                slidesToScroll: 1,
        containScroll: "trimSnaps",
            }
        },
        {
            container: '.benefit-list__slider',
            viewport: '.benefit-list__slider.embla__viewport',
            options: {
                slidesToScroll: 1,
                containScroll: "trimSnaps",
            }
        },
    ]

    emblaCarousels.forEach(emblaCarousel => {
        const wrap = document.querySelector(emblaCarousel.container);
        const viewPort = wrap.querySelector(emblaCarousel.viewport);
        const embla = EmblaCarousel(viewPort, emblaCarousel.options);
    });

})();
