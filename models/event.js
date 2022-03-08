const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    user_id: { type: String, required: true }

}, { timestamps: true })

/* ملاحظة . البارميتر الثالث لتحديد ما سيكون اسم الكوليكشن
أي اسم المجموعة في قاعدة البيانات
عدم ذكره سيؤدي لأن يقوم البرنامج تلقائيا
 بتأليف اسم يكون هو الجمع لمفردة الموديل */
let Event = mongoose.model('Evenet', eventSchema, 'events')

module.exports = Event