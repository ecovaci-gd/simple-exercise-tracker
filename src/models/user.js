const db = require("../db");

const createUser = (username) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (username) VALUES (?)`,
      [username],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, username });
      }
    );
  });
};

const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, username FROM users WHERE id = ?`,
      [userId],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
};

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT id, username FROM users`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

module.exports = { createUser, getUserById, getAllUsers };
