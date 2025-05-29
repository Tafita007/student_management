let { Student, User } = require('../model/schemas');
let mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

function insertProfil(req, res) {
  const { nom, prenom, identifiant, motDePasse, role } = req.body;

  if (!nom || !prenom || !identifiant || !motDePasse || !role) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  User.findOne({ identifiant })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ message: 'Identifiant déjà utilisé.' });
      }

      return bcrypt.hash(motDePasse, 10);
    })
    .then(hashedPassword => {
      const userId = new mongoose.Types.ObjectId();

      const newUser = new User({
        _id: userId,
        nom,
        identifiant,
        motDePasse: hashedPassword,
        role,
        connexion: 0
      });

      return newUser.save().then(savedUser => ({ savedUser, userId }));
    })
    .then(({ savedUser, userId }) => {
      if (role === 'STUDENT') {
        const firstName = nom;
        const lastName = prenom;

        const newStudent = new Student({
          _id: userId, 
          firstName,
          lastName
        });

        return newStudent.save();
      }

      return null;
    })
    .then(() => {
      res.status(201).json({ message: 'Profil utilisateur ajouté avec succès.' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de l\'ajout du profil.', error: error.message });
    });
}


function insertProfilGmail(req, res) {
  const { nom, identifiant, motDePasse, role } = req.body;

  if (!nom || !identifiant || !motDePasse || !role) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  User.findOne({ identifiant })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ message: 'Identifiant déjà utilisé.' });
      }

      return bcrypt.hash(motDePasse, 10);
    })
    .then(hashedPassword => {
      const newUser = new User({
        nom,
        identifiant,
        motDePasse: hashedPassword,
        role,
        connexion: 1
      });

      return newUser.save();
    })
    .then(() => {
      res.status(201).json({ message: 'Profil utilisateur ajouté avec succès.' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de l\'ajout du profil.', error: error.message });
    });
}

function loginUser(req, res) {
    const { identifiant, motDePasse } = req.body;

    // Vérifie si l'identifiant et le mot de passe sont présents dans la requête
    if (!identifiant || !motDePasse) {
      return res.status(400).json({ message: 'Identifiant et mot de passe requis.' });
    }
  
    // Recherche l'utilisateur dans la base de données par identifiant
    User.findOne({ identifiant })
      .then(user => {
        // Si l'utilisateur n'est pas trouvé
        if (!user) {
          return res.status(401).json({ message: 'Identifiant incorrect.' });
        }

        // Compare le mot de passe fourni avec celui stocké dans la base de données
        return bcrypt.compare(motDePasse, user.motDePasse)
          .then(isMatch => {
            console.log(isMatch);
            // Si les mots de passe ne correspondent pas
            if (!isMatch) {
              return res.status(401).json({ message: 'Mot de passe incorrect.' });
            }

            // Si la connexion est réussie, renvoie les informations de l'utilisateur
            return res.status(200).json({
              id: user._id,
              nom: user.nom,
              identifiant: user.identifiant,
              type: user.role,
              connexion: user.connexion
            });
          });
      })
      .catch(error => {
        // Gère les erreurs
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
      });
  }

  function changePassword(req, res) {
    const { identifiant, oldPassword, newPassword } = req.body;
    
    // Vérification que tous les champs sont présents
    if (!identifiant || !oldPassword || !newPassword) {
      console.log("ato",identifiant);
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }
  
    // Vérifier si l'utilisateur existe
    User.findOne({ identifiant })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
  
        // Vérifier si le mot de passe actuel est correct
        return bcrypt.compare(oldPassword, user.motDePasse);
      })
      .then(isMatch => {
        if (!isMatch) {
          return res.status(400).json({ message: 'Le mot de passe actuel est incorrect.' });
        }
  
        // Hasher le nouveau mot de passe
        return bcrypt.hash(newPassword, 10);
      })
      .then(hashedPassword => {
        console.log("VOICI REQ ",req.body)
        // Mettre à jour le mot de passe de l'utilisateur
        return User.findOneAndUpdate(
          { identifiant: req.body.identifiant },
          { motDePasse: hashedPassword,connexion:1 },
          { new: true }
        );
      })
      .then(updatedUser => {
        // Retourner le rôle de l'utilisateur après la mise à jour du mot de passe
        console.log(updatedUser)
        res.status(200).json({
          //message: 'Mot de passe modifié avec succès.',
          userRole: updatedUser.role // On renvoie le rôle de l'utilisateur
        });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la modification du mot de passe.', error: error.message });
      });
  }


function getAll(req, res) {
  User.find().then((Users) => {
      res.send(Users);
  }).catch((err) => {
      res.send(err);
  });
}

module.exports = { insertProfil, loginUser, changePassword, insertProfilGmail, getAll };