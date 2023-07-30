const mongoose = require('mongoose')


emailValidator = function(val){
    return /^[\w+\-.]+@[a-z\d\-.]+\.[a-z]+$/i.test(val);
}

const channelSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId
    },
    name: String,
    picture: String,
    members: [String],
    messages: [{
        sentBy: String,
        content: String,
        timestamp: String,
        reactions: [{
            by: String,
            icon: String
        }]
    }]
}, {
    timestamps: true
})
//vifielld

module.exports = mongoose.model('Channel', channelSchema)