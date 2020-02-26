const db = require('./db');
const {getPosts} = require('./postList')

let userIds
let productIds

const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
}

const init = async () => {

    userIds = await new Promise((resolve) => {
        db.User.find({}, '', {
            lean: true
        })
        .select('_id')
        .then(r => resolve(r.map(i => i._id.toHexString())));
    });

    productIds = await new Promise((resolve) => {
        db.Product.find({}, '', {
            lean: true
        })
        .select('_id')
        .then(r => resolve(r.map(i => i._id.toHexString())));
    });

}

const getRandomUser = () => {
    const index = getRandom(0, userIds.length);
    return userIds[index];
}

const getRandomProducts = () => {
    const numberOfProducts = getRandom(0, productIds.length);
    const products = new Set();
    for (let step = 0; step < numberOfProducts; step++) {
        products.add(productIds[getRandom(0, productIds.length)]);
    }
    return Array.from(products)
}

init().then(() => {
    let user = getRandomUser();
    let products = getRandomProducts();

    const posts = getPosts();

    posts.forEach(element => {
        user = getRandomUser();
        products = getRandomProducts();
        const post = new db.Post({
            ...element,
            postedBy: user,
            products: products
        })
        post.save()
    });
}).catch(e => console.log(e))