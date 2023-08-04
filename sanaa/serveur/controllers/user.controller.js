const mysql = require('mysql');
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

// Register a new user
const createUser = (req, res) => {
  // utilise req.body de body-parser
  const { nom, prenom, adresse, code_postal, ville, telephone, email } = req.body;
  // vérifier si les champs sont remplis
  if (!nom || !prenom || !adresse || !code_postal || !ville || !telephone || !email) {
    return res.status(400).json({
      error: 'donnée manquante',
    })
  }
  const query = 'INSERT INTO user (nom, prenom, adresse, code_postal, ville, telephone, email ) VALUES (?,?,?,?,?,?,?)';
  conn.query(query, [nom, prenom, adresse, code_postal, ville, telephone, email], (err) => {
    if (err) {
      console.error('erreur lors de l\'insertion des données : ' + err);
      res.status(500).json({ error: 'erreur lors de l\'insertion des données' });
    } else {
      res.status(200).json({ message: 'utilisateur enregistré' });
    }
  });
};

const updateUser = (req, res) => {
  const { nom, prenom, adresse, code_postal, ville, telephone, email } = req.body;
  const query = 'UPDATE user SET nom = ?, prenom = ?, adresse = ?, code_postal = ?, ville = ?, telephone = ?, email = ? WHERE id = ?';
  conn.query(query, [nom, prenom, adresse, code_postal, ville, telephone, email, req.params.id], (err) => {
    if (err) {
      console.error('Erreur lors de la modification de l\'utilisateur: ' + err);
      res.status(500).json({
        error: 'Erreur lors de la modification de l\'utilisateur'
      });
    } else {
      console.log(res);
      res.status(200).json({ message: 'Utilisateur modifié' });
    }
  });
};

const deleteUser = (req, res) => {
  const query = 'DELETE FROM user WHERE id =?'
  conn.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression des données : ' + err);
      res.status(500).json({ error: 'Erreur lors de la suppression des données' });
    } else {
      res.status(200).json({ message: 'Utilisateur supprimé' });
    }
  })
};

const getAllUsers = (req, res) => {
  const query = 'SELECT * FROM user';
  conn.query(query, (err, result) => {
    if (err) {
      console.error('Erreur de la récupération des données ' + err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    } else {
      res.status(200).json(result);
    }
  }

  )
}



module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
};