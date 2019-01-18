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

  const loggedIn = false;

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


server.listen(port, () => console.log('server running'));
