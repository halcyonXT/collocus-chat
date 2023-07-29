const User = require('../models/User.js')
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
        password: { type: GraphQLString }
    })
});

const ResponseType = new GraphQLObjectType({
    name: 'ResponseObject',
    fields: () => ({
        status: { type: GraphQLString },
        message: { type: GraphQLString }
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

        login: {
            type: ResponseType,
            args: {
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve (parent, args, context) {
                return (async () => {
                    if (isValidToken(context.cookies.jwt)) {
                        return statusRes("error", "User is already logged in")
                    }

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
    }
});

/**/

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        register: {
            type: ResponseType,
            args: {
                username: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) }
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
                            password: args.password.trim()
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