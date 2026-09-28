import 'modern-normalize'
import '../scss/main.scss'

import { Products } from './Products.js'
import { renderProducts } from './render-products.js'
import { Categories } from './Categories.js'
import { MobileMenu } from './MobileMenu.js'
import { Slider } from './Slider.js'

/* Обработчик для плавной прокрутки */
document.querySelectorAll('a[href*="#"]').forEach(a => {
    a.onclick = e => {
        const t = document.getElementById(a.hash.slice(1))
        if (!t) return
        e.preventDefault()

        const start = scrollY, end = t.offsetTop, duration = 1000
        const t0 = performance.now();

        (function step(now) {
            const p = Math.min((now - t0) / duration, 1)
            scrollTo(0, start + (end - start) * p * (2 - p))
            if (p < 1) requestAnimationFrame(step)
        })(t0)
    }
})

/* Переключение темы */
const toggle = document.getElementById('theme-toggle')

toggle.addEventListener('click', () => {
    const html = document.documentElement
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark'
    html.dataset.theme = next
    localStorage.setItem('theme', next)
})

const menu = new MobileMenu('#header', '.header__nav-link', '#burger')

const isMenuPage = !!document.getElementsByClassName('product-menu-page').length

if (isMenuPage) {

    async function init() {
        const products = await Products.create()

        if (!products.items.length) return

        const menuCardsContainer = document.querySelector('.menu-cards')

        const categories = new Categories(Categories.COFFEE, (categoryId) => {
            renderProducts(products.items, menuCardsContainer, categoryId)
        })


        menuCardsContainer.addEventListener('click', e => {
            const target = e.target.closest('.menu-card')
            if (!target) return

            products.showCard(target.dataset.id)

            // console.log(target)
            // if (target.classList.contains('menu-card')) {
            //     const cardId = target.dataset.id
            //     console.log('Клик по карточке:', cardId)
            //     if (!cardId) return
            //     console.log('данные карточки:', products.items[cardId - 1])
            //     // todo: показать карточку
            // }
        })
    }

    init()
} else {
    const slider = new Slider('.slider');
}


