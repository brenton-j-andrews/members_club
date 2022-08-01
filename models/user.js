let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    user_name : {type: String, required: true, maxLength: 50},
    password : {type: String, required: true}
})

// Generate virtual URL property for user page.
UserSchema
.virtual('url')
.get(function() {
    return "/user/" + this._id;
});

// Export model.
module.exports = mongoose.model('User', UserSchema);