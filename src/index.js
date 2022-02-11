import css from './styles.scss'
import EmblaCarousel from 'embla-carousel'
import { setupPrevNextBtns } from './scripts/prevAndNextButtons'
import { setupDotBtns, generateDotBtns, selectDotBtn } from './scripts/dotButtons'
import ScrollProgress from './scripts/scrollProgress'
// const Splitting = require("splitting");
;(function () {
  // Fall back for IE
  if (!'IntersectionObserver' in window) {
    document.querySelectorAll(querySelector).forEach((i) => {
      if (i) {
        i.classList.add(CLASS_NAME)
      }
    })
    return
  }

  window.addEventListener('load', function () {
    var scrollFx = new ScrollProgress({})
  })

  const productList =
    '.products-list__root  .products-list__main > .product-list__item:nth-child(-n+4)'
  const productCategory =
    '.product-category__root  .product-category__main > .product-category--item:nth-child(-n+4)'
  const imagesList =
    '.imagelist-root  .imagelist__main .imagelist__items-container > .imagelist-item:nth-child(-n+3)'
  const benefitList =
    '.benefit-list__root  .benefit-list__slider .benefit-list__slider.embla__viewport .benefit-list__main > .benefit-list__item'
  const supportContent = '.support__root .container .support__content > *'
  const sideBySideContent =
    '.side-by-side__main .side-by-side__content > * , .side-by-side__main .side-by-side__media > *'
  const editorialImage = '.editorial__main .editorial__media > *'

  const hardwareImage = '.hardware__main .hardware__media__item:nth-child(-n+1)'
  const hardwareSelectors = '.hardware__main .hardware__list-selector'
  const hardwareproductText = '.hardware__payment-details > * > *'

  const querySelector = `${productList}, ${imagesList}, ${benefitList}, ${supportContent}, ${productCategory}, ${sideBySideContent}, ${editorialImage}, ${hardwareImage}, ${hardwareSelectors}, ${hardwareproductText}`
  const CLASS_NAME = 'observed'

  // Sliders
  const emblaCarousels = [
    {
      container: '.imagelist__slider.embla',
      viewport: '.imagelist__main__viewport',
      options: {
        containScroll: 'trimSnaps',
        draggable: true,
        skipSnaps: false,
      },
    },
    {
      container: '.product-category__slider',
      viewport: '.product-category__viewport',
      options: {
        slidesToScroll: 1,
        containScroll: 'trimSnaps',
        skipSnaps: false,
        dragFree: true,
      },
    },
    {
      container: '.produts-list__slider',
      viewport: '.produts-list__viewport',
      prevBtn: '.embla__button--prev',
      nextBtn: '.embla__button--next',
      options: {
        slidesToScroll: 1,
        containScroll: 'trimSnaps',
        skipSnaps: false,
        dragFree: true,
      },
    },
    {
      container: '.benefit-list__slider',
      viewport: '.benefit-list__viewport',
      options: {
        dragFree: true,
        slidesToScroll: 1,
        containScroll: 'trimSnaps',
      },
    },
    {
      container: '.hardware__media-carousel',
      viewport: '.hardware__media-viewport',
      dots: '.hardware__media-carousel__dots',
      options: {
        slidesToScroll: 1,
        skipSnaps: false,
      },
    },
  ]

  emblaCarousels.forEach((emblaCarousel) => {
    const wrap = document.querySelector(emblaCarousel.container)
    if (wrap !== null) {
      const viewPort = wrap.querySelector(emblaCarousel.viewport)
      const embla = EmblaCarousel(viewPort, emblaCarousel.options)

      if (emblaCarousel.prevBtn !== undefined && emblaCarousel.nextBtn !== undefined) {
        const prevBtn = wrap.querySelector(emblaCarousel.prevBtn)
        const nextBtn = wrap.querySelector(emblaCarousel.nextBtn)

        if (prevBtn !== null || nextBtn !== null) {
          setupPrevNextBtns(prevBtn, nextBtn, embla)
        }
      }

      if (emblaCarousel.dots !== undefined) {
        const dots = document.querySelector(emblaCarousel.dots)

        if (dots !== null) {
          const dotsArray = generateDotBtns(dots, embla)
          console.log('dotsArray', dotsArray)
          const setSelectedDotBtn = selectDotBtn(dotsArray, embla)

          setupDotBtns(dotsArray, embla)

          embla.on('select', setSelectedDotBtn)
          embla.on('init', setSelectedDotBtn)
        }
      }
    }
  })

  // Helpers
  function calculateVerticalPercentage(bounds, threshold = 0, root = window) {
    if (!root) return 0
    const vh = (root instanceof Element ? root.clientHeight : root.innerHeight) || 0
    const offset = threshold * bounds.height
    const percentage = (bounds.bottom - offset) / (vh + bounds.height - offset * 2)

    return 1 - Math.max(0, Math.min(1, percentage))
  }

  // Private Handlers
  function handleOnShowMoreClick() {
    const linkText = this.children[0].innerHTML.toUpperCase()

    if (linkText === 'SHOW MORE') {
      this.children[0].innerHTML = 'Show less'
      this.previousElementSibling.classList.add('remove-fade')
      this.children[0].classList.remove('show-more-label')
      this.children[0].classList.add('show-less-label')

      this.parentNode.parentNode.children[0].classList.add('showContent')
    } else {
      this.children[0].innerHTML = 'Show more'
      this.previousElementSibling.classList.remove('remove-fade')
      this.children[0].classList.remove('show-less-label')
      this.children[0].classList.add('show-more-label')

      this.parentNode.parentNode.children[0].classList.remove('showContent')
    }
  }

  const defaultObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(CLASS_NAME)
          defaultObserver.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0,
      rootMargin: '0px',
    },
  )

  function brandHeroScrollHandler() {
    const brandHeroSection = document.querySelector('.brand-hero__root')
    const brandHeroImage = document.querySelector('.brand-hero__image')

    if (brandHeroSection !== null) {
      requestAnimationFrame(() => {
        const percentage = calculateVerticalPercentage(
          brandHeroSection.getBoundingClientRect(),
          0,
          brandHeroSection,
        )

        brandHeroImage.style.transform = `scale(${1 + percentage * 0.3})`
      })
    }
  }

  const imagesObserver = new IntersectionObserver((entries) => {
    const anyInteriesIntersection = entries.some((entry) => entry.isIntersecting)
    console.log('anyInteriesIntersection', anyInteriesIntersection)
    if (anyInteriesIntersection) {
      document.addEventListener('scroll', brandHeroScrollHandler, true)
    } else {
      document.removeEventListener('scroll', brandHeroScrollHandler, true)
    }
  })

  // Add Default intersection observer
  document.querySelectorAll(querySelector).forEach((i) => {
    defaultObserver.observe(i)
  })

  document.querySelectorAll('.brand-hero__image').forEach((i) => {
    imagesObserver.observe(i)
  })

  // Show More
  document.querySelectorAll('.show-more-btn').forEach((i) => {
    i.addEventListener('click', handleOnShowMoreClick, false)
  })
})()
