const express = require('express')
const morgan = require('morgan')

const app = express()

const router_main = require('./routers/rou-main')

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))


app.listen(3000)
app.use('/', router_main)