const mongoose = require('mongoose')


emailValidator = function(val){
    return /^[\w+\-.]+@[a-z\d\-.]+\.[a-z]+$/i.test(val);
}

const channelSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId
    },
    owner: String,
    name: String,
    picture: String,
    members: [String],
    messages: [{
        id: String,
        content: String,
        image: String,
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