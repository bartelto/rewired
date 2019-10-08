var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ArticleSchema object
var ArticleSchema = new Schema({
  // `headline` is required and of type String
  headline: {
    type: String,
    required: true
  },
  // `category` is required and of type String
  category: {
    type: String,
    required: true
  },
  // `url` is required, of type String, and it must be unique; duplicates will be dropped.
  url: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  // `author` is required and of type String
  author: {
    type: String,
    required: true
  },
  // `image` is optional and of type String
  image: {
    type: String,
    required: false
  },
  // `favorite` is required and of type Boolean
  favorite: {
    type: Boolean,
    required: true,
    default: false
  },
  // `comment` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
