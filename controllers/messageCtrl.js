const Conversations = require('../models/conversationModel')
const Messages = require('../models/messageModel')
const db = require('../config/db')




class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const messageCtrl = {
    createMessage: async (req, res) => {
        try {

            const { recipient, text, media, sending } = req.body
            if (!recipient || (!text.trim() && media.length === 0)) return;

            await db.query("SELECT * FROM conversations where (sender= '" + sending + "' AND recipient= '" + recipient + "') OR (sender= '" + recipient + "' AND recipient= '" + sending + "')", async (err, results) => {
                if (err) {
                    throw err
                }
                if (results.length !== 0) {
                    const conversation = results[0].id

                    await db.query("UPDATE conversations SET sender= '" + sending + "',recipient= '" + recipient + "',text='" + text + "',media='" + media + "' WHERE id='" + conversation + "'", async (err2, results2) => {
                        if (err2) {
                            throw err2
                        }

                    })

                }
                else {
                    await db.query("INSERT INTO conversations (sender,recipient,text,media) VALUES ('" + sending + "','" + recipient + "', '" + text + "','" + media + "')", async (err2, results2) => {
                        if (err2) {
                            throw err2
                        }

                    })
                }

                await db.query("SELECT id FROM conversations where sender= '" + sending + "' AND recipient= '" + recipient + "'", async (err3, results3) => {
                    if (err3) {
                        throw err3
                    }
                    if (results3) {
                        console.log(results3)
                        const conversation = results3[0].id
                        await db.query("INSERT INTO messages (sender,recipient,text,media,conversation) VALUES ('" + sending + "','" + recipient + "', '" + text + "','" + media + "', '" + conversation + "')", async (err4, results4) => {
                            if (err4) {
                                throw err4
                            }
                            else {
                                res.json({ msg: 'Create Success!' })

                            }

                        })
                    }
                })

            })

            // const newConversation = await Conversations.findOneAndUpdate({
            //     $or: [
            //         { recipients: [req.user.mongo_id, recipient] },
            //         { recipients: [recipient, req.user.mongo_id] }
            //     ]
            // }, {
            //     recipients: [req.user.mongo_id, recipient],
            //     text, media
            // }, { new: true, upsert: true })

            // const newMessage = new Messages({
            //     conversation: newConversation._id,
            //     sender: req.user.mongo_id,
            //     recipient, text, media
            // })

            // await newMessage.save()

            //res.json({ msg: 'Create Success!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getConversations: async (req, res) => {
        try {
            const sending = req.body
            await db.query("SELECT conversations.sender,conversations.recipient,conversations.text,conversations.media,user.avatar,user.username FROM conversations,user where (conversations.sender= '" + sending + "' OR conversations.recipient= '" + sending + "') AND (conversations.recipient=user.id OR conversations.sender=user.id) ORDER BY conversations.updated_at", async (err, results) => {
                if (err) {
                    throw err
                }
                if (results) {
                    res.json({
                        conversations: results,
                        result: results.length
                    })
                    console.log(results)
                }

            })

            // const features = new APIfeatures(Conversations.find({
            //     recipients: req.user.mongo_id
            // }), req.query).paginating()

            // const conversations = await features.query.sort('-updatedAt')
            //     .populate('recipients', 'avatar username')

            // res.json({
            //     conversations,
            //     result: conversations.length
            // })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getMessages: async (req, res) => {
        try {
            const { sending, recipient } = req.body
            await db.query("SELECT * FROM messages where (sender= '" + sending + "' AND recipient= '" + recipient + "') OR (sender= '" + recipient + "' AND recipient= '" + sending + "') ORDER BY created_at", async (err, results) => {
                if (err) {
                    throw err
                }
                if (results) {
                    res.json({
                        messages: results,
                        result: results.length
                    })


                }
            })
            // const features = new APIfeatures(Messages.find({
            //     $or: [
            //         { sender: req.user.mongo_id, recipient: req.params.id },
            //         { sender: req.params.id, recipient: req.user.mongo_id }
            //     ]
            // }), req.query)

            // const messages = await features.query.sort('-createdAt')

            // res.json({
            //     messages,
            //     result: messages.length
            // })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

}


module.exports = messageCtrl