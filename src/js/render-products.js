import { createMenuCard } from './create-menu-card.js'

const onTabletAndMobileMaxCardsCount = 4


/**
 * 
 * @param {array} products 
 * @param {Element} container 
 * @param {string} categoryId 
 * @param {boolean} all - show all products
 */
export function renderProducts(products, container, categoryId, all = false) {
    const fragment = document.createDocumentFragment()

    console.log(products)

    let cardsCount = 0
    products.forEach(product => {
        if (`${product.category}-category` !== categoryId) return
        cardsCount += 1
        const hiddenOnTabletAndMobile = !all && cardsCount > onTabletAndMobileMaxCardsCount
        fragment.appendChild(createMenuCard(product, hiddenOnTabletAndMobile))
    })

    const moreButton = document.querySelector('.round-button_more')
    const canShowMore = cardsCount > onTabletAndMobileMaxCardsCount && !all
    moreButton.style.display = canShowMore ? 'block' : 'none'

    moreButton.addEventListener('click', () => {
        renderProducts(products, container, categoryId, true)
    })

    container.replaceChildren(fragment)
}