const express = require('express');
const actionsDB = require("../data/helpers/actionModel")
const router = express.Router();

router.get('/', (req, res) => {
    actionsDB
    .get()
    .then(actions => res.json(actions))
    .catch(err => {
      res
        .status(500)
        .json({ error: "The actions information could not be retrieved." });
    });
});

router.get('/:id', (req, res) => {
    actionsDB
    .get(req.params.id)
    .then(action => {
      if (action) {
        res.status(201).json(action);
      } else {
        res
          .status(404)
          .json({ message: "The action with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "An error occured..." });
    });
});

router.delete('/:id', (req, res) => {
    actionsDB
    .get(req.params.id)
    .then(async actions => {
      if (actions) {
        await actionsDB.remove(req.params.id);
        return actions;
      }
      res.status(404).json({ message: "User not found" });
    })
    .then(data => res.json(data))
    .catch(err => {
      res.status(500).json({ message: "An error occured..." });
    });
});

router.put('/:id', (req, res) => {  
    actionsDB
      .get(req.params.id)
      .then(action => {
        if (action) {
          return actionsDB.update(req.params.id, req.body);
        }
        res.status(404).json({ message: "User not found" });
      })
      .then(() => actionsDB.get(req.params.id))
      .then(data => res.json(data))
      .catch(err => {
        res.status(500).json({ message: "An error occured..." });
      });
});

module.exports = router;
