const SCALE_FACTOR = 1

export const calculateScaleTransforms = (embla) => {
  const engine = embla.internalEngine()
  const scrollProgress = embla.scrollProgress()

  return embla.scrollSnapList().map((scrollSnap, index) => {
    if (!embla.slidesInView().includes(index)) return 0
    let diffToTarget = scrollSnap - scrollProgress

    if (engine.options.loop) {
      engine.slideLooper.loopPoints.forEach((loopItem) => {
        const target = loopItem.getTarget()

        if (index === loopItem.index && target !== 0) {
          const sign = Math.sign(target)
          if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress)
          if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress)
        }
      })
    }
    const scale = 1 - Math.abs(diffToTarget * SCALE_FACTOR)
    const opacity = 1 - Math.abs(diffToTarget * 5)

    return { progress: clamp(scale, 0, 1), opacity }
  })
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function mapRange(value, inMin, inMax, outMin, outMax, useClamp) {
  const value2 = useClamp ? clamp(value, inMin, inMax) : value
  return ((value2 - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

export function inRange(x, min, max) {
  return (x - min) * (x - max) <= 0
}

export function calculateVerticalProgress(bounds, topOffset = 0, bottomOffset = topOffset) {
  const vh = window.innerHeight
  const progress = (bounds.bottom - topOffset) / (vh + bounds.height - bottomOffset * 2)

  return 1 - clamp(progress, 0, 1)
}

export function isInViewport(elem, callback, options = {}) {
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => callback(entry))
  }, options).observe(document.querySelector(elem))
}

export const querySelectorAllToArray = (selector) => {
  if (!selector || typeof selector !== 'string') return null
  return [].slice.call(document.querySelectorAll(selector))
}
