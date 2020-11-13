const Post = require("../models/post");

exports.createPost = (req, res, next) => {

    let today = new Date();
    let date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    let time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    let dateTime = time + ' ' + date;

    const url = req.protocol + "://" + req.get("host");
    console.log("printing request-----------------------", req.body.status)
    const post = new Post({
        status: req.body.status,
        flightCode: req.body.flightCode,
        flightProvider: req.body.flightProvider,
        source: req.body.source,
        sourceCode: req.body.sourceCode,
        destination: req.body.destination,
        destinationCode: req.body.destinationCode,
        arrivalDate: req.body.arrivalDate,
        departureDate: req.body.departureDate,
        arrivalTime: req.body.arrivalTime
    });
    console.log("posting data first", post);
    post.save()
        .then(createdPost => {
            res.status(201).json({
                message: "Post added successfully",
                post: {
                    ...createdPost,
                    id: createdPost._id
                }
            });
        })
        .catch(error => {
            console.log(error);
            console.log("posting data in error", post);
            res.status(500).json({
                message: "Creating a post failed!"
            });
        });
};

exports.updatePost = (req, res, next) => {
    let today = new Date();
    let date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    let time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    let dateTime = time + ' ' + date;
    // console.log("hello");
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        status: req.body.status,
        flightCode: req.body.flightCode,
        flightProvider: req.body.flightProvider,
        source: req.body.source,
        sourceCode: req.body.sourceCode,
        destination: req.body.destination,
        destinationCode: req.body.destinationCode,
        arrivalDate: req.body.arrivalDate,
        departureDate: req.body.departureDate,
        arrivalTime: req.body.arrivalTime

    });
    console.log("user data", req.userData);
    Post.update({ _id: req.params.id, creator: req.userData.userId }, {
            $set: {
                status: req.body.status,
                flightCode: req.body.flightCode,
                flightProvider: req.body.flightProvider,
                source: req.body.source,
                sourceCode: req.body.sourceCode,
                destination: req.body.destination,
                destinationCode: req.body.destinationCode,
                arrivalDate: req.body.arrivalDate,
                departureDate: req.body.departureDate,
                arrivalTime: req.body.arrivalTime
            }
        })
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: "Update successful!" });
            } else {
                res.status(401).json({ message: "Not authorized!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Couldn't udpate post!"
            });
        });
};





exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    postQuery
        .then(documents => {
            fetchedPosts = documents;
            return Post.count();
        })
        .then(count => {
            res.status(200).json({
                message: "Posts fetched successfully!",
                posts: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching posts failed!"
            });
        });
};

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: "Post not found!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching post failed!"
            });
        });
};

exports.deletePost = (req, res, next) => {
    console.log("this is..... request", req.params.id);
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            if (result.n > 0) {
                res.status(200).json({ message: "Deletion successful!" });
            } else {
                res.status(401).json({ message: "Not authorized!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Deleting posts failed!"
            });
        });
};