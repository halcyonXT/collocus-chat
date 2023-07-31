const User = require('../models/User.js')
const Channel = require('../models/Channel.js')
const validator = require('validator')
const jwt = require('jsonwebtoken')

/**
 * 
 * @param {String} status 
 * @param {String} message 
 * @returns {Object}
 */
const statusRes = (status, message) => ({status: status, message: message})

const { 
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLList,
    GraphQLNonNull,
    GraphQLError} = require('graphql');

// User Type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        profilePicture: { type: GraphQLString },
        headline: { type: GraphQLString },
        channels: { type: GraphQLList(GraphQLString) }
    })
});

const ResponseType = new GraphQLObjectType({
    name: 'ResponseObject',
    fields: () => ({
        status: { type: GraphQLString },
        message: { type: GraphQLString }
    })
})

const ChannelType = new GraphQLObjectType({
    name: "Channel",
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        picture: { type: GraphQLString },
        members: { type: GraphQLList(GraphQLString) },
        messages: { type: GraphQLList(MessageType) },
        owner: { type: GraphQLString }
    })
})

const MessageType = new GraphQLObjectType({
    name: "Message",
    fields: () => ({
        sender: { 
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.id)
            }
        },
        timestamp: { type: GraphQLString },
        content: { type: GraphQLString }
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find();
            }
        },

        user: {
            type: UserType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return User.findById(args.id);
            }
        },

        getChannel: {
            type: ChannelType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Channel.findById(args.id)
            }
        },

        getUserChannels: {
            type: GraphQLList(ChannelType),
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return (async () => {
                    let {channels} = await User.findById(args.id)
                    return await Channel.find({ _id: { $in: channels } })
                })();
            }
        },

        client: {
            type: UserType,
            args: {},
            resolve(parent, args, context) {
                return User.findById(isValidToken(context.cookies.jwt))
            }
        }
    }
});

/**/

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addMessage: {
            type: ResponseType,
            args: {
                id: { type: GraphQLID },
                sender: { type: GraphQLID },
                timestamp: { type: GraphQLString },
                content: { type: GraphQLString },
                image: { type: GraphQLString }
            },
            resolve(parent, args) {
                return (async() => {
                    try {
                        let document = await Channel.findById(args.id)
                        document.messages.push({
                            id: args.sender,
                            content: args.content,
                            image: args.image,
                            timestamp: args.timestamp,
                            reactions: []
                        })
                        await document.save()
                        return statusRes("success", "Message posted")
                    } catch (err) {
                        return statusRes("error", err)
                    }
                    /**
                     * messages: [{
                        id: String,
                        content: String,
                        image: String,
                        timestamp: String,
                        reactions: [{
                            by: String,
                            icon: String
                        }]
                    }]
                     */
                })();
            }
        },

        addChannel: {
            type: ResponseType,
            args: {
                name: { type: GraphQLString },
                picture: { type: GraphQLString }
            },
            resolve(parent, args, context) {
                return (async () => {
                    try {
                        let creator = isValidToken(context.cookies.jwt);
                        if (!creator) {
                            return statusRes("error", "Unauthorized")
                        }
                        let channel = new Channel({
                            owner: creator,
                            name: args.name.trim(),
                            picture: args.picture.trim(),
                            members: [creator],
                            messages: []
                        })
                        await channel.save()
                        let user = await User.findById(creator)
                        user.channels.push(channel._id)
                        await user.save()
                        return statusRes("success", "Channel created successfully")
                    } catch (err) {
                        return statusRes("error", err)
                    }
                })();
            }
        },
        
        login: {
            type: ResponseType,
            args: {
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve (parent, args, context) {
                return (async () => {
                    if (validator.isEmpty(args.email)) {
                        return statusRes("error", "Email is required")
                    }
                    if (validator.isEmpty(args.password)) {
                        return statusRes("error", "Password is required")
                    }
                    /*if (isValidToken(context.cookies.jwt)) {
                        return statusRes("error", "User is already logged in")
                    }*/

                    let user = await User.findOne({ email: args.email })
                    if (!user) {
                        return statusRes("error", "Invalid credentials")
                    }

                    if (!user.authenticate(args.password)) {
                        return statusRes("error", "Invalid password")
                    }

                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                        expiresIn: "24h"
                    })

                    context.res.cookie("jwt", token, { expire: new Date() + 9999, httpOnly: true });

                    return statusRes("success", "Logged in successfully")
                })();
            }
        },

        logout: {
            type: ResponseType,
            args: {},
            resolve (parent, args, context) {
                try {
                    context.res.clearCookie("jwt")
                    return statusRes("success", "Logged out successfully")
                } catch (err) {
                    return statusRes("error", err)
                }
            }
        },
        register: {
            type: ResponseType,
            args: {
                username: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve (parent, args) {
                return (async () => {
                    if (validator.isEmpty(args.username.trim())) {
                        return statusRes("error", "Username is required")
                    }
                    if (!validator.isAlphanumeric(args.username.trim())) {
                        return statusRes("error", "Invalid characters found in username")
                    }
                    if (!validator.isLength(args.username.trim(), { min: 3, max: 20 })) {
                        return statusRes("error", "Username must be between 3 and 20 characters long")
                    }
                    if (!validator.isEmail(args.email.trim())) {
                        return statusRes("error", "Invalid email")
                    }
                    if (!validator.isLength(args.password.trim(), { min: 6, max: 50 })) {
                        return statusRes("error", "Password must be between 6 and 50 characters long")
                    }
                    const usernameExists = await User.findOne({
                        username: args.username.trim()
                    })
                    const emailExists = await User.findOne({
                        email: args.email.trim()
                    })
                    if (usernameExists) {
                        return statusRes("error", "Username is already taken")
                    }
                    if (emailExists) {
                        return statusRes("error", "Email is already taken")
                    }
                    try {
                        const user = new User({
                            username: args.username.trim(),
                            email: args.email.trim(),
                            password: args.password.trim(),
                            profilePicture: "https://i.ibb.co/CnsH1T7/default.png",
                            headline: "Brand new user"
                        })
                        await user.save()
                        return statusRes("success", "Registered successfully. Log in to proceed") 
                    } catch (err) {
                        return statusRes("error", err)
                    }
                })();
            }
        }
    }
})

const isValidToken = (token) => {

    if (!token) {
        return null
    }
    let payload;
    try {

        payload = jwt.verify(token, process.env.JWT_SECRET)

        return payload._id
    } catch (err) {

        return null
    }
}

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation,
})