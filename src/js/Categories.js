export class Categories {
    static COFFEE = 'coffee-category'
    static TEA = 'tea-category'
    static DESSERT = 'dessert-category'

    static ALL = [Categories.COFFEE, Categories.TEA, Categories.DESSERT]

    #currentActiveCategory = Categories.COFFEE
    #renderFunction = () => {}

    /**
     *
     * @param {string} categoryId
     * @param {function} renderFunction
     */
    constructor(categoryId, renderFunction) {
        this.#setStateForCategories(categoryId)
        this.#setEventListenersForCategories(renderFunction)
        this.#renderFunction = renderFunction

        this.#renderFunction(this.getCurrentActiveCategory())
    }

    /**
     * set active category, and make other categories inactive
     * @param {string} categoryId
     */
    #setStateForCategories(categoryId) {
        this.#currentActiveCategory = categoryId
        document.querySelectorAll('.menu__content .menu-filters__button').forEach(button => {
            button.classList.remove('menu-filters__button_active')
            if (button.id === this.#currentActiveCategory) button.classList.add('menu-filters__button_active')
        })
    }

    #setEventListenersForCategories() {
        document.querySelectorAll('.menu__content .menu-filters__button').forEach(button => {
            button.addEventListener('click', () => {
                this.#setStateForCategories(button.id)
                this.#renderFunction(this.getCurrentActiveCategory())
            })
        })
    }

    /**
     * get current active category
     * @returns string
     */
    getCurrentActiveCategory() {
        return this.#currentActiveCategory
    }
}



