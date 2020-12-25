const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT || 3000

const handlebars = require('express-handlebars') // 引入 handlebars
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const helpers = require('./_helpers');
const app = express()
const axios = require('axios')
const cors = require('cors')



const db = require('./models') // 引入資料庫
const passport = require('./config/passport')

app.use(cors())

app.engine('hbs', handlebars({ defaultLayout: 'main', extname: '.hbs', helpers: require('./utils/hbsHelpers') })) // Handlebars 註冊樣板引擎
app.set('view engine', 'hbs') // 設定使用 Handlebars 做為樣板引擎
app.use(express.static('public'))
app.use('/upload', express.static(__dirname + '/upload'))

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// flash words in global
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})


require('./routes')(app)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
