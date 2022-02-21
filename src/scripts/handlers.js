import { calculateVerticalProgress } from './utils'
import { handleEmblaScale } from './createEmblaCarousel'

const elementsInView = new Set()
const mediaQuery = window.matchMedia('(max-width: 1024px)')
const mediaQueryMobie = window.matchMedia('(max-width: 768px)')

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
          desiredEmbla.reInit({ loop: true, skipSnaps: false, startIndex: 3 })
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

export function onShowMoreClick() {
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

export function handleElementScroll() {
  elementsInView.forEach((root) => {
    const rect = root.getBoundingClientRect()
    const media = root.querySelector(`img:not(.scroll-fx)`)

    const progress = calculateVerticalProgress(rect)

    if (media !== null) {
      if (media.classList.contains('foreground-image')) {
        if (!mediaQuery.matches && rect?.y > 250) {
          media.style.transform = `translate(${-50 + progress * 110}%, -50%)`
        }
        if (mediaQuery.matches && rect?.y > 10) {
          media.style.transform = `translate(-50%, ${-5 - progress * 70}%)`
        }
        media.style.opacity = `${progress * 3}`
      } else {
        media.style.transform = `scale(${1 + progress * 0.3})`
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
