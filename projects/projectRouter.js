const express = require("express");
const projectDB = require("../data/helpers/projectModel")
const actionDB = require("../data/helpers/actionModel")
const router = express.Router();

router.post("/", (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ message: "Missing project name" });
  }
  if (!req.body.description) {
    return res.status(400).json({ message: "Missing project description" });
  }

  projectDB
    .insert(req.body)
    .then(project => {
      res.status(201).json(project);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the project"
      });
    });
});

router.post("/:id/actions", validateProjectId(), (req, res) => {
  const notes = req.body.notes;
  const description = req.body.description;
  const project_id = req.params.id;
  const action = { project_id: project_id, notes: notes, description: description  };
  if (!notes) {
    return res.status(400).json({
      errorMessage: "Please provide the notes for the action."
    });
  }
  if (!description) {
    return res.status(400).json({
      errorMessage: "Please provide the description for the action."
    });
  }
  projectDB.getProjectActions(project_id).then(newAction => {
    console.log(newAction);
    if (newAction) {
      actionDB
        .insert(action)
        .then(newAction => {
          res.status(201).json(newAction);
        })
        .catch(error =>
          res.status(500).json({
            message: "There was an error while saving the action to the database"
          })
        );
    } else {
      res
        .status(404)
        .json({ message: "The project with the specified ID does not exist." });
    }
  });
});

router.get("/", (req, res) => {
  projectDB
    .get()
    .then(project => res.json(project))
    .catch(err => {
      res
        .status(500)
        .json({ error: "The project information could not be retrieved." });
    });
});

router.get("/:id", validateProjectId(), (req, res) => {
  projectDB
    .get(req.params.id)
    .then(project => {
      if (project) {
        res.status(201).json(project);
      } else {
        res
          .status(404)
          .json({ message: "The project with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "An error occured..." });
    });
});

router.get("/:id/actions", validateProjectId(), (req, res) => {
  projectDB
    .getProjectActions(req.params.id)
    .then(action => {
      res.status(201).json(action);
    })
    .catch(err => {
      res.status(500).json({
        message: "Could not get projects actions"
      });
    });
});

router.delete("/:id", validateProjectId(), (req, res) => {
  projectDB
    .get(req.params.id)
    .then(async project => {
      if (project) {
        await projectDB.remove(req.params.id);
        return project;
      }
      res.status(404).json({ message: "User not found" });
    })
    .then(data => res.json(data))
    .catch(err => {
      res.status(500).json({ message: "An error occured..." });
    });
});

router.put("/:id", validateProjectId(), (req, res) => {
  const name = req.body;
  if (!name) {
    return res.status(400).json({ message: "You need to enter a name" });
  }

  projectDB
    .get(req.params.id)
    .then(project => {
      if (project) {
        return projectDB.update(req.params.id, name);
      }
      res.status(404).json({ message: "User not found" });
    })
    .then(() => projectDB.get(req.params.id))
    .then(data => res.json(data))
    .catch(err => {
      res.status(500).json({ message: "An error occured..." });
    });
});

// Middleware :)

function validateProjectId() {
  return (req, res, next) =>{
    projectDB.get(req.params.id)
      .then(project => {
        if(project){
          req.project = project
          next()
        } else{
          res.status(400).json({message: "A project with this id doesn't exist."})
        }
      })
  }
}

module.exports = router;
