const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('Please log in');
      }
      return User.findById(context.user._id).populate('savedBooks');
    },
  },
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email }).exec();
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Incorrect email or password');
      }
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (_, { username, email, password }) => {
      try {
        const newUser = await User.create({ username, email, password });
        const token = signToken(newUser);
        return { token, user: newUser };
      } catch (err) {
        console.error(err);
        throw new Error('User creation failed');
      }
    },
    saveBook: async (_, { book }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        {
          $addToSet: { savedBooks: book },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      return updatedUser;
    },
    removeBook: async (_, { bookId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        {
          $pull: { savedBooks: { bookId } },
        },
        { new: true }
      );
      return updatedUser;
    },
  },
};

module.exports = resolvers;