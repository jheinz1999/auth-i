const express = require('express');
const knex = require('knex');
const bcrypt = require('bcrypt');

const knexconfig = require('./knexfile');

const db = knex(knexconfig.development);
const server = express();

const port = process.env.PORT || 5000;

server.use(express.json());

// Should only send back data if user is authorized.

server.get('/api/users', async (req, res) => {

  const loggedIn = true;

  if (!loggedIn) {

    res.status(401).json({message: 'You are not logged in!'});
    return;

  }

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

    const user = await db.select('id', 'username').from('users').where({ id });

    res.status(201).json(user);

  }

  catch (err) {

    console.log(err);
    res.status(500).json({err});

  }

});

server.listen(port, () => console.log('server running'));
