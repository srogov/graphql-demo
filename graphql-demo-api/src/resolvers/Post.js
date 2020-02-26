const mongoose = require('mongoose');

const postedBy = async (parent, args, context) => {
    const db = context.db
    const result = await db.User.findById(parent.postedBy).exec()
    if (!result) {
        return null;
    }
    const {
        _id,
        name,
        photo
    } = result.toObject();
    return {
        id: _id.toHexString(),
        name,
        photo
    };
}

const products = async (parent, args, context) => {
    const db = context.db;
    let products = []
    if (parent.products) {
        const ids = parent.products.map(id => new mongoose.Types.ObjectId(id));
        const list = await db.Product.find().where('_id').in(ids).exec();
        products = list.map(i => {
            const {
                name,
                description,
                photo,
                price,
                _id
            } = i.toObject()
            return {
                id: _id.toHexString(),
                name,
                description,
                photo,
                price,
            }
        })
    }
    return products
}

module.exports = {
    postedBy,
    products
}