export class MobileMenu {
    constructor(headerSelector, linkSelector) {
        const header = document.querySelector(headerSelector)
        const menuLinks = header.querySelectorAll(linkSelector)

        const nav = document.createElement('nav')
        nav.className = 'mobile-menu'

        const ul = document.createElement('ul')
        ul.className = 'mobile-menu__list'

        menuLinks.forEach(link => {
            const newLink = link.cloneNode(true)
            newLink.addEventListener('click', () => this.toggle())
            newLink.classList.add('mobile-menu__link')
            ul.append(newLink)
        })

        nav.append(ul)
        this.menu = nav

        header.append(this.menu)
    }

    toggle() {
        this.menu.classList.toggle('mobile-menu_active')
        document.body.classList.toggle('page_no-scroll')
    }
}