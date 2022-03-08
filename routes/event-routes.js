const express = require('express')
const { event } = require('jquery')
const Event = require('../models/event')
var moment = require('moment'); // require
moment().format();

const { body, validationResult } = require('express-validator')

const router = express.Router()
// نقوم بانشاء الراوتر وهو وظيفة داخلية للاكسبرس لتسهيل عملية الراوتر للمسارات الداخلية


isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/user/login')
}







// create event 

router.get('/create', isAuthenticated, (req, res) => {
    res.render('event/create', { errors: req.flash('errors') })
})




router.get('/:pageNo?', (req, res) => {

    let pageNo = 1;
    if (req.params.pageNo == 0) {
        pageNo = 1
    }
    if (req.params.pageNo){
        pageNo = parseInt(req.params.pageNo)
    }

    let q = {
        skip: 5 * (pageNo - 1),
        limit: 5
    }

    let totalDoc = 0;
    // find total doc



    Event.countDocuments({}, (err, total) => {})
    .then(response => {

        totalDoc = parseInt(response);
        Event.find({}, {},  q , (err, events) => {
            console.log(events.length)
            let chunk = []
            let chunkSize = 3

            for (let i = 0; i < events.length; i += chunkSize) {
                chunk.push(events.slice(i, chunkSize + i))
            }
            res.render('event/index', {
                chunk: chunk,
                message: req.flash('info'),
                total: parseInt(totalDoc),
                pageNo: pageNo
                // هنا بالاعلى يمكننا استدعاءه محتوى فلاش معين من خلال كييز قمنا بحفظه في طلب اخر 

            })
        })
    })





//     Event.find({}, (err, events) => {
//         // res.json(events) /* تجربة ارسالها كجسون */
//         let chunk = []
//         let chunkSize = 3
//         /*  الطريقة التالية تمكننا من قسم مصفوفة فيها عناصر كثيرة
// لمصفوفات اصغر كل مصفوفة فيها تحتوي فقط على ثلاثة عناصر
// هذا يفيدنا في التصميم كذلك 
// */

//         for (let i = 0; i < events.length; i += chunkSize) {
//             chunk.push(events.slice(i, chunkSize + i))
//         }
//         // res.json(chunk) /* للتجربة بعد التقسيم */

//         // الثلاث اسطر التالية تؤدي نفس الغرض
//         // res.render('event')/* يقوم تلقائيا بالدخول لمجلد اندكس ان وجد */
//         // res.render('../views/event/index.ejs')
//         /* يقوم تلقائيا بايجاد المسار هنا */
//         res.render('event/index', {
//             chunk: chunk,
//             message: req.flash('info')
//             // هنا بالاعلى يمكننا استدعاءه محتوى فلاش معين من خلال كييز قمنا بحفظه في طلب اخر 

//         })
//     })


})






// Show single event 

router.get('/show/:id', (req, res) => {
    let id = req.params.id;
    // console.log(id)
    Event.findOne({ _id: id }, (err, event) => {
        if (err) console.log(err);
        // console.log('get event', event);
        res.render('event/show', { event: event })

    })
})

// edit router 

router.get('/edit/:id', isAuthenticated, (req, res) => {
    let id = req.params.id;
    Event.findOne({ _id: id }, (err, event) => {
        if (err) console.log(err);
        res.render('event/edit', {
            event: event,
            eventDate: moment(event.date).format('YYYY-MM-DD'),
            errors: req.flash('errors'),
            message: req.flash('info'),
            // moment  
            // استعملت هنا لكي نحول التاريخ من الصيغة المحفوظة بقاعدة البيانات كصيغة تاريخ هكذا 
            // date: 2021-04-16T00:00:00.000Z,
            // إلى صيغة تاريخ بنفس الصيغة التي ارسلناها بها من البداية 
            // أي فقط اليوم والشهر والسنة 
            // يلاحظ ان التاريخ حفظ بالصيغة المعقدة في قاعدة البيانات 
            // بسبب اختيارنا لنوع تاريخ للبيانات في هيكلة شكل قاعدة البيانات التي انشأناها
        })

    })


})





/* في الفانكشن في الاسفل نقوم بالتحقق من الادخالات التي لدينا ضمن الوسيط

وفي حال وجد خطأ فيها نحول الاخطاء مع مساعدة اضافة flash
لكي نرسلها مجددا عند طلب صفحة تسجيل الدخول 

*/
router.post('/create', [
    body('title').isLength({ min: 5 }).withMessage('Title should be more than 4 char'),
    body('description').isLength({ min: 5 }).withMessage('description should be more than 4 char'),
    body('location').isLength({ min: 3 }).withMessage('location should be more than 2 char'),
    body('date').isLength({ min: 4 }).withMessage('date should be more than 3 char')
],
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {

            req.flash('errors', errors.array())
            /* هنا في الأسفل في حال كنا نريد ارجاع الخطأ كجسون  يحتوي قائمة بالاخطاء*/
            // return res.status(400).json({ errors: errors.array() });
            // res.render('event/create', { errors: errors.array() });

            res.redirect('/events/create')

        } else {

            // res.json('ok')/* في حال اردنا التحقق مع تهميش الكود في الاسفل */

            // console.log('this created ', req.body)
            let newEvent = new Event({
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
                location: req.body.location,
                user_id: req.user.id
            })
            newEvent.save((err) => {
                if (!err) {
                    console.log('event was added');
                    // في التعليمة التالية
                    // يكون الانفو اي البارميتر الاول هو عبارة عن الكييز 
                    // الذي سنستدعي محتواه عندما نريده في طلب اخر
                    req.flash('info', 'The event was created successfuly')

                    res.redirect('/events')
                } else console.log(err)

            })



        }



    })

router.post('/update', [
    body('title').isLength({ min: 5 }).withMessage('Title should be more than 4 char'),
    body('description').isLength({ min: 5 }).withMessage('description should be more than 4 char'),
    body('location').isLength({ min: 3 }).withMessage('location should be more than 2 char'),
    body('date').isLength({ min: 4 }).withMessage('date should be more than 3 char')
], isAuthenticated,
    (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {

            req.flash('errors', errors.array())

            res.redirect('/events/edit/' + req.body.id)

        } else {

            let newFelilds = {
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
                location: req.body.location
            }
            let query = { _id: req.body.id }

            Event.updateOne(query, newFelilds, (err) => {
                if (!err) {
                    req.flash('info', 'The event was updated successfuly')
                    res.redirect('/events/edit/' + req.body.id)

                } else console.log(err)
            })


        }


    })


router.delete('/delete/:id', isAuthenticated, (req, res) => {

    let query = { _id: req.params.id }
    Event.deleteOne(query, (err) => {
        if (!err) {
            res.status(200).json('deleted')
        } else {
            res.status(404).json('there was an error')
        }

    })


})





module.exports = router
