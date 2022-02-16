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

  const editorialElements = document.querySelectorAll('.editorial__root')
  const sideBySideElements = document.querySelectorAll('.side-by-side__root')
  const subscriptionElements = document.querySelectorAll('.subscription__root')
  const articleElements = document.querySelectorAll('.article__root')

  const editorialElementsInView = new Set()
  const mediaQuery = window.matchMedia('(min-width: 768px)')

  // Sliders
  const emblaCarousels = [
    {
      container: '.editorial__embla-slider',
      viewport: '.embla__viewport',
      dots: '.editorial.embla__dots',
      options: {
        slidesToScroll: 1,
      },
    },
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
        dragFree: false,
        slidesToScroll: 1,
        containScroll: 'trimSnaps',
      },
    },
    {
      container: '.advantages__slider',
      viewport: '.advantages__viewport',
      dots: '.embla__dots',
      options: {
        slidesToScroll: 1,
        containScroll: 'trimSnaps',
        skipSnaps: false,
        dragFree: false,
      },
    },
    {
      container: '.hardware__media-carousel',
      viewport: '.hardware__media-viewport',
      dots: '.embla__dots',
      options: {
        slidesToScroll: 1,
        skipSnaps: false,
      },
    },
    {
      container: '.discount-products__viewport',
      viewport: '.discount-products__items',
      prevBtn: '.embla__button--prev',
      nextBtn: '.embla__button--next',
      options: {
        containScroll: 'trimSnaps',
      },
    },
  ]

  emblaCarousels.forEach((emblaCarousel) => {
    const wrap = [...document.querySelectorAll(emblaCarousel.container)]
    if (wrap.length > 0) {
      wrap.forEach((container) => {
        const viewPort = container.querySelector(emblaCarousel.viewport)
        const embla = EmblaCarousel(viewPort, emblaCarousel.options)

        if (emblaCarousel.prevBtn !== undefined && emblaCarousel.nextBtn !== undefined) {
          const prevBtn = container.querySelector(emblaCarousel.prevBtn)
          const nextBtn = container.querySelector(emblaCarousel.nextBtn)
          if (prevBtn !== null || nextBtn !== null) {
            setupPrevNextBtns(prevBtn, nextBtn, embla)
          }
        }

        if (emblaCarousel.dots !== undefined) {
          const dots = document.querySelector(emblaCarousel.dots)
          if (dots !== null) {
            const dotsArray = generateDotBtns(dots, embla)
            const setSelectedDotBtn = selectDotBtn(dotsArray, embla)

            setupDotBtns(dotsArray, embla)
            embla.on('select', setSelectedDotBtn)
            embla.on('init', setSelectedDotBtn)
          }
        }
      })
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

  function handleDocumentScroll() {
    editorialElementsInView.forEach((root) => {
      const imageBackground = root.querySelector('.background-image')
      const imageForegroundImage = root.querySelector('.has-foregroundImage > img')
      const imageMedia = root.querySelector('img')
      const rect = root.getBoundingClientRect()
      const percentage = calculateVerticalPercentage(rect)

      if (imageBackground !== null) {
        if (mediaQuery.matches === false) {
          imageBackground.style.backgroundSize = `${100 + percentage * 130}%, cover`
        } else {
          imageBackground.style.backgroundSize = `${100 + percentage * 42}%, cover`
        }
      }
      if (imageForegroundImage !== null) {
        // Check if the media query is true
        if (mediaQuery.matches) {
          imageForegroundImage.style.transform = `translateX(${50 + percentage * 250}px)`
        }

        imageForegroundImage.style.opacity = `${percentage * 2.8}`
      } else if (imageMedia !== null) {
        imageMedia.style.transform = `scale(${1 + percentage * 0.8})`
      }
    })
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

  function handleEditorialIntersects(entries) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        editorialElementsInView.add(entry.target)
      } else {
        editorialElementsInView.delete(entry.target)
      }
    })

    if (editorialElementsInView.size > 0) {
      document.addEventListener('scroll', handleDocumentScroll, { passive: true })
      handleDocumentScroll()
    } else {
      document.removeEventListener('scroll', handleDocumentScroll, { passive: true })
    }
  }

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

  function liveChatScrollHandler() {
    const liveChatSection = document.querySelector('.live-chat__root')
    const liveChatImage = document.querySelector('.live-chat__image')

    if (liveChatSection !== null) {
      requestAnimationFrame(() => {
        const percentage = calculateVerticalPercentage(
          liveChatSection.getBoundingClientRect(),
          0,
          window,
        )

        liveChatImage.style.transform = `scale(${1 + percentage * 0.3})`
      })
    }
  }

  const liveChatObserver = new IntersectionObserver((entries) => {
    const anyInteriesIntersection = entries.some((entry) => entry.isIntersecting)

    if (anyInteriesIntersection) {
      document.addEventListener('scroll', liveChatScrollHandler, true)
    } else {
      document.removeEventListener('scroll', liveChatScrollHandler, true)
    }
  })

  const imagesObserver = new IntersectionObserver((entries) => {
    const anyInteriesIntersection = entries.some((entry) => entry.isIntersecting)

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

  document.querySelectorAll('.live-chat__root').forEach((i) => {
    liveChatObserver.observe(i)
  })

  const editorialObserver = new IntersectionObserver(handleEditorialIntersects)

  editorialElements.forEach((el) => {
    editorialObserver.observe(el)
  })

  sideBySideElements.forEach((el) => {
    editorialObserver.observe(el)
  })

  subscriptionElements.forEach((el) => {
    editorialObserver.observe(el)
  })
  articleElements.forEach((el) => {
    editorialObserver.observe(el)
  })

  // Show More
  document.querySelectorAll('.show-more-btn').forEach((i) => {
    i.addEventListener('click', handleOnShowMoreClick, false)
  })

  document.querySelectorAll('.tab-list').forEach((root) => {
    const tabs = root.querySelectorAll('.tab-item')

    tabs.forEach((tab) => {
      tab.addEventListener('click', (event) => {
        // Remove 'active' class style from previously selected tab
        root.querySelector('.tab-item.active')?.classList.remove('active') // optional chaining
        // Add 'active' class style to selected tab
        event.currentTarget.classList.add('active')

        // Hide previously selected tab's content
        root.nextElementSibling.querySelector('.tab-content.show')?.classList.remove('show')
        // tab.parentElement.parentElement.nextElementSibling
        //   .querySelector('.tab-content.show')
        //   .classList.remove('show')
        // Show selected tab's respective content
        const selectedContent = event.currentTarget.dataset.content // see .dataset console.log() above

        console.log('selectedContent', selectedContent)
        root.nextElementSibling.querySelector(selectedContent)?.classList.add('show')
      })
    })
  })

  document.querySelectorAll('.accordion--items').forEach((accordions) => {
    const accordionItems = accordions.querySelectorAll('.accordion--item')

    accordionItems.forEach((accordionItem) => {
      const accordionSummary = accordionItem.querySelector('.accordion--summary')
      accordionSummary.addEventListener('click', (event) => {
        const parent = accordionSummary.parentElement
        const summary = accordionSummary.nextElementSibling

        if (!parent.classList.contains('expand')) {
          parent.classList.add('expand')
          summary.style.maxHeight = `${100}px`
        } else {
          parent.classList.remove('expand')
          summary.style.maxHeight = '0px'
        }
      })
    })
  })
})()
