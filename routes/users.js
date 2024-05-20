var express = require("express");
var router = express.Router();

const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");

router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["firstname", "lastname", "email", "password"])) {
    res.json({ result: false, error: "Tous les champs doivent être renseignés" });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        token: uid2(32),
        settings: {
          timezone: "UTC",
          timeFormat: "24h",
          distUnit: "Km",
          tempUnit: "°C",
          globalNotification: false
        }
      });

      newUser.save().then((data) => {
        res.json({
          result: true,
          userData: {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            token: data.token,
          },
        });
      });
    } else {
      res.json({ result: false, error: "L'utilisateur est déjà enregistré" });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Tous les champs doivent être renseignés" });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data && req.body.password === data.password) {
      res.json({
        result: true,
        userData: {
          token: data.token,
          email: data.email,
          firstname: data.firstname,
          lastname: data.lastname,
        },
      });
    } else {
      res.json({ result: false, error: "Utilisateur inexistant ou mot de passe incorrect" });
    }
  });
});

// Update user's password
router.put("/", (req, res) => {
  if (!checkBody(req.body, ["email", "password", "newPassword"])) {
    res.json({ result: false, error: "Tous les champs doivent être renseignés" });
    return;
  }
  User.findOne({ email: req.body.email }).then((data) => {
    if (req.body.email === data.email && req.body.password === data.password) {
      User.updateOne(
        { email: req.body.email },
        { password: req.body.newPassword }
      ).then(() => {
        res.json({ result: true, message: "Le mot de passe est mis à jour" });
      });
    } else {
      res.json({ result: false, error: "Utilisateur inexistant ou mot de passe incorrect" });
    }
  });
});

// Update user's infos (first and last name)
router.put("/profile-update", (req, res) => {
  if (!checkBody(req.body, ["email", "password", "firstname", "lastname"])) {
    res.json({ result: false, error: "Tous les champs doivent être renseignés" });
    return;
  }
  User.findOne({ email: req.body.email, password: req.body.password }).then(
    (data) => {
      if (
        req.body.email === data.email &&
        req.body.password === data.password
      ) {
        User.updateOne(
          { email: req.body.email },
          {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
          }
        ).then(() => {
          res.json({ result: true, message: "Le profil a été mis à jour" });
        });
      } else {
        res.json({ result: false, error: "Utilisateur inexistant ou mot de passe incorrect" });
      }
    }
  );
});

// Delete user's account
router.delete("/", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Tous les champs doivent être renseignés" });
    return;
  }
  User.findOne({ email: req.body.email }).then((data) => {
    if (req.body.email === data.email && req.body.password === data.password) {
      User.deleteOne({
        email: req.body.email,
        password: req.body.password,
      }).then(() => {
        res.json({ result: true });
      });
    } else {
      res.json({ result: false, error: "Utilisateur inexistant ou mot de passe incorrect" });
    }
  });
});

module.exports = router;
