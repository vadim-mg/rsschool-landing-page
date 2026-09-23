const images = import.meta.glob('../images/cards/*.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default',
});

function getImageUrl(fileName) {
    const entry = Object.entries(images).find(([path]) => path.endsWith(`/${fileName}`));
    return entry?.[1] ?? '';
}

export async function loadProducts() {
    try {
        const res = await fetch(`${import.meta.env.BASE_URL}products.json`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const products = await res.json()
        let index = 0
        const categories = {
            'coffee': 0,
            'tea': 0,
            'dessert': 0
        }
        return products.map(product => {
            categories[product.category] += 1;
            index += 1
            const realImageUrl = getImageUrl(`${product.category}-${categories[product.category]}.png`)
            return ({ ...product, image: `${realImageUrl}`, id: index })
        })
    } catch (err) {
        console.error('Не удалось загрузить products.json:', err)
        return []
    }
}