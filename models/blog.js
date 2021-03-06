var mongoose    = require("mongoose");

var blogSchema = new mongoose.Schema({
    title:  String,
    image:  String, //if you want a placeholder image when there is no image added: {type: String, default: "placeholderimage.jpg"}
    body:   String,
    created: {type: Date, default: Date.now}, //this says that created should be a DATE and the defeault should be the DATE.NOW.
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
            {   
                type: mongoose.Schema.Types.ObjectId, //this says that the comments property should be an array of comment IDs (a reference to comments)
                ref: "Comment"
            }
        ]
});

module.exports = mongoose.model("Blog", blogSchema);