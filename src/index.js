import css from "./styles.scss";
const Splitting = require("splitting");

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
    const CLASS_NAME = 'observed';
    const leader = ".leader";
    const quote = ".quote";
    const benefitList = ".benefit-list__list > .benefit-list__list-item";
    const productList = ".product-list .carousel__holder .usp-block__icon-holder";
    const productListButton = ".product-list .button";
    const querySelector = `${leader}, ${benefitList}, ${productList}, ${productListButton}, ${quote}`;
    const sideBySideElement = document.querySelector('.side-by-side')
    const image = sideBySideElement.querySelector('.visual-block__image');
    const heroImage = document.querySelector('.hero-a--image');

    function scrollHandler () {
        const scrollY = window.scrollY

        requestAnimationFrame(() => {
            const factor = Math.min(1, scrollY / (image.offsetHeight / 0.22) );

            hideArrow(sideBySideElement, scrollY);
            image.style.transform = `scale(${1 + factor})`;
        })
    }

    function heroScrollHandler () {
        const scrollY = window.scrollY
        const heroSection = document.querySelector('.hero-a')

        requestAnimationFrame(() => {
            const factor = Math.min(1, scrollY / (heroSection.offsetHeight / 0.09) );
            heroImage.style.transform = `scale(${1 + factor})`;
        })
    }


    function hideArrow(target, scrollPos) {
        if (!target) return
        if (scrollPos > 20) {
            if (!target.classList.contains('arrow-hidden')) {
                target.classList.add('arrow-hidden')
            }
        }
    }

    const defaultObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(CLASS_NAME);
                    Splitting({
                        by: "lines",
                    });
                    defaultObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0,
            rootMargin: "0px"
        }
    );


    const sideBySideObserver = new IntersectionObserver(
        (entries) => {
            const anyInteriesIntersection = entries.some(entry => entry.isIntersecting)

            if (anyInteriesIntersection) {
                document.addEventListener('scroll', scrollHandler, true);
            } else {
                document.removeEventListener('scroll', scrollHandler, true)
            }
        },
    );

    const heroObserver = new IntersectionObserver(
        (entries) => {
            const anyInteriesIntersection = entries.some(entry => entry.isIntersecting)

            if (anyInteriesIntersection) {
                document.addEventListener('scroll', heroScrollHandler, true);
            } else {
                document.removeEventListener('scroll', heroScrollHandler, true)
            }
        },
    );

    const circleObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;

                    const percentValue = 75;
                    const animationDuration = 1500;
                    const percent = percentValue / 100;

                    let widthValue = 0;
                    let widthAnim = widthValue;

                    let id = setInterval(frame, animationDuration / percentValue);
                    let widthIncrement = percentValue;
                    widthValue = widthAnim + widthIncrement;
                    function frame() {
                        if (widthAnim >= widthValue || widthValue > 100) {
                            clearInterval(id);
                        } else {
                            widthAnim++;
                            el.dataset.percent = widthAnim;
                        }
                    }

                    //work out the circumference from the width
                    let diameter = el.offsetWidth;
                    let circumference = Math.ceil(diameter * Math.PI);
                    //now we have the circumference, we know how long the ouline should be
                    let stroke = Math.ceil(circumference * percent);
                    //also workout how long the line doesn't exist for
                    let diff = circumference - stroke;

                    //now add the strok dash array for the first two values
                    el.querySelector(".percent-circle-inner").style.strokeDasharray =
                        stroke + "px " + diff + "px";

                    circleObserver.unobserve(el);
                }
            });
        }, {threshold: 0.5},
    );


    // Add Default intersection observer
    document.querySelectorAll(querySelector).forEach((i) => {
        defaultObserver.observe(i);
    });

    // Add intersection observer
    document.querySelectorAll(".side-by-side").forEach((i) => {
        sideBySideObserver.observe(i);
    });

    // Add intersection observer
    document.querySelectorAll(".percent-circle").forEach((i) => {
        circleObserver.observe(i);
    })

    // Add intersection observer
    document.querySelectorAll(".hero-a").forEach((i) => {
        heroObserver.observe(i);
    })

})();
