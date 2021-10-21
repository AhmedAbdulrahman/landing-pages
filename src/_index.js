import css from "./styles.scss";
const Splitting = require("splitting");

(function () {
  Splitting({
    by: "lines",
  });

  // This is a list of elements we like to track if they are in view and then apply the class.
  const leader = ".leader";
  const quote = ".quote";
  const benefitList = ".benefit-list__list > .benefit-item";
  const productList = ".product-list  .carousel__holder > .col-md-4";
  const productListButton = ".product-list  .button";
  const querySelector = `${leader}, ${benefitList}, ${productList}, ${productListButton}, ${quote}`;
  const className = "observed";
  let ticking = false;
  let lastKnownScrollPosition = 0;
  // Fall back for IE
  if (!"IntersectionObserver" in window) {
    document.querySelectorAll(querySelector).forEach((i) => {
      if (i) {
        i.classList.add(className);
      }
    });

    return;
  }


  let sideBySidelistener = function() {
    const sideBySideElement = document.querySelector('.side-by-side')
    const image = sideBySideElement.querySelector('.visual-block__image');

    lastKnownScrollPosition = window.scrollY;

    let repeatOften = function() {
      console.log('repeatOften');
      hideArrow(sideBySideElement, lastKnownScrollPosition);
      animateImage(sideBySideElement, image, lastKnownScrollPosition)

      if (ticking) {
        window.requestAnimationFrame(repeatOften)
      }
    };

    if (ticking) {
      window.requestAnimationFrame(repeatOften)
    }
  }


  function hideArrow(target, scrollPos) {
    if (!target) return
    if (scrollPos > 20) {
      if (!target.classList.contains('hidden')) {
        target.classList.add('hidden')
      }
    }
  }

  function animateImage(sideBySideElement, image, lastKnownScrollPosition) {
    let current = 0;
    let ease = 0.75;
    let containerTop = sideBySideElement.offsetTop;
    let containerBottom = containerTop + image.getBoundingClientRect().height;

    let target = (lastKnownScrollPosition - containerTop) / (containerBottom);
    current = parseFloat(lerp(current, target, ease)).toFixed(2);
    let scale = current / 4 + 1;
    scale = scale < 1 ? 1 : scale;
    scale = scale > 1.5 ? 1.5 : scale;

    setTransform(image, `scale(${scale.toFixed(2)})`);
  }

  function lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  function setTransform(el, transform) {
    el.style.transform = transform;
  }

  // Side By Side Module Observer - To determine when cta button is visible
  const sideBySideObserverCallback = (entries) => {
    ticking = entries.some(entry => entry.isIntersecting)
    entries.forEach((entry) => {

      if (entry.isIntersecting) {
        document.addEventListener('scroll', sideBySidelistener, true);
      } else {
        document.removeEventListener('scroll', sideBySidelistener, true)
      }
    });
  };
  document.querySelectorAll(".side-by-side").forEach((i) => {
    if (i) {
      const observer = new IntersectionObserver(
          (entries) => {
            sideBySideObserverCallback(entries, observer, i);
          },
      );
      observer.observe(i);
    }
  });


  document.querySelectorAll(querySelector).forEach((i) => {
    if (i) {
      const observer = new IntersectionObserver(
          (entries) => {
            Splitting({
              by: "lines",
            });
            observerCallback(entries, observer, i);
          },
          { threshold: 0, rootMargin: "0px" }
      );
      observer.observe(i);
    }
  });

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(className);
        observer.unobserve(entry.target);
      }
    });
  };

  /*************************************************************/



  /***************************** Circle Spinner Module Observer ********************************/

  /*const circleObserverCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;

        var percentValue = 75;
        var animationDuration = 1500;
        var percent = percentValue / 100;

        // Increse number

        var widthValue = 0;

        var widthAnim = widthValue;

        var id = setInterval(frame, animationDuration / percentValue);
        var widthIncrement = percentValue;
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
        var diameter = el.offsetWidth;
        var circumference = Math.ceil(diameter * Math.PI);
        //now we have the circumference, we know how long the ouline should be
        var stroke = Math.ceil(circumference * percent);
        //also workout how long the line doesn't exist for
        var diff = circumference - stroke;

        //now add the strok dash array for the first two values
        //TODO : could this all be done with css?
        el.querySelector(".percent-circle-inner").style.strokeDasharray =
            stroke + "px " + diff + "px";

        observer.unobserve(el);
      }
    });
  };

  document.querySelectorAll(".percent-circle").forEach((i) => {
    if (i) {
      const observer = new IntersectionObserver(
          (entries) => {
            circleObserverCallback(entries, observer, i);
          },
          { threshold: 0.5 }
      );
      observer.observe(i);
    }
  });*/

})();


/************************** Small paralax effect on text container ************************************/

/*document.querySelectorAll(".hero-a").forEach((i) => {
  if (i) {
    const observer = new IntersectionObserver(
        (entries) => {
          heroObserverCallback(entries, observer, i);
        },
        { threshold: 0 }
    );
    observer.observe(i);
  }
});
const heroObserverCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("observed");

      const paralax = entry.target.querySelector(".rel");
      const scale = entry.target.querySelector(".background");
      window.addEventListener("scroll", function () {
        let offset =
            entry.target.clientHeight - (entry.target.offsetTop - window.scrollY);

        const viewPortWidth = Math.max(
            document.documentElement.clientWidth || 0,
            window.innerWidth || 0
        );
        let changeScale = offset * 0.001 + 1;

        console.log("changeScale", changeScale);
        if (changeScale > 1 && changeScale < 1.5) {
          scale.style.transform = `scale(${changeScale})`;
        }

        if (viewPortWidth < 1024) {
          let changeOffSet = offset * 0.15;
          if (changeOffSet > -30 && changeOffSet < 300) {
            paralax.style.transform = `translateY(${changeOffSet}px)`;
          }
        } else {
          let changeOffSet = offset * 0.2;
          if (changeOffSet > -30 && changeOffSet < 300) {
            paralax.style.transform = `translateY(${changeOffSet}px)`;
          }
        }
      });
    }
  });
};*/
