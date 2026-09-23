import { createMenuCard } from './create-menu-card.js'


/**
 * 
 * @param {array} products 
 * @param {Element} container 
 * @param {string} categoryId 
 */
export function renderProducts(products, container, categoryId) {
    const fragment = document.createDocumentFragment()

    products.forEach(product => {
        if (`${product.category}-category` !== categoryId) return
        fragment.appendChild(createMenuCard(product))
    })

    container.replaceChildren(fragment)
}