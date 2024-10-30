import { AuthenticationError } from "apollo-server-express";
import User from "../models/User.js";
import { signToken } from "../services/auth.js";
// Resolvers for GraphQL Queries and Mutations
const resolvers = {
    Query: {
        // Query to retrieve the logged-in user's data
        me: async (_parent, _args, context) => {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated!");
            }
            const user = await User.findById(context.user._id);
            if (!user) {
                throw new AuthenticationError("User not found!");
            }
            return user;
        },
    },
    Mutation: {
        // Mutation to register a new user and return a token with the user data
        addUser: async (_parent, { input }) => {
            const user = await User.create(input);
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        // Mutation to log in a user and return a token with the user data
        login: async (_parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError("Invalid password!");
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        // Mutation to save a book to the user's `savedBooks` list
        saveBook: async (_parent, { input }, context) => {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated!");
            }
            const updatedUser = await User.findOneAndUpdate({ _id: context.user._id }, { $addToSet: { savedBooks: input } }, { new: true, runValidators: true });
            if (!updatedUser) {
                throw new Error("User not found!");
            }
            return updatedUser;
        },
        // Mutation to remove a book from the user's `savedBooks` list by bookId
        removeBook: async (_parent, { bookId }, context) => {
            if (!context.user) {
                throw new AuthenticationError("Not authenticated!");
            }
            const updatedUser = await User.findOneAndUpdate({ _id: context.user._id }, { $pull: { savedBooks: { bookId } } }, { new: true });
            if (!updatedUser) {
                throw new Error("User not found!");
            }
            return updatedUser;
        },
    },
};
export default resolvers;
