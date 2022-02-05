import css from "./styles.scss";
import { setupPrevNextBtns, disablePrevNextBtns } from "./scripts/prevAndNextButtons";

// const Splitting = require("splitting");
import EmblaCarousel from 'embla-carousel'

(function () {
    // Fall back for IE
    if (!"IntersectionObserver" in window) {
        document.querySelectorAll(querySelector).forEach((i) => {
            if (i) {
                i.classList.add(CLASS_NAME);
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

    // Helpers
    function calculateVerticalPercentage(
        bounds,
        threshold = 0,
        root = window,
    ) {
        if (!root) return 0
        const vh =
            (root instanceof Element ? root.clientHeight : root.innerHeight) || 0
        const offset = threshold * bounds.height
        const percentage =
            (bounds.bottom - offset) / (vh + bounds.height - offset * 2)

        return 1 - Math.max(0, Math.min(1, percentage))
    }

    // Private Handlers
    function liveChatScrollHandler () {
        const liveChatSection = document.querySelector('.live-chat__root')

        requestAnimationFrame(() => {
            const percentage = calculateVerticalPercentage(liveChatSection.getBoundingClientRect(), 0, window)
            liveChatImage.style.transform = `scale(${1 + percentage * 0.1})`;
        })
    }

    const defaultObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(CLASS_NAME);
                    defaultObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0,
            rootMargin: "0px"
        }
    );

    const liveChatObserver = new IntersectionObserver(
        (entries) => {
            const anyInteriesIntersection = entries.some(entry => entry.isIntersecting)

            if (anyInteriesIntersection) {
                document.addEventListener('scroll', liveChatScrollHandler, true);
            } else {
                document.removeEventListener('scroll', liveChatScrollHandler, true)
            }
        },
    );

    // Add Default intersection observer
    document.querySelectorAll(querySelector).forEach((i) => {
        defaultObserver.observe(i);
    });

     // Add intersection observer for live chat
     document.querySelectorAll(".live-chat__root").forEach((i) => {
        liveChatObserver.observe(i);
    })

})();
