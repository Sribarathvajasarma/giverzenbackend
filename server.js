require('dotenv').config()
const express = require('express')



const cors = require('cors')
const cookieParser = require('cookie-parser')
const SocketServer = require('./SocketServer')


const app = express()


app.use(express.json())
app.use(cors())
app.use(cookieParser())

const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', socket => {
    SocketServer(socket)
})


app.use('/api', require('./routes/authRouter'))
app.use('/api', require('./routes/userRouter'))
app.use('/api', require('./routes/messageRouter'))
app.use('/api', require('./routes/listingRouter'))
app.use('/api', require('./routes/nonsmartphoneuserRouter'))


const port = process.env.PORT || 5000
http.listen(port, () => {
    console.log('Server is running on port', port)
})