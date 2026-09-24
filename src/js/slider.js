export class Slider {
    static CLASSES = {
        root: 'slider',
        track: 'slider__slides',
        slide: 'slider__slide',
        slideActive: 'slider__slide_active',
        dot: 'slider__pagination-item',
        dotActive: 'slider__pagination-item_active',
        prev: 'round-button_prev',
        next: 'round-button_next',
    }

    static DURATION = 500

    #track
    #dots
    #realSlides
    #slides
    #index = 1
    #isAnimating = false

    #touchStartX = 0
    #touchStartY = 0
    #isSwiping = false

    static SWIPE_THRESHOLD = 50 // px

    /**
     * @param {string} rootSelector
     */
    constructor(rootSelector) {
        const root = document.querySelector(rootSelector)
        this.#track = root.querySelector(`.${Slider.CLASSES.track}`)
        this.#dots = [...root.querySelectorAll(`.${Slider.CLASSES.dot}`)]
        this.#realSlides = [...root.querySelectorAll(`.${Slider.CLASSES.slide}`)]

        this.#setupClones()

        root.querySelector(`.${Slider.CLASSES.prev}`).addEventListener('click', () => this.prev())
        root.querySelector(`.${Slider.CLASSES.next}`).addEventListener('click', () => this.next())
        this.#dots.forEach((dot, i) => dot.addEventListener('click', () => this.goTo(i)))

        this.#track.addEventListener('transitionend', (e) => this.#onTransitionEnd(e))
        window.addEventListener('resize', () => this.#jump(this.#index))

        this.#jump(this.#index)
        this.#updateDots()

        this.#track.addEventListener('touchstart', (e) => this.#onTouchStart(e), { passive: true })
        this.#track.addEventListener('touchend', (e) => this.#onTouchEnd(e), { passive: true })
    }

    next() {
        this.#go(this.#index + 1)
    }

    prev() {
        this.#go(this.#index - 1)
    }

    goTo(realIndex) {
        this.#go(realIndex + 1) // +1 из-за клона в начале
    }

    #go(newIndex) {
        if (this.#isAnimating || newIndex === this.#index) return
        this.#isAnimating = true
        this.#index = newIndex
        this.#animate()
    }

    #setupClones() {
        const first = this.#clone(this.#realSlides[0])
        const last = this.#clone(this.#realSlides.at(-1))
        this.#track.prepend(last)
        this.#track.append(first)
        this.#slides = [...this.#track.children]
    }

    #clone(slide) {
        const clone = slide.cloneNode(true)
        clone.removeAttribute('id')
        clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'))
        clone.classList.remove(Slider.CLASSES.slideActive)
        return clone
    }

    #animate() {
        const offset = this.#getOffset()
        this.#track.style.transition = `transform ${Slider.DURATION}ms ease-in-out`
        this.#track.style.transform = `translateX(-${this.#index * offset}px)`
        this.#updateDots()
    }

    #jump(index) {
        const offset = this.#getOffset()
        this.#track.style.transition = 'none'
        this.#track.style.transform = `translateX(-${index * offset}px)`
    }

    #onTransitionEnd(e) {
        if (e.propertyName !== 'transform') return
        this.#isAnimating = false

        // дошли до клона первого — прыгаем на настоящий первый
        if (this.#index === this.#slides.length - 1) {
            this.#index = 1
            this.#jump(this.#index)
            this.#updateDots()
        }
        // дошли до клона последнего — прыгаем на настоящий последний
        else if (this.#index === 0) {
            this.#index = this.#slides.length - 2
            this.#jump(this.#index)
            this.#updateDots()
        }
    }

    #updateDots() {
        const realIndex = (this.#index - 1 + this.#realSlides.length) % this.#realSlides.length
        this.#dots.forEach((dot, i) =>
            dot.classList.toggle(Slider.CLASSES.dotActive, i === realIndex)
        )
    }

    #getOffset() {
        const gap = parseFloat(getComputedStyle(this.#track).gap) || 0
        return this.#slides[0].getBoundingClientRect().width + gap
    }

    #onTouchStart(e) {
        const touch = e.changedTouches[0]
        this.#touchStartX = touch.clientX
        this.#touchStartY = touch.clientY
        this.#isSwiping = true
    }

    #onTouchEnd(e) {
        if (!this.#isSwiping) return
        this.#isSwiping = false

        const touch = e.changedTouches[0]
        const dx = touch.clientX - this.#touchStartX
        const dy = touch.clientY - this.#touchStartY

        // игнорируем вертикальные жесты (скролл страницы)
        if (Math.abs(dx) < Math.abs(dy)) return

        if (Math.abs(dx) < Slider.SWIPE_THRESHOLD) return

        dx < 0 ? this.next() : this.prev()
    }
}