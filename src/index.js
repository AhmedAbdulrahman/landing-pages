import css from './styles.scss'
import { carousels, createTabEmblaMap } from './scripts/createEmblaCarousel'
import { querySelectorAllToArray } from './scripts/utils'
import {
  onAccordionClick,
  onTabClick,
  onShowMoreClick,
  onReadMoreClick,
  handleDocumentonScroll,
  onDropdownClick,
} from './scripts/handlers'

import ScrollProgress from './scripts/scrollProgress'
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

  new ScrollProgress({})
  carousels()

  const observerSelectors = [
    '.products-list__root  .products-list__main > .product-list__item:nth-child(-n+4)',
    '.product-category__root  .product-category__main > .product-category--item:nth-child(-n+4)',
    '.imagelist-root  .imagelist__main .imagelist__items-container > .imagelist-item:nth-child(-n+3)',
    '.benefit-list__root  .benefit-list__slider .benefit-list__slider.embla__viewport .benefit-list__main > .benefit-list__item',
    '.support__root .container .support__content > *',
    '.side-by-side__main .side-by-side__content > * , .side-by-side__main .side-by-side__media > *',
    '.editorial__main .editorial__media > *.editorial__image:not(.scroll-fx)',
    '.package__feature .package__feature-circle .circle-icon',
    '.hardware__main .hardware__media__item:nth-child(-n+1)',
    '.hardware__main .hardware__list-selector',
    '.hardware__payment-details > * > *',
    '.subscription-nav__main .button',
  ]

  const blockSelectors = [
    '.editorial__root',
    '.side-by-side__root',
    '.live-chat__root',
    '.brand-hero__root',
    '.subscription__root',
    '.article__root',
  ]

  const querySelector = querySelectorAllToArray(observerSelectors.join(', '))
  const CLASS_NAME = 'observed'

  // Blocks
  const blockElements = querySelectorAllToArray(blockSelectors.join(', '))

  const showMoreBtns = querySelectorAllToArray('.show-more-btn')
  const readMoreBtns = querySelectorAllToArray('.btn__read-more')

  // Tabs
  const tabItemNodes = querySelectorAllToArray('.package__features .tab-item')
  const tabContentNodes = querySelectorAllToArray('.package__features-content .tab-content')
  const productTabItemNodes = querySelectorAllToArray('.discount-products__tabs .tab-item')
  const productTabContentNodes = querySelectorAllToArray('.discount-products__slider .tab-content')
  const productTabEmblaMap = createTabEmblaMap(productTabContentNodes)

  // Accordion
  const accordionSummaryNodes = querySelectorAllToArray('.accordion--summary')

  // Dropdown
  const overviewDropdownMenus = querySelectorAllToArray(
    '.overview-dropdown__menu__container .overview-dropdown__menu',
  )

  const config = {
    rootMargin: '50px 20px 75px 30px',
    threshold: [0, 0.25, 0.75, 1],
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

  // Add Default intersection observer
  querySelector.forEach((i) => {
    defaultObserver.observe(i)
  })

  handleDocumentonScroll(blockElements, config)

  showMoreBtns.forEach((i) => {
    i.addEventListener('click', onShowMoreClick, false)
  })

  readMoreBtns.forEach((i) => {
    i.addEventListener('click', onReadMoreClick, false)
  })

  tabItemNodes.forEach((tabItemNode, _, tabItemNodes) => {
    onTabClick(tabItemNode, tabItemNodes, tabContentNodes)
  })

  productTabItemNodes.forEach((tabItemNode, _, productTabItemNodes) => {
    onTabClick(tabItemNode, productTabItemNodes, productTabContentNodes, true, productTabEmblaMap)
  })

  accordionSummaryNodes.forEach((accordionSummaryNode) => {
    onAccordionClick(accordionSummaryNode)
  })

  overviewDropdownMenus.forEach((overviewDropdownMenu) => {
    onDropdownClick(overviewDropdownMenu)
  })
})()
