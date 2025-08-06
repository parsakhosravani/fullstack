// Sample React component to demonstrate client testing
const React = require('react');

function Welcome({ name = 'World' }) {
  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, `Hello, ${name}!`),
    React.createElement('p', null, 'Welcome to our MERN stack application.')
  );
}

module.exports = Welcome;