export class MobileMenu {
    static CLASSES = {
        menu: 'mobile-menu',
        menuActive: 'mobile-menu_active',
        list: 'mobile-menu__list',
        link: 'mobile-menu__link',
        burgerActive: 'burger_active',
        noScroll: 'page_no-scroll',
    }
    static DESKTOP_QUERY = '(min-width: 769px)'

    #menu
    #burgerButton
    #isOpen = false
    #mql
    #onEsc = (e) => {
        if (e.key === 'Escape' && this.#isOpen) this.close()
    }
    #onBreakpoint = (e) => {
        if (e.matches) this.close()
    }

    /**
     * @param {string} headerSelector
     * @param {string} linkSelector
     * @param {string} buttonSelector
     */
    constructor(headerSelector, linkSelector, buttonSelector) {
        const header = document.querySelector(headerSelector)
        const menuLinks = header.querySelectorAll(linkSelector)

        this.#burgerButton = document.querySelector(buttonSelector)
        this.#menu = this.#createMenu(menuLinks)
        header.append(this.#menu)

        this.#burgerButton.addEventListener('click', () => this.toggle())
        document.addEventListener('keydown', this.#onEsc)

        this.#mql = window.matchMedia(MobileMenu.DESKTOP_QUERY)
        this.#mql.addEventListener('change', this.#onBreakpoint)
    }

    get isOpen() {
        return this.#isOpen
    }

    toggle() {
        this.#isOpen ? this.close() : this.open()
    }

    open() {
        if (this.#isOpen) return
        this.#isOpen = true

        this.#menu.classList.add(MobileMenu.CLASSES.menuActive)
        this.#burgerButton.classList.add(MobileMenu.CLASSES.burgerActive)
        document.body.classList.add(MobileMenu.CLASSES.noScroll)
    }

    close() {
        if (!this.#isOpen) return
        this.#isOpen = false

        this.#menu.classList.remove(MobileMenu.CLASSES.menuActive)
        this.#burgerButton.classList.remove(MobileMenu.CLASSES.burgerActive)
        document.body.classList.remove(MobileMenu.CLASSES.noScroll)
    }

    destroy() {
        this.close()
        document.removeEventListener('keydown', this.#onEsc)
        this.#mql.removeEventListener('change', this.#onBreakpoint)
        this.#menu.remove()
    }

    #createMenu(menuLinks) {
        const nav = document.createElement('nav')
        nav.className = MobileMenu.CLASSES.menu

        const ul = document.createElement('ul')
        ul.className = MobileMenu.CLASSES.list

        menuLinks.forEach((link) => {
            const newLink = link.cloneNode(true)
            newLink.classList.add(MobileMenu.CLASSES.link)
            newLink.addEventListener('click', () => this.close())
            ul.append(newLink)
        })

        nav.append(ul)
        return nav
    }
}