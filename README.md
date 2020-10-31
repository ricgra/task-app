# Task-app

Node.js RESTful app built using Express.js, Mongoose and JWT.

## Installation

### Prerequisites

- [NPM](https://www.npmjs.com)
- [Node.js](https://nodejs.org)
- [MongoDB](https://www.mongodb.com)

### Dependencies
Install required dependencies

    $ npm install

## Configuration

Create and set environment variables in **config/*.env** files starting from *dev.env.example*
- create *dev.env* for development environment
- create *test.env* for test environment
- create *prod.env* for production environment

## Run

Run a MongoDB instance, the collections are created automatically by Mongoose.

### Development

Run the application with *nodemon*, a utility that will monitor for any changes in your source and automatically restart your server

    $ npm run dev

### Test
Run a testing framework, *Jest*, on tests written in *./test*

    $ npm run test

### Production

    $ npm run prod

## Postman

A Postman collection(*./Task-app.postman_collection.json*) is provided to access the application REST endpoints.
