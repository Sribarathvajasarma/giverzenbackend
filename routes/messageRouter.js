const router = require('express').Router()
const messageCtrl = require('../controllers/messageCtrl')
const auth = require('../middleware/auth')

router.post('/add_message', messageCtrl.createMessage)

router.post('/conversations', messageCtrl.getConversations)

router.post('/message', messageCtrl.getMessages)

router.delete('/delete_conversation', messageCtrl.deleteConversation)

module.exports = router