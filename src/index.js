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

    const productList = ".products-list__root  .products-list__main > .product-list__item";
    const querySelector = `${productList}`;
    const CLASS_NAME = 'observed';

    // Sliders
    const emblaCarousels = [
        {
            container: '.imagelist__slider.embla',
            viewport: '.imagelist__main.embla__viewport',
            options: {
                containScroll: 'trimSnaps',
                draggable: true,
                skipSnaps: false
            }
        },
        {
            container: '.product-category--main.embla',
            viewport: '.product-category-viewport.embla__viewport',
            options: {
                containScroll: 'trimSnaps',
                draggable: true,
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

    const defaultObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(CLASS_NAME);
                    // Splitting({
                    //     by: "lines",
                    // });
                    defaultObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0,
            rootMargin: "0px"
        }
    );

    // Add Default intersection observer
    document.querySelectorAll(querySelector).forEach((i) => {
        defaultObserver.observe(i);
    });

})();
