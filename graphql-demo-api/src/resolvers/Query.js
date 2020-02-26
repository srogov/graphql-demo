const fixId = (post) => {
    if (!post.id) {
        post.id = post._id.toHexString()
    }
    if (post.postedBy) {
        post.postedBy.id = post.postedBy._id.toHexString()
    }
    if (post.products) {
        post.products.forEach(e => {
            e.id = e._id.toHexString()
        });
    }
}

const user = (parent, args, context) => {
    const db = context.db;
    const result = db.User.findById(args.id)
    return result
}

const post = async (parent, args, context) => {
    const db = context.db;
    const post = await new Promise(resolve => {
        db.Post.findById(args.id, '', {
            lean: true,
            leanWithId: true,
            populate: [{
                    path: 'postedBy',
                    options: {
                        lean: true,
                    }
                },
                {
                    path: 'products',
                    options: {
                        lean: true,
                    }
                }
            ]
        }).then(r => resolve(r))
    })
    fixId(post);
    return post
}

const product = (parent, args, context) => {
    const db = context.db;
    const result = db.Product.findById(args.id)
    return result
}

const feed = async (parent, args, context) => {
    const {
        visitorId,
        search,
        offset,
        limit,
        orderBy
    } = args

    const sort = {}

    switch (orderBy) {
        case 'createdAt_ASC':
            sort.createdAt = 1
            break
        case 'createdAt_DESC':
            sort.createdAt = -1
            break
        case 'postedBy_ASC':
            sort.postedBy = 1
            break
        case 'postedBy_DESC':
            sort.postedBy = -1
            break
        default:
            sort.createdAt = -1
    }

    const options = {
        pagination: true,
        lean: true,
        leanWithId: true,
        offset,
        limit,
        sort,
        populate: [{
                path: 'postedBy',
                options: {
                    lean: true,
                }
            },
            {
                path: 'products',
                options: {
                    lean: true,
                }
            }
        ]
    }

    const query = (search) ? {
        $text: {
            $search: search
        }
    } : {}

    const db = context.db
    // const result = await new Promise((resolve) => {
    //     db.Post.paginate(query, options).then((r) => resolve(r))
    // })

    const list = await new Promise(resolve => {
        db.Bookmark.find({
            visitor: visitorId
        }, null, {
            lean: true
        }).then(docs => {
            resolve(docs);
        })
    })

    const [feed, bookmarks, likes, follows] = await Promise.all([
        db.Post.paginate(query, options),
        (visitorId) ? db.Bookmark.find({
            visitor: visitorId
        }, null, {
            lean: true
        }) : [],
        (visitorId) ? db.Like.find({
            visitor: visitorId
        }, null, {
            lean: true
        }) : [],
        (visitorId) ? db.Follow.find({
            visitor: visitorId
        }, null, {
            lean: true
        }) : [],
    ])

    if (bookmarks) {
        bookmarks.forEach(b => fixId(b))
    }

    if (likes) {
        likes.forEach(l => fixId(l))
    }

    if (follows) {
        follows.forEach(l => fixId(l))
    }

    feed.docs.forEach(p => {
        fixId(p);
        if (bookmarks) {
            const bookmark = bookmarks.find(b => p.id === b.post);
            if (bookmark) {
                p.bookmarkId = bookmark.id;
            }
        }
        if (likes) {
            const like = likes.find(l => p.id === l.post);
            if (like) {
                p.likeId = like.id;
            }
        }
        if (follows) {
            const follow = follows.find(f => p.postedBy.id === f.user);
            if (follow) {
                p.followId = follow.id;
            }
        }
    })

    return feed
}

module.exports = {
    user,
    post,
    product,
    feed,
}