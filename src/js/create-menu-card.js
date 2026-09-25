export function createMenuCard(product, hiddenOnTabletAndMobile = false) {
    const template = document.getElementById('menu-card-template')
    const card = template.content.firstElementChild.cloneNode(true)

    const img = card.querySelector('.menu-card__image img')
    img.src = `${product.image}`
    img.alt = product.name

    card.querySelector('.menu-card__title').textContent = product.name
    card.querySelector('.menu-card__description').textContent = product.description
    card.querySelector('.menu-card__price').textContent = `$${product.price}`

    if (hiddenOnTabletAndMobile) {
        card.classList.add('menu-card_extra')
    }

    card.addEventListener('click', () => {
        console.log('Клик по товару:', product)
    })

    return card
}