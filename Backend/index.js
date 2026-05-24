require('dotenv').config()
const http = require('http')
const connectDB = require('./src/config/db')
const app = require('./src/app')
const { setupWebSocket } = require('./src/websocket')

const server = http.createServer(app)
setupWebSocket(server)

connectDB().then(() => {
  server.listen(process.env.PORT || 5000, () =>
    console.log(`API running on port ${process.env.PORT || 5000}`)
  )
})