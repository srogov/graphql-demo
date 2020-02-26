const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const config = require('./config')

mongoose.connect(config.mongodb.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new Schema({
    name: String,
    photo: String,
})

const productSchema = new Schema({
    name: String,
    description: String,
    photo: String,
    price: Number
})

const postSchema = new Schema({
    postedBy: {
        type: String,
        ref: 'users'
    },
    photo: String,
    text: String,
    createdAt: Date,
    products: [{
        type: String,
        ref: 'products'
    }],
    tags: {
        type: String,
        text: true
    },
    likes: {
        type: Number,
        default: 0
    }
})
postSchema.index({
    tags: 'text',
});
postSchema.pre('save', function (next) {
    this.createdAt = new Date();
    next();
});
postSchema.plugin(mongoosePaginate);

const bookmarkSchema = new Schema({
    visitor: String,
    post: String,
})

const likeSchema = new Schema({
    visitor: String,
    post: String,
})

const followSchema = new Schema({
    visitor: String,
    user: String,
})

// connect
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Connected to MongoDB");
});

module.exports = {
    User: mongoose.model('users', userSchema),
    Post: mongoose.model('posts', postSchema),
    Product: mongoose.model('products', productSchema),
    Bookmark: mongoose.model('bookmarks', bookmarkSchema),
    Like: mongoose.model('likes', likeSchema),
    Follow: mongoose.model('follows', followSchema)
}