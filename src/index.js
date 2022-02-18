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
  const editorialImage = '.editorial__main .editorial__media > *.editorial__image:not(.scroll-fx)'
  const subscriptionPackageIcons = '.package__feature .package__feature-circle .circle-icon'

  const hardwareImage = '.hardware__main .hardware__media__item:nth-child(-n+1)'
  const hardwareSelectors = '.hardware__main .hardware__list-selector'
  const hardwareproductText = '.hardware__payment-details > * > *'

  const querySelector = `${productList}, ${imagesList}, ${benefitList}, ${supportContent}, ${productCategory}, ${sideBySideContent}, ${editorialImage}, ${hardwareImage}, ${hardwareSelectors}, ${hardwareproductText}, ${subscriptionPackageIcons}`
  const CLASS_NAME = 'observed'

  const editorialElements = document.querySelectorAll('.editorial__root')
  const sideBySideElements = document.querySelectorAll('.side-by-side__root')
  const brandHeroElements = document.querySelectorAll('.brand-hero__root')
  const liveChatElements = document.querySelectorAll('.live-chat__root')
  const subscriptionElements = document.querySelectorAll('.subscription__root')

  const editorialElementsInView = new Set()
  const sideBySideElementsInView = new Set()
  const brandHeroElementsInView = new Set()
  const liveChatElementsInView = new Set()
  const subscriptionElementsInView = new Set()

  const mediaQuery = window.matchMedia('(max-width: 1024px)')
  const config = {
    rootMargin: '50px 20px 75px 30px',
    threshold: [0, 0.25, 0.75, 1],
  }
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
  function calculateVerticalPercentage(bounds, threshold = 0.7, root = window) {
    if (!root) return 0
    const vh = (root instanceof Element ? root.clientHeight : root.innerHeight) || 0
    const offset = threshold * bounds.height
    const percentage = (bounds.bottom - offset) / (vh + bounds.height - offset * 2)

    return 1 - Math.max(0, Math.min(1, percentage))
  }

  function handleEditorialScroll() {
    editorialElementsInView.forEach((root) => {
      const rect = root.getBoundingClientRect()
      const media = root.querySelector(`.editorial__image:not(.scroll-fx)`)
      const percentage = calculateVerticalPercentage(rect)

      if (media !== null) {
        media.style.transform = `scale(${1 + percentage * 0.2})`
      }
    })
  }

  function handleSideBySideScroll() {
    sideBySideElementsInView.forEach((root) => {
      const rect = root.getBoundingClientRect()
      const media = root.querySelector(`.side-by-side__image:not(.scroll-fx)`)
      const percentage = calculateVerticalPercentage(rect)

      if (media !== null) {
        if (media.classList.contains('foreground-image')) {
          if (!mediaQuery.matches && rect?.y > 250) {
            media.style.transform = `translate(${-50 + percentage * 90}%, -50%)`
          }

          if (mediaQuery.matches && rect?.y > 10) {
            media.style.transform = `translate(-50%, ${-5 - percentage * 70}%)`
          }
          media.style.opacity = `${percentage * 3}`
        } else {
          media.style.transform = `scale(${1 + percentage * 0.2})`
        }
      }
    })
  }

  function handleBrandHeroScroll() {
    brandHeroElementsInView.forEach((root) => {
      const rect = root.getBoundingClientRect()
      const media = root.querySelector(`.brand-hero__image:not(.scroll-fx)`)
      const percentage = calculateVerticalPercentage(rect)

      if (media !== null) {
        media.style.transform = `scale(${1 + percentage * 0.2})`
      }
    })
  }

  function liveChatHeroScroll() {
    liveChatElementsInView.forEach((root) => {
      const rect = root.getBoundingClientRect()
      const media = root.querySelector(`.live-chat__image:not(.scroll-fx)`)
      const percentage = calculateVerticalPercentage(rect)

      if (media !== null) {
        media.style.transform = `scale(${1 + percentage * 0.2})`
      }
    })
  }

  function handleSubscriptionScroll() {
    subscriptionElementsInView.forEach((root) => {
      const rect = root.getBoundingClientRect()
      const media = root.querySelector(`.subscription__image:not(.scroll-fx)`)
      const percentage = calculateVerticalPercentage(rect, 0.5, root)

      if (media !== null) {
        media.style.transform = `scale(${1 + percentage * 0.5})`
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
      document.addEventListener('scroll', handleEditorialScroll, { passive: true })
      handleEditorialScroll()
    } else {
      document.removeEventListener('scroll', handleEditorialScroll, { passive: true })
    }
  }

  function handleSideBySideIntersects(entries) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        sideBySideElementsInView.add(entry.target)
      } else {
        sideBySideElementsInView.delete(entry.target)
      }
    })

    if (sideBySideElementsInView.size > 0) {
      document.addEventListener('scroll', handleSideBySideScroll, { passive: true })
      handleSideBySideScroll()
    } else {
      document.removeEventListener('scroll', handleSideBySideScroll, { passive: true })
    }
  }

  function handleBrandHeroIntersects(entries) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        brandHeroElementsInView.add(entry.target)
      } else {
        brandHeroElementsInView.delete(entry.target)
      }
    })

    if (brandHeroElementsInView.size > 0) {
      console.log('brandHeroElementsInView')
      document.addEventListener('scroll', handleBrandHeroScroll, { passive: true })
      handleBrandHeroScroll()
    } else {
      document.removeEventListener('scroll', handleBrandHeroScroll, { passive: true })
    }
  }

  function handleLiveChatIntersects(entries) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        liveChatElementsInView.add(entry.target)
      } else {
        liveChatElementsInView.delete(entry.target)
      }
    })

    if (liveChatElementsInView.size > 0) {
      document.addEventListener('scroll', liveChatHeroScroll, { passive: true })
      liveChatHeroScroll()
    } else {
      document.removeEventListener('scroll', liveChatHeroScroll, { passive: true })
    }
  }

  function handleSubscriptionIntersects(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        subscriptionElementsInView.add(entry.target)
      } else {
        subscriptionElementsInView.delete(entry.target)
      }
    })

    if (subscriptionElementsInView.size > 0) {
      document.addEventListener('scroll', handleSubscriptionScroll, { passive: true })
      handleSubscriptionScroll()
    } else {
      document.removeEventListener('scroll', handleSubscriptionScroll, { passive: true })
    }
  }

  // Add Default intersection observer
  document.querySelectorAll(querySelector).forEach((i) => {
    defaultObserver.observe(i)
  })

  const editorialObserver = new IntersectionObserver(handleEditorialIntersects, config)
  const sideBySideObserver = new IntersectionObserver(handleSideBySideIntersects, config)
  const brandHeroObserver = new IntersectionObserver(handleBrandHeroIntersects, config)
  const liveChatObserver = new IntersectionObserver(handleLiveChatIntersects, config)
  const subscriptionObserver = new IntersectionObserver(handleSubscriptionIntersects, config)

  editorialElements.forEach((el) => {
    editorialObserver.observe(el)
  })

  sideBySideElements.forEach((el) => {
    sideBySideObserver.observe(el)
  })

  brandHeroElements.forEach((el) => {
    brandHeroObserver.observe(el)
  })

  liveChatElements.forEach((el) => {
    liveChatObserver.observe(el)
  })

  subscriptionElements.forEach((el) => {
    subscriptionObserver.observe(el)
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
