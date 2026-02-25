const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const db = require('./handlers/han-db')
const flash = require('./handlers/han-flash')

const mid_auth = require('./middleware/mid-auth')

const router_main = require('./routers/rou-main')
const router_user = require('./routers/rou-user')
const router_review = require('./routers/rou-review')


const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cookieParser())

db.connectToMongoDb("main")
.then(()=>{
    console.log('Database connection success.')
    
    app.use(mid_auth.authenticate)
    app.use(flash.loadFlash)

    app.use('/', router_main)
    app.use('/user', router_user)
    app.use('/review', router_review)

    app.listen(3000)
})
.catch(()=>{
    console.log('Database connection failed.')
    app.listen(3000)
    app.use((req, res) => {
        res.render('dbfail')
    })
})