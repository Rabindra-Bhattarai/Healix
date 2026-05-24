const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const app = express()
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.json())

app.use('/api/auth',         require('./routes/auth'))
app.use('/api/users',        require('./routes/users'))
app.use('/api/departments',  require('./routes/departments'))
app.use('/api/appointments', require('./routes/appointments'))
app.use('/api/queue',        require('./routes/queue'))
app.use('/api/vault',        require('./routes/vault'))
app.use('/api/messages',     require('./routes/messages'))
app.use('/api/triage',       require('./routes/triage'))

module.exports = app