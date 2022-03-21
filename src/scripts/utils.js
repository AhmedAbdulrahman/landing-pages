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

    return { progress: clamp(scale, 0, 0.92), opacity }
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

export function calculateVerticalPercentage(bounds, threshold = 0, root = window) {
  if (!root) return 0
  const vh = (root instanceof Element ? root.clientHeight : root.innerHeight) || 0
  const offset = threshold * bounds.height
  const percentage = (bounds.bottom - offset) / (vh + bounds.height - offset * 3)

  return 1 - Math.max(0, Math.min(1, percentage))
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
