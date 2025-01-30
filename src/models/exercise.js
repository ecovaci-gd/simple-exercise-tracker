const db = require("../db");

const addExercise = (userId, description, duration, date) => {
  return new Promise((resolve, reject) => {
    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      return reject(new Error("Duration must be a positive integer"));
    }

    const exerciseDate = date ? date : new Date().toISOString().split("T")[0];

    db.run(
      `INSERT INTO exercises (user_id, description, duration, date) VALUES (?, ?, ?, ?)`,
      [userId, description, parsedDuration, exerciseDate],
      function (err) {
        if (err) return reject(err);

        resolve({
          userId,
          exerciseId: this.lastID,
          description,
          duration: parsedDuration,
          date: exerciseDate,
        });
      }
    );
  });
};

const getUserExercises = (userId, from, to, limit) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT id, description, duration, date FROM exercises WHERE user_id = ?`;
    const params = [userId];

    if (from) {
      query += ` AND date >= ?`;
      params.push(from);
    }

    if (to) {
      query += ` AND date <= ?`;
      params.push(to);
    }

    query += ` ORDER BY date DESC`;

    if (limit) {
      query += ` LIMIT ?`;
      params.push(parseInt(limit, 10));
    }

    db.all(query, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

module.exports = { addExercise, getUserExercises };
