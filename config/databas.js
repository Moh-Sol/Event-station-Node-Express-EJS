const mongoose = require('mongoose');

/* ملاحظة
عندما نستعمل مونغو اتلاس اون لاين فالفرق هنا هو -
وضع رابط القاعدة اون لاين بدلاً من الرابط الداخلي

اذا كانت قاعدة البيانات غير موجودة هنا فأنه سيتم انشاءها-

البارميتر الثاني هو بديل مماثل-
 لاستعمال البروميس وذااين بعد الفانكشن
*/
mongoose.connect('mongodb://localhost:27017/eventsDB', {useNewUrlParser: true, useUnifiedTopology: true},err=>{

if (err) console.log (err);
else console.log('connected to db succesfuly')

})

const User = require('../models/user')