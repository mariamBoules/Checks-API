const express = require('express')
require('./mongoose')
const userRouter = require('./routers/users')
const checksRouter = require('./routers/checks')
const app = express()


//Parse incoming json to an object ->
app.use(express.json())
app.use(userRouter)
app.use(checksRouter)

module.exports = app