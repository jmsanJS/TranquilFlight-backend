var express = require("express");
var router = express.Router();

const User = require("../models/users");
const Favorites = require("../models/favorites");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");

router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["firstname", "lastname", "email", "password"])) {
    res.json({
      result: false,
      error: "Tous les champs doivent être renseignés",
    });
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
          timeFormat: "24h",
          distUnit: "km",
          tempUnit: "°C",
          globalNotification: "on",
        },
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
    res.json({
      result: false,
      error: "Tous les champs doivent être renseignés",
    });
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
      res.json({
        result: false,
        error: "Utilisateur inexistant ou mot de passe incorrect",
      });
    }
  });
});

// Update user's password
router.put("/", (req, res) => {
  if (!checkBody(req.body, ["email", "password", "newPassword"])) {
    res.json({
      result: false,
      error: "Tous les champs doivent être renseignés",
    });
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
      res.json({
        result: false,
        error: "Utilisateur inexistant ou mot de passe incorrect",
      });
    }
  });
});

// Update user's infos (first and last name)
router.put("/profile-update", (req, res) => {
  if (!checkBody(req.body, ["oldEmail", "newEmail", "token"])) {
    res.json({
      result: false,
      error: "Tous les champs doivent être renseignés",
    });
    return;
  }
  User.findOne({ oldEmail: req.body.email, token: req.body.token }).then(
    (data) => {
      if (req.body.oldEmail === data.email && req.body.token === data.token) {
        User.updateOne(
          { token: req.body.token },
          {
            email: req.body.newEmail,
          }
        ).then(() => {
          res.json({
            result: true,
            message: "L'adresse email a été mise à jour",
          });
        });
      } else {
        res.json({ result: false, error: "Utilisateur inexistant" });
      }
    }
  );
});

// Delete user's account
router.delete("/", (req, res) => {
  if (!checkBody(req.body, ["email", "token"])) {
    res.json({ result: false });
    return;
  }
  User.findOne({ email: req.body.email, token: req.body.token }).then(
    (data) => {
      if (req.body.email === data.email && req.body.token === data.token) {
        User.deleteOne({
          email: req.body.email,
          token: req.body.token,
        }).then(() => {
          res.json({ result: true });
        });
      } else {
        res.json({ result: false, error: "Utilisateur inexistant" });
      }
    }
  );
});

router.post("/favorite", async (req, res) => {
  if (!checkBody(req.body, ["flightData", "email", "token"])) {
    res.json({ result: false });
    return;
  }

  let userData = await User.findOne({
    email: req.body.email,
    token: req.body.token,
  });

  const newFavorite = {
    flightData: req.body.flightData,
    notification: false,
  };

  if (userData) {
    let favorites = await Favorites.findOne({ user: userData.id });

    if (favorites) {
      // Si le document existe, ajoutez le vol au tableau flights
      favorites.flights.push(newFavorite);
      res.json({ result: true });
    } else {
      // Sinon, créez un nouveau document
      favorites = new Favorites({
        user: userData.id,
        flights: [newFavorite],
      });
      res.json({ result: true });
    }
    await favorites.save();
  } else {
    res.json({
      result: false,
      error: `Utilisateur ${req.body.email} introuvable`,
    });
  }
});

router.delete("/favorite", async (req, res) => {
  if (!checkBody(req.body, ["flightNumber", "email", "token"])) {
    res.json({
      result: false,
      error: "Une erreur s'est produite, veuillez réessayer.",
    });
    return;
  }

  let userData = await User.findOne({
    email: req.body.email,
    token: req.body.token,
  });

  if (userData) {
    let favorites = await Favorites.findOne({ user: userData.id });

    if (favorites) {
      const flightIndex = favorites.flights.findIndex(
        (flight) => {
          const flightNumberData = flight.flightData.flightNumber.trim();
          const flightNumberReq = req.body.flightNumber.trim();
          return flightNumberData === flightNumberReq;
        }
      );

      if (flightIndex === -1) {
        return res.status(404).json({
          result: false,
          message: "Vol non trouvé",
        });
      }

      favorites.flights.splice(flightIndex, 1);
      await favorites.save();

      res.json({ result: true });
    } else {
      res.json({
        result: false,
        message: "le vol a déjà été supprimé ou nexiste pas",
      });
    }
  } else {
    res.json({
      result: false,
      error: `Utilisateur ${req.body.email} introuvable`,
    });
  }
});

router.post("/favorites", async (req, res) => {
  if (!checkBody(req.body, ["email", "token"])) {
    res.json({
      result: false,
      error: "Une erreur s'est produite, veuillez réessayer.",
    });
    return;
  }

  let userData = await User.findOne({
    email: req.body.email,
    token: req.body.token,
  });

  if (userData) {
    let favorites = await Favorites.find({ user: userData.id });

    if (favorites) {
      res.json({ result: true, favorites: favorites[0].flights });
    } else {
      res.json({
        result: false,
        message:
          "Aucun favoris associés à cet utilisateur dans la base de donnée",
      });
    }
  } else {
    res.json({
      result: false,
      error: `Utilisateur ${req.body.email} introuvable`,
    });
  }
});

// Get user's settings
router.post("/settings", (req, res) => {
  User.findOne({ email: req.body.email, token: req.body.token }).then(
    (data) => {
      if (data) {
        res.json({ result: true, userData: data.settings });
      } else {
        res.json({ result: false, message: "L'utilisateur est déconnecté." });
      }
    }
  );
});

// Update user's settings
router.put("/settings", (req, res) => {
  User.findOneAndUpdate(
    { token: req.body.token },
    {
      $set: {
        "settings.timeFormat": req.body.timeFormat,
        "settings.distUnit": req.body.distUnit,
        "settings.tempUnit": req.body.tempUnit,
        "settings.globalNotification": req.body.globalNotification,
      },
    },
    { new: true }
  ).then((data) => {
    if(data) {
      res.json({
        result: true,
        message: "Les paramètres ont étés modifiés.",
        data: data,
      });
    } else {
      res.json({
        result: false,
        message: "Les paramètres n'ont pas étés modifiés.",
      });
    }
  });
});

module.exports = router;
