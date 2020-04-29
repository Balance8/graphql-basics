// Scalar Types - String, Boolean, Int, Float, ID

const users = [
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
const comments = [
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

const posts = [
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

const db = {
  users,
  posts,
  comments,
};

export { db as default };
