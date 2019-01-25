const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const algolia = require('mongoose-algolia'); 

const Category = require('../models/category');
const User = require('../models/user');
const Review = require('../models/review');

const ProductSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review'}],
    title: { type: String, unique: true },
    price: Number,
    image: String,
    description: String,
    created: { type: Date, default: Date.now }
},
{
    toObject: { virtuals : true },
    toJSON: { virtuals: true }
});

ProductSchema.virtual('averageRating').get( function(){
    let rating = 0;
    if(this.reviews.length == 0){
        return rating;
    }else{
        this.reviews.map( review =>{
            rating += review.rating;
        });
        rating = rating / this.reviews.length;
        return rating;
    }
});

ProductSchema.plugin(algolia, {
    appId: 'VIRINU4PT8',
    apiKey: 'a7d9ea59c84d1fed6c1066571d78f4ce',
    indexName: 'jnv',
    selector: '_id title image description price owner category reviews created',
    populate: {
        path: 'owner reviews category',
        select: 'name rating name'
    },
    defaults: {
        author: 'unknown'
    },
    mappings: {
        title: function(value) {
          return `${value}`
        }
    },
    virtuals: {
        averageRating : function(doc){
            let rating = 0;
            if(doc.reviews.length == 0){
                rating = 0;
            }else{
                doc.reviews.map( review =>{
                    rating += review.rating;
                });
                rating = rating / doc.review.length
            }
            return rating;
        }
    },
    debug: true
});
//mongoose algolia
ProductSchema.plugin(deepPopulate);

let Model = mongoose.model('Product', ProductSchema);

Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
    searchableAttributes: ['title']
});

module.exports = Model;