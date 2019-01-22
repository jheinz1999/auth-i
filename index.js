const express = require('express');
const knex = require('knex');
const bcrypt = require('bcrypt');
const session = require('express-session');

const knexconfig = require('./knexfile');

const db = knex(knexconfig.development);
const server = express();

const port = process.env.PORT || 5000;

server.use(express.json());

server.use(session({
  name: 'cool session',
  secret: 'alksjdhwyuuwyer88904873402938',
  cookie: {
    maxAge: 1000000,
    secure: false
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false
}));

// authorization middleware

const protected = (req, res, next) => {

  if (req.session && req.session.userID) {

    next();

  }

  else {

    res.status(401).json({message: 'You are not logged in!'});

  }

}

// Should only send back data if user is authorized.

server.get('/api/users', protected, async (req, res) => {

  try {

    const data = await db.select('id', 'username').from('users');

    res.status(200).json(data);

  }

  catch (err) {

    res.status(500).json({message: 'internal error'});

  }

});

server.post('/api/register', async (req, res) => {

  let { username, password } = req.body;

  if (!username) {

    res.status(400).json({message: 'Please provide a username'});
    return;

  }

  if (!password) {

    res.status(400).json({message: 'Please provide a password'});
    return;

  }

  try {

    // using async because it seems better. Two passes for speed/development
    password = await bcrypt.hash(password, 2);

    const [ id ] = await db.insert({ username, password }).into('users');

    const user = await db.select('id', 'username').from('users').where({ id }).first();

    req.session.userID = user.id;

    res.status(201).json(user);

  }

  catch (err) {

    res.status(500).json({message: 'That username exists!'});

  }

});

server.post('/api/login', async (req, res) => {

  let { username, password } = req.body;

  if (!username) {

    res.status(400).json({message: 'Please provide a username'});
    return;

  }

  if (!password) {

    res.status(400).json({message: 'Please provide a password'});
    return;

  }

  try {

    const user = await db.select().from('users').where({ username }).first();

    if (user) {

      const correct = await bcrypt.compare(password, user.password);

      if (correct) {

        req.session.userID = user.id;
        res.status(200).json({message: 'authorized!'});
        return;

      }

    }

  }

  catch (err) {

    res.status(500).json(err);

  }

  res.status(401).json({message: 'Unauthorized'});

});

server.listen(port, () => console.log('server running'));
