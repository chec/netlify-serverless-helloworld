exports.hello_world = (req, res) => {
  // Internal logging is compiled in the Netlify logs
  console.log('Hello world!');

  // Return something to the API handler, which could be returned in the function's response
  return 'Hello world!';
};
