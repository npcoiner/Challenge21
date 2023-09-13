const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        _id: ID
        authors: [String]
        description: String!
        title: String!
        bookId: String!
        image: String
        link: String
    }

    type Query {
        me: User
    }

    type Auth {
        token: ID!
        user: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        signup(username: String!, email: String!, password: String!): Auth
        addBookToList(book: BookInput!): User
        removeBookFromList(bookId: String!): User
    }

    input BookInput {
        _id: ID
        authors: [String]
        description: String!
        title: String!
        bookId: String!
        image: String
        link: String
    }`;

module.exports = typeDefs;