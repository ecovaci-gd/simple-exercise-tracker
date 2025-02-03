const db = require("../db");

const isValidDate = (dateString) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(dateRegex)) {
    return false;
  }

  const date = new Date(dateString);

  return !isNaN(date.getTime());
};

const addExercise = (userId, description, duration, date) => {
  return new Promise((resolve, reject) => {
    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      return reject(new Error("Duration must be a positive integer"));
    }

    const exerciseDate = date ? date : new Date().toISOString().split("T")[0];

    if (date && !isValidDate(date)) {
      return reject(new Error("Invalid date format. Use YYYY-MM-DD"));
    }

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

    db.all(query, params, (err, rows) => {
      if (err) {
        return reject(err);
      }

      let sortedExercises = rows.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      if (from) {
        sortedExercises = sortedExercises.filter((ex) => ex.date >= from);
      }

      if (to) {
        sortedExercises = sortedExercises.filter((ex) => ex.date <= to);
      }

      const totalExercises = sortedExercises.length;

      if (limit) {
        sortedExercises = sortedExercises.slice(0, parseInt(limit));
      }

      resolve({ exercises: sortedExercises, count: totalExercises });
    });
  });
};

module.exports = { addExercise, getUserExercises };
