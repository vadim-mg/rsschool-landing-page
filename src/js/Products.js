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
        console.log('Клик по карточке:', cardId)
        if (!cardId) return
        console.log('данные карточки:', this.items[cardId - 1])
        // todo: показать карточку
    }
}