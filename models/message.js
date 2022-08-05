let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MessageSchema = new Schema({
    author : {type: Schema.Types.ObjectId, required: true, ref: 'User'}, 
    title : {type: String, required: true, maxLength: 60},
    message: {type: String, required: true },
    timestamp : {type: Date, required: true}
})

// Export model.
module.exports = mongoose.model('Message', MessageSchema);