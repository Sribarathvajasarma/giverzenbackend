const router = require('express').Router()
const postCtrl = require('../controllers/postCtrl')

// post forum part
router.route('/posts')
    .post( postCtrl.createPost)
    .get( postCtrl.getPosts)

router.route('/post/:id')
       .get(postCtrl.getPost)
       .delete(postCtrl.deletePost)
       .patch(postCtrl.updatePost)



module.exports = router