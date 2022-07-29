
const router = require('express').Router()
const userCtrl = require("../controllers/userCtrl")




router.get('/search', userCtrl.searchUser)

router.get('/get_members', userCtrl.getCommiteeMembers)

router.post('/member_add', userCtrl.addCommiteeMember)

router.patch('/member_edit', userCtrl.editCommiteeMember)

router.delete('/member_delete', userCtrl.deleteCommiteeMember)

router.get('/get', userCtrl.getCoordinates)


module.exports = router