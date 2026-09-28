const images = import.meta.glob('../images/cards/*.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default',
})

const productsJsonPath = `${import.meta.env.BASE_URL}products.json`;


export class Products {

    #items = [];

    constructor(items = []) {
        let index = 0
        const categories = {
            'coffee': 0,
            'tea': 0,
            'dessert': 0
        }
        this.#items = items.map(product => {
            categories[product.category] += 1
            index += 1
            const realImageUrl = this.#getImageUrl(`${product.category}-${categories[product.category]}.png`)
            return ({ ...product, image: `${realImageUrl}`, id: index })
        })
    }


    get items() {
        return this.#items
    }

    #getImageUrl(fileName) {
        const entry = Object.entries(images).find(([path]) => path.endsWith(`/${fileName}`))
        return entry?.[1] ?? ''
    }

    static async create() {
        try {
            const res = await fetch(productsJsonPath)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const products = await res.json()
            return new Products(products)
        } catch (err) {
            console.error('Не удалось загрузить products.json:', err)
            return []
        }
    }

    showCard(cardId) {
        if (!cardId) return
        const product = this.items[cardId - 1]

        const popup = document.querySelector('#popup')
        popup.classList.add('popup_active')
        popup.querySelector('.popup__image').src = product.image
        popup.querySelector('.popup__caption').textContent = product.name
        popup.querySelector('.popup__description').textContent = product.description
        const totalPrice = popup.querySelector('#totalPrice')
        const startPrice = Math.round(product.price * 100) / 100
        const startSizePrice = 0;
        const startAdditivesPrice = 0;
        let sizePrice = startSizePrice;
        let additivesPrice = startAdditivesPrice;
        let sum = startPrice + sizePrice + additivesPrice;
        totalPrice.textContent = `$${sum}`;


        const sizeOptions = popup.querySelector('#size-options')
        sizeOptions.innerHTML = '';
        sizeOptions.appendChild(this.#createParametersBlock('size', product.sizes ?? {}, true, (sum) => {
            sizePrice = startSizePrice + sum
            sum = startPrice + sizePrice + additivesPrice
            totalPrice.textContent = `$${sum}`
        }))

        const addOptions = popup.querySelector('#add-options')
        addOptions.innerHTML = '';
        addOptions.appendChild(this.#createParametersBlock('additives', product.additives ?? {}, false, (sum) => {
            additivesPrice = startAdditivesPrice + sum
            sum = startPrice + sizePrice + additivesPrice
            totalPrice.textContent = `$${sum}`
        }))

        popup.querySelector('.popup__close').addEventListener('click', this.close)
        popup.addEventListener('click', (e) => {
            if (e.target === popup) this.close()
        })
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close()
        })
    }

    close() {
        popup.classList.remove('popup_active')
    }


    #createParametersBlock(label, items, canBeOnlyOne = false, onSelect = null) {
        const popupOptions = document.createElement('div');
        popupOptions.className = 'popup__options';
        const labelEl = document.createElement('div');
        labelEl.className = 'popup__label'
        labelEl.textContent = label;

        const group = document.createElement('div')
        group.className = 'popup__options-group menu-filters'
        if(canBeOnlyOne){
            group.classList.add('popup__options-group_only-one')
        }

        Object.entries(items).forEach(([key, item], i) => {
            const button = document.createElement('button')
            button.className = 'menu-filters__button'
            if (canBeOnlyOne && i == 0) {
                button.classList.add('menu-filters__button_active')
            }
            const symbol = document.createElement('span')
            symbol.className = 'menu-filters__button-symbol'
            const realKey = label === 'additives' ? ++key : key
            symbol.textContent = realKey

            const caption = document.createElement('span')
            caption.className = 'menu-filters__button-caption'
            caption.textContent = item[label] || item.name || ''

            button.append(symbol, caption)
            button.dataset.addPrice = item['add-price']

            // Обработчик клика: переключение активного состояния
            button.addEventListener('click', () => {
                if (canBeOnlyOne) {
                    group
                        .querySelectorAll('.menu-filters__button')
                        .forEach(btn => btn.classList.remove('menu-filters__button_active'));
                    button.classList.add('menu-filters__button_active')
                } else {
                    button.classList.toggle('menu-filters__button_active')
                }

                if (typeof onSelect === 'function') {
                    const addSum = Array.from(group.querySelectorAll('.menu-filters__button_active'))
                        .reduce((acc, el) => acc + Number(el.dataset.addPrice), 0)
                    onSelect(addSum);
                }
            });

            group.appendChild(button);
        });

        popupOptions.append(labelEl, group);
        return popupOptions;

    }
}