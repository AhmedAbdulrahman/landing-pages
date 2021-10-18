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
  // Fall back for IE
  if (!"IntersectionObserver" in window) {
    document.querySelectorAll(querySelector).forEach((i) => {
      if (i) {
        i.classList.add(className);
      }
    });

    return;
  }

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

  // Side By Side Module Observer - To determine when cta button is visible
  const continueObserverCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(className);
      } else {
        if (entry.target.classList.contains(className)) {
          entry.target.classList.remove(className);
        }
      }
    });
  };
  document.querySelectorAll(".side-by-side").forEach((i) => {
    if (i) {
      const observer = new IntersectionObserver(
        (entries) => {
          continueObserverCallback(entries, observer, i);
        },
        { threshold: 0.9 } // As soon as the user scrolls a few pixels the cta disapears
      );
      observer.observe(i);
    }
  });
  /***************************** Circle Spinner Module Observer ********************************/

  const circleObserverCallback = (entries, observer) => {
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
  });

})();

/****************************** Side by side Top Module scaaling effect ******************************************/

let image = document.querySelector(".side-by-side .visual-block__image");
let container = document.querySelector(".side-by-side");
let containerTop = 0;
let containerBottom = 0;
let current = 0;
let target = 0;
let ease = 0.75;

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

function setTransform(el, transform) {
  el.style.transform = transform;
}

function init() {
  containerTop = container.offsetTop;
  containerBottom = containerTop + image.getBoundingClientRect().height;
}

function animate() {
  current = parseFloat(lerp(current, target, ease)).toFixed(2);
  target = (window.scrollY - container.offsetTop) / containerBottom;

  let scale = current / 4 + 1;
  scale = scale < 1 ? 1 : scale;
  scale = scale > 1.5 ? 1.5 : scale;
  setTransform(image, `scale(${scale})`);
  requestAnimationFrame(animate);
}

init();
animate();

/*************************** Small paralax effect on text container ************************************/

document.querySelectorAll(".hero-a").forEach((i) => {
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
};
