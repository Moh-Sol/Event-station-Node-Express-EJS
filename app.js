const express = require('express')
const app = express()
const port = 3000


//connected to db
const db = require('./config/databas')


const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport')
const passportSetup = require('./config/passport-setup')
// session and flash config



app.use(session({
  secret: 'cat cat',                    /* مفتاح المرور نختاره كما نريد */
  resave: false,           /* تستخدم بما يتعلق حفظ البيانات واسترجاعها من الستور المحزنة فيها عندما ينقطع الاتصال */
  saveUninitialized: true,    /* تستخدم بما يتعلق حفظ البيانات واسترجاعها من الستور المحزنة فيها عندما ينقطع الاتصال */
  cookie: { maxAge: 6000 * 15 }         /* هو المعرف فقط المحزن في البراوسير  */
}))

app.use(flash());


//bring passport

app.use(passport.initialize())
app.use(passport.session())


//store user object
app.get('*', (req, res, next) => {
  // console.log(req)
  // console.log(req.user)
  res.locals.user =req.user || null
next();
})

app.use(express.urlencoded());

//bring ejs templates
app.set('view engine', 'ejs')

//bring static folder
/* لكي يستطيع المشروع التعامل مع الملفات في 
المجلدات التاليةوربط ملفات الجافا والسي اس اس الموجودة بهم */
app.use(express.static('public'))
app.use(express.static('node_modules'))
app.use(express.static('uploads'))




app.get('/', (req, res) => res.redirect('/events'))


//bring eventes routes 
/* هنا يمكننا الولوج لجميع المسارات الداخلية ضمن الايفنتز */
const events = require('./routes/event-routes')
app.use('/events', events)


//bring user routes 
const users = require('./routes/user-routes')
app.use('/user', users)


app.listen(port, () => console.log(`Example app listening on port port!`))
