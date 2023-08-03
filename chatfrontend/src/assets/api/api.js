import { gql } from '@apollo/client';

const GET_USER_BY_TOKEN = gql`
  query GetUserByToken {
    client {
      _id
      username
      profilePicture
      headline
      channels
    }
  }
`;


const ADD_CHANNEL_MUTATION = gql`
  mutation AddChannel($name: String!, $picture: String!) {
    addChannel(name: $name, picture: $picture) {
      status
      message
    }
  }
`;

const ADD_USER_TO_CHANNEL_MUTATION = gql`
  mutation AddUserToChannel($id: ID!, $channel: ID!) {
    addUserToChannel(id: $id, channel: $channel) {
      status
      message
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation AddMessage($id: ID!, $sender: ID!, $timestamp: String!, $content: String!, $image: String) {
    addMessage(id: $id, sender: $sender, timestamp: $timestamp, content: $content, image: $image) {
      status
      message
    }
  }
`;

const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      status
      message
    }
  }
`;

const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      status
      message
    }
  }
`;

const GET_USERS_BY_IDS = gql`
  query GetUsersByIds($ids: [ID!]!) {
    users(ids: $ids) {
      _id
      username
      profilePicture
    }
  }
`;

const GET_CHANNEL = gql`
  query GetChannel($id: ID!) {
    getChannel(id: $id) {
      owner
      picture
      name
      members
      messages {
        sender {
          _id
          username
          profilePicture
        }
        timestamp
        content
      }
    }
  }
`;

const GET_USER_CHANNELS = gql`
  query GetUserChannels($id: ID!) {
    getUserChannels(id: $id) {
      _id
      name
      picture
    }
  }
`;


export {
    GET_USER_BY_TOKEN,
    ADD_CHANNEL_MUTATION,
    ADD_USER_TO_CHANNEL_MUTATION,
    ADD_MESSAGE,
    REGISTER_USER,
    LOGIN_USER,
    GET_USERS_BY_IDS,
    GET_USER_CHANNELS,
    GET_CHANNEL
}