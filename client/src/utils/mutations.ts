// src/api/mutations.ts
import { gql } from "@apollo/client";

// Mutation for logging in a user
export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

// Mutation for registering a new user
export const ADD_USER = gql`
  mutation AddUser($input: AddUserInput!) {
    addUser(input: $input) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

// Mutation for saving a book to the user's profile
export const SAVE_BOOK = gql`
  mutation SaveBook($input: SaveBookInput!) {
    saveBook(input: $input) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

// Mutation for removing a saved book from the user's profile
export const REMOVE_BOOK = gql`
  mutation RemoveBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
