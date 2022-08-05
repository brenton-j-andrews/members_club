let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    username : {type: String, required: true, maxLength: 50},
    password : {type: String, required: true},
    isMember : {type: Boolean, required: true},
    isAdmin : {type: Boolean, required: true}
})

// Export model.
module.exports = mongoose.model('User', UserSchema);