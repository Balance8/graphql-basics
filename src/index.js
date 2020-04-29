import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Scalar Types - String, Boolean, Int, Float, ID

let users = [
  {
    id: '1',
    name: 'michael',
    email: 'beins.com',
    age: '27',
  },
  {
    id: '2',
    name: 'amanda',
    email: 'beins.com',
  },
  {
    id: '3',
    name: 'adsf',
    email: 'asdf.com',
  },
];
let comments = [
  {
    id: '100',
    text: 'michael',
    author: '1',
    post: '10',
  },
  {
    id: '200',
    text: 'amanda',
    author: '2',
    post: '20',
  },
  {
    id: '300',
    text: 'adsf',
    author: '1',
    post: '10',
  },
];

let posts = [
  {
    id: '10',
    title: 'michael',
    body: 'beins.com',
    published: true,
    author: '1',
  },
  {
    id: '20',
    title: 'amanda',
    body: 'beins.com',
    published: true,
    author: '2',
  },
  {
    id: '30',
    title: 'adsf',
    body: 'asdf.com',
    published: false,
    author: '3',
  },
];

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query:String): [User!]!
    posts(query:String): [Post!]!
    comments(query:String): [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput!): Post!
    createComment(data: CreateCommentInput!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }
  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }
  input CreateCommentInput {
   text: String!
   author: ID!
   post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User! 
    post: Post!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    comments(parent, args, ctx, info) {
      if (!args.query) {
        return comments;
      }
      return comments.filter((comment) => {
        return comment.text.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    me() {
      return {
        id: '123',
        name: 'mike',
        email: 'mike.com',
        age: 28,
      };
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        return post.body.toLowerCase().includes(args.query.toLowerCase());
      });
    },
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.data.email);

      if (emailTaken) {
        throw new Error('Email Taken.');
      }

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User Not Found');
      }

      const deletedUsers = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id);
        }

        return !match;
      });

      comments = comments.filter((comment) => comment.author !== args.id);

      return deletedUsers[0];
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);

      if (!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        ...args.data,
      };

      posts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);
      const postExists = posts.some(
        (post) => post.id === args.data.post && post.published
      );

      if (!userExists) {
        throw new Error('User not found');
      }
      if (!postExists) {
        throw new Error('Post not found');
      }

      const comment = {
        id: uuidv4(),
        ...args.data,
      };

      comments.push(comment);

      return comment;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('The Server is up!');
});
