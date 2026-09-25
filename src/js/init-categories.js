let currentActiveCategory

/**
 * set active category, and make other categories inactive
 * @param {string} activeCategoryId
 */
function setStateForCategories(categoryId) {
    currentActiveCategory = categoryId
    document.querySelectorAll('.menu-filters__button').forEach(button => {
        button.classList.remove('menu-filters__button_active')
        if (button.id === currentActiveCategory) button.classList.add('menu-filters__button_active')
    })
}

/**
 * 
 * @param {function} renderFunction 
 */
function setEventListenersForCategories(renderFunction) {
    document.querySelectorAll('.menu-filters__button').forEach(button => {
        button.addEventListener('click', () => {
            setStateForCategories(button.id)
            renderFunction()
        })
    })
}

/**
 * get current active category
 * @returns string
 */
export function getCurrentActiveCategory() {
    return currentActiveCategory
}

/**
 * initCategories
 * @param {string} state
 * @param {function} renderFunction
 */
export function initCategories(categoryId, renderFunction) {
    setStateForCategories(categoryId)
    setEventListenersForCategories(renderFunction)
    renderFunction()
}