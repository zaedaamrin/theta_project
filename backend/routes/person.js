//This is only for testing the connection of database
const express = require('express');
const { 
  passwordConfig: SQLAuthentication, 
  noPasswordConfig: PasswordlessConfig 
} = require('../config.js');
const { createDatabaseConnection } = require('../database.js');

const router = express.Router();
router.use(express.json());

let database;

createDatabaseConnection(SQLAuthentication)
  .then((db) => {
    database = db;
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

router.get('/', async (req, res) => {
  try {
    // Return a list of persons
    const persons = await database.readAll();
    console.log(`persons: ${JSON.stringify(persons)}`);
    res.status(200).json(persons);
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // add a person
    const person = req.body;
    console.log(`person: ${JSON.stringify(person)}`);
    const rowsAffected = await database.create(person);
    res.status(201).json({ rowsAffected });
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Get the person with the specified ID
    const personId = req.params.id;
    console.log(`personId: ${personId}`);
    if (personId) {
      const result = await database.read(personId);
      console.log(`persons: ${JSON.stringify(result)}`);
      res.status(200).json(result);
    } else {
      res.status(404).send("Not Found");
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Update the person with the specified ID
    const personId = req.params.id;
    console.log(`personId: ${personId}`);
    const person = req.body;

    if (personId && person) {
      delete person.id;
      console.log(`person: ${JSON.stringify(person)}`);
      const rowsAffected = await database.update(personId, person);
      res.status(200).json({ rowsAffected });
    } else {
      res.status(404).send("Not Found");
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Delete the person with the specified ID
    const personId = req.params.id;
    console.log(`personId: ${personId}`);

    if (!personId) {
      res.status(404).send("Not Found");
    } else {
      const rowsAffected = await database.delete(personId);
      res.status(204).json({ rowsAffected });
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

module.exports = router;
