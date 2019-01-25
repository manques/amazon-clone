const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User'},
    title: String,
    comment: { type: String },
    rating: { type: Number, default: 0},
    created: { type: Date, default: Date.now }
});



ReviewSchema.plugin(deepPopulate);
module.exports = mongoose.model('Review', ReviewSchema);