let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MessageSchema = new Schema({
    author : {type: Schema.Types.ObjectId, required: true, ref: 'User'}, 
    title : {type: String, required: true, maxLength: 30},
    message: {type: String, required: true, maxLength: 120},
    timestamp : {type: Date, required: true}
})

// Generate virtual URL property for user page.
MessageSchema
.virtual('url')
.get(function() {
    return "/user/" + this._id;
});

// Export model.
module.exports = mongoose.model('Message', MessageSchema);