const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs')



const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar : { type: String, required: true}



}, { timestamps: true })

userSchema.methods.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

userSchema.methods.comparePasswords = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

/* ملاحظة . البارميتر الثالث لتحديد ما سيكون اسم الكوليكشن
أي اسم المجموعة في قاعدة البيانات
عدم ذكره سيؤدي لأن يقوم البرنامج تلقائيا
 بتأليف اسم يكون هو الجمع لمفردة الموديل */
let User = mongoose.model('User', userSchema, 'users')






module.exports = User

