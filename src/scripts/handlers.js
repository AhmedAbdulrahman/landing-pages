import { calculateVerticalPercentage } from './utils'
import { handleEmblaScale } from './createEmblaCarousel'

const elementsInView = new Set()
const mediaQueryMobie = window.matchMedia('(max-width: 768px)')
const mediaQueryTabletDown = window.matchMedia('(max-width: 767px)')
const mediaQueryMobieSE = window.matchMedia('(max-width: 390px)')
const largeDesktop = window.matchMedia('(min-width: 1440px)')

export function onTabClick(
  tabItemNode,
  tabItemNodes,
  tabContentNodes,
  embla = false,
  productTabEmblaMap,
) {
  tabItemNode.addEventListener(
    'click',
    (event) => {
      const id = tabItemNode.getAttribute('data-content-id')
      const desiredTabItem = event.currentTarget
      const desiredTabContent = tabContentNodes.find((n) => n.id === id)

      tabContentNodes.filter((n) => n.id !== id).forEach((n) => n.classList.remove('show'))

      tabItemNodes
        .filter((n) => n.getAttribute('data-content-id') !== id)
        .forEach((n) => n.classList.remove('active'))

      desiredTabItem.classList.add('active')
      desiredTabContent.classList.add('show')

      if (embla) {
        const desiredEmbla = productTabEmblaMap[id]
        if (mediaQueryMobie.matches) {
          const applyScaleStyles = handleEmblaScale(desiredEmbla)

          desiredEmbla.on('init', applyScaleStyles)
          desiredEmbla.on('reInit', applyScaleStyles)
          desiredEmbla.reInit({ loop: true, skipSnaps: false, startIndex: 3 })
        } else {
          desiredEmbla.reInit({ slidesToScroll: 1, containScroll: 'trimSnaps', skipSnaps: false })
        }
      }
    },
    false,
  )
}

export function onAccordionClick(accordionSummaryNode) {
  accordionSummaryNode.addEventListener(
    'click',
    (event) => {
      const desiredSumary = event.currentTarget
      const desiredSumaryParent = desiredSumary.parentElement

      if (!desiredSumaryParent.classList.contains('expand')) {
        desiredSumaryParent.classList.add('expand')
      } else {
        desiredSumaryParent.classList.remove('expand')
      }
    },
    false,
  )
}

export function onShowMoreClick(event) {
  const button = event.target
  const btnLabel = button.querySelector('.btn-label')
  const dataTargetLess = button.getAttribute('data-less')
  const dataTargetMore = button.getAttribute('data-more')
  const backgroundFade = document.querySelector('.product-list__show-more')
  const productListContent = document.querySelector('.products-list__main')

  if (!button.classList.contains('btn-show-more-expand')) {
    button.classList.add('btn-show-more-expand')
    btnLabel.innerHTML = dataTargetLess
    productListContent.classList.add('showContent')
    backgroundFade.classList.add('remove-fade')
  } else {
    button.classList.remove('btn-show-more-expand')
    btnLabel.innerHTML = dataTargetMore
    backgroundFade.classList.remove('remove-fade')
    productListContent.classList.remove('showContent')
  }
}

export function onReadMoreClick() {
  const linkText = this.children[0].innerHTML.toUpperCase()
  const content = this.parentNode.querySelector('.editorial__text')

  if (linkText === 'READ MORE') {
    this.children[0].innerHTML = 'Read less'
    this.children[0].classList.remove('show-read-more')
    this.children[0].classList.add('show-read-less')
    content.classList.remove('show-less-content')
    content.classList.add('show-more-content')
  } else {
    this.children[0].innerHTML = 'Read more'
    this.children[0].classList.remove('show-read-less')
    this.children[0].classList.add('show-read-more')
    content.classList.remove('show-more-content')
    content.classList.add('show-less-content')
  }
}

export function onDropdownClick(dropdown) {
  dropdown.addEventListener(
    'click',
    (event) => {
      const desiredDropDownItem = event.currentTarget
      const desiredDropdownParent = dropdown.parentElement
      const childElements = desiredDropdownParent.querySelectorAll('.overview-dropdown__menu__item')
      const dropDownTextBox = dropdown.querySelector('.overview-dropdown__menu__textbox')

      desiredDropDownItem.classList.toggle('active')

      childElements.forEach((childElement) => {
        childElement.addEventListener('click', (event) => {
          desiredDropDownItem.classList.remove('active')
          dropDownTextBox.value = event.currentTarget.textContent
        })
      })
    },
    false,
  )
}

export function handleElementScroll() {
  elementsInView.forEach((root) => {
    const rect = root.getBoundingClientRect()
    const media = root.querySelector(`img:not(.scroll-fx)`)

    const progress = calculateVerticalPercentage(rect, 0, window)
    const currentScrollPosition = window.pageYOffset
    const elementOffsetTop = root.offsetTop

    if (media !== null) {
      if (root.classList.contains('footer__newsletter--loader')) {
        if (mediaQueryMobieSE.matches && rect.y >= root.parentElement.offsetTop) {
          media.style.transform = `translate(-10%, ${15 - progress * 80}%)`
        }
        if (mediaQueryTabletDown.matches && root.parentElement.offsetTop <= rect.y) {
          media.style.transform = `translate(-10%, ${20 - progress * 65}%)`
        }
      } else if (
        media.classList.contains('foreground-image') &&
        !media.classList.contains('article__media')
      ) {
        // largeDesktop
        if (largeDesktop.matches && currentScrollPosition < elementOffsetTop) {
          media.style.transform = `translate(${-50 + progress * 65}%, -50%)`
        } else if (!mediaQueryMobie.matches && currentScrollPosition < elementOffsetTop) {
          media.style.transform = `translate(${-50 + progress * 32}%, -50%)`
        } else if (!mediaQueryMobie.matches && currentScrollPosition < elementOffsetTop + -400) {
          // iPad & Desktop
          media.style.transform = `translate(${-50 + progress * 100}%, -50%)`
        } else if (mediaQueryMobie.matches && currentScrollPosition < elementOffsetTop + -100) {
          media.style.transform = `translate(-50%, ${-5 - progress * 70}%)`
        }
        media.style.opacity = `${progress * 3}`
      } else if (
        media.classList.contains('foreground-image') &&
        media.classList.contains('article__media')
      ) {
        if (mediaQueryMobie.matches && currentScrollPosition < elementOffsetTop + -150) {
          media.style.opacity = `${progress * 3}`
          media.style.transform = `translateY(${50 - progress * 130}%)`
        }
      } else {
        media.style.transform = `scale(${1 + progress * 0.2})`
      }
    }
  })
}

export function handleDocumentonScroll(elements, { threshold, root = null, rootMargin = '0px' }) {
  const options = {
    root,
    rootMargin,
    threshold,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        elementsInView.add(entry.target)
      } else {
        elementsInView.delete(entry.target)
      }
    })

    if (elementsInView.size > 0) {
      document.addEventListener('scroll', handleElementScroll, { passive: true })
      handleElementScroll()
    } else {
      document.removeEventListener('scroll', handleElementScroll, { passive: true })
    }
  }, options)

  elements.forEach((el) => {
    observer.observe(el)
  })
}
