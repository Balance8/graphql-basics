const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter((post) => {
      return post.body.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  comments(parent, args, { db }, info) {
    if (!args.query) {
      return db.comments;
    }
    return db.comments.filter((comment) => {
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
};

export { Query as default };
