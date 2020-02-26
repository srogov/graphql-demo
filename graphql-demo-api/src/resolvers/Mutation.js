const addUser = async (parent, args, context) => {
    const db = context.db;
    const user = new db.User(args)
    const r = await user.save();
    return {
        id: r._id
    };
}

const addPost = async (parent, args, context) => {
    const db = context.db;
    const post = new db.Post(args)
    const r = await post.save();
    return {
        id: r._id
    };
}

const addProduct = async (parent, args, context) => {
    const db = context.db;
    const product = new db.Product(args)
    const r = await product.save();
    return {
        id: r._id
    };
}

const addBookmark = async (parent, args, context) => {
    const db = context.db;
    const bookmark = new db.Bookmark(args)
    const r = await bookmark.save();
    return {
        id: r._id
    };
}

const deleteBookmark = async (parent, args, context) => {
    const db = context.db
    const r = await new Promise((resolve, reject) => {
        db.Bookmark.findByIdAndRemove(args.id).then(res => {
            if (res && res.id) {
                return resolve({
                    id: res.id
                })
            }
            return reject('not found')
        })
    })
    return r
}

const addLike = async (parent, args, context) => {
    const db = context.db;
    const like = new db.Like(args)
    const [likeRes, postRes] = await Promise.all([
        like.save(),
        db.Post.findOneAndUpdate({
            _id: args.post
        }, {
            $inc: {
                likes: 1
            }
        }, {
            new: true
        })
    ])
    return {
        id: likeRes._id
    };
}

const deleteLike = async (parent, args, context) => {
    const db = context.db
    const inc = {
        likes: -1
    }
    const likeRes = new Promise((resolve, reject) => {
        db.Like.findByIdAndRemove(args.id).then(like => {
            if (like && like.id) {
                db.Post.findOneAndUpdate({
                        _id: like.post
                    }, {
                        $inc: inc
                    }, {
                        new: true
                    })
                    .then(doc => {
                        console.log(doc)
                    })
                return resolve({
                    id: like.id
                })
            }
            return reject('not found')
        })
    })
    return likeRes
}

const addFollow = async (parent, args, context) => {
    const db = context.db;
    const follow = new db.Follow(args)
    const r = await follow.save();
    return {
        id: r._id
    };
}

const deleteFollow = async (parent, args, context) => {
    const db = context.db
    const r = await new Promise((resolve, reject) => {
        db.Follow.findByIdAndRemove(args.id).then(res => {
            if (res && res.id) {
                return resolve({
                    id: res.id
                })
            }
            return reject('not found')
        })
    })
    return r
}

module.exports = {
    addUser,
    addProduct,
    addPost,
    addBookmark,
    deleteBookmark,
    addLike,
    deleteLike,
    addFollow,
    deleteFollow
}