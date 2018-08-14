var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username:       String,
    password:       String,
    description:    String,
    email:          String,
    image:          String,
    created:        {type: Date, default: Date.now},
    friends:    [
                    {   
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                    }
                ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);