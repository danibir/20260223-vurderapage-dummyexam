const express = require('express')
const morgan = require('morgan')

const db = require('./handlers/han-db')

const app = express()

const router_main = require('./routers/rou-main')
const router_user = require('./routers/rou-user')

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

db.connectToMongoDb("main")
.then(()=>{
    console.log('Database connection success.')
    app.listen(3000)
    app.use('/', router_main)
    app.use('/user', router_user)
})
.catch(()=>{
    console.log('Database connection failed.')
    app.listen(3000)
    app.use((req, res) => {
        res.render('dbfail')
    })
})