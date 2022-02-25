import EmblaCarousel from 'embla-carousel'
import { setupDotBtns, generateDotBtns, selectDotBtn } from './dotButtons'
import { setupPrevNextBtns, disablePrevNextBtns } from './prevAndNextButtons'
import { querySelectorAllToArray, calculateScaleTransforms } from './utils'

const mediaQuery = window.matchMedia('(max-width: 768px)')

let tabCaroselConfig = {
  container: '.discount-products__items',
  viewport: '.discount-products__items-viewport',
  prevBtn: '.embla__button--prev',
  nextBtn: '.embla__button--next',
  options: {
    slidesToScroll: 1,
    // containScroll: 'trimSnaps',

    loop: true,
    skipSnaps: false,
    startIndex: 3,
  },
}

export const handleEmblaScale = (
  embla,
  itemSelector = '.discount-product__item',
  mediaSelector = '.discount-product-media .discount-block__image',
  contentSelector = '.discount-product__item-content',
) => {
  const slides = embla.slideNodes()
  const layers = slides.map((s) => s.querySelector(`${itemSelector} ${mediaSelector}`))
  const layersContent = slides.map((s) => s.querySelector(`${itemSelector} ${contentSelector}`))

  const applyScaleStyles = () => {
    const scaleTransforms = calculateScaleTransforms(embla)

    scaleTransforms.forEach((transform, index) => {
      layers[index].style.transform = `scale(${transform.progress})`
      layersContent[index].style.opacity = `${transform.opacity}`
    })
  }

  return applyScaleStyles
}

export const createEmblaCarousel = (emblaNode, emblaCarousel, scale = false) => {
  const viewPort = emblaNode.querySelector(emblaCarousel.viewport)
  const prevBtn = emblaNode.querySelector('.embla__button--prev')
  const nextBtn = emblaNode.querySelector('.embla__button--next')
  const dots = emblaNode.querySelector('.embla__dots')
  const embla = EmblaCarousel(viewPort, emblaCarousel.options)

  const disablePrevAndNextBtns = disablePrevNextBtns(prevBtn, nextBtn, embla)

  if (prevBtn !== null || nextBtn !== null) {
    setupPrevNextBtns(prevBtn, nextBtn, embla)
    embla.on('select', disablePrevAndNextBtns)
    embla.on('init', disablePrevAndNextBtns)
  }

  if (dots !== null) {
    const dotsArray = generateDotBtns(dots, embla)
    const setSelectedDotBtn = selectDotBtn(dotsArray, embla)

    setupDotBtns(dotsArray, embla)
    embla.on('select', setSelectedDotBtn)
    embla.on('init', setSelectedDotBtn)
  }

  if (scale && mediaQuery.matches) {
    const applyScaleStyles = handleEmblaScale(embla)
    embla.on('init', applyScaleStyles)
    embla.on('scroll', applyScaleStyles)
    embla.on('resize', applyScaleStyles)
  }

  return embla
}

export const createTabEmblaMap = (tabContentNodes) => {
  return tabContentNodes.reduce((map, tabContentNode) => {
    const carouselNode = tabContentNode.querySelector('.embla')
    if (!mediaQuery.matches) {
      tabCaroselConfig = {
        ...tabCaroselConfig,
        options: {
          slidesToScroll: 1,
          containScroll: 'trimSnaps',
          skipSnaps: false,
        },
      }
    }
    const embla = createEmblaCarousel(carouselNode, tabCaroselConfig, true)

    return { ...map, [tabContentNode.id]: embla }
  }, {})
}

// Sliders
const emblaCarousels = [
  {
    container: '.editorial__embla-slider',
    viewport: '.editorial__embla-viewport',
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
      align: 'start',
      containScroll: 'trimSnaps',
      slidesToScroll: 2,
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
]

export function carousels() {
  emblaCarousels.forEach((emblaCarousel) => {
    const emblaNodes = querySelectorAllToArray(emblaCarousel.container)

    if (emblaNodes.length > 0) {
      emblaNodes.forEach((emblaNode) => createEmblaCarousel(emblaNode, emblaCarousel))
    }
  })
}
