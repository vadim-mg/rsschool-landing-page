import { createMenuCard } from './create-menu-card.js'


export function renderProducts(products, container) {
    const fragment = document.createDocumentFragment()

    products.forEach(product => {
        fragment.appendChild(createMenuCard(product))
    })

    container.replaceChildren(fragment)
}