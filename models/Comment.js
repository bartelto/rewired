var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new CommentSchema object
var CommentSchema = new Schema({
  // `body` is of type String
  body: {
    type: String,
    required: true
  },
  // `date` is of type Date
  date: {
    type: String,
    required: true,
    default: Date.now
  },
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Note model
module.exports = Comment;
