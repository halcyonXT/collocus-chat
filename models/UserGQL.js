const {projects, users} = require('../sampledata.js')

const { 
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLList} = require('graphql');

// User Type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return users;
            }
        },

        user: {
            type: UserType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return users.find(user => user.id === args.id)
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})