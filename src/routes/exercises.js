const express = require("express");
const router = express.Router();
const {
  addExercise,
  getUserExercises,
} = require("../models/exercise");
const { getUserById } = require("../models/user");

router.post("/:_id/exercises", async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  if (!description || !duration) {
    return res
      .status(400)
      .json({ error: "Description and duration are required" });
  }

  try {
    const user = await getUserById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newExercise = await addExercise(_id, description, duration, date);
    res.json({ userId: user.id, username: user.username, ...newExercise });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  try {
    const user = await getUserById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const exercises = await getUserExercises(_id, from, to, limit);

    res.json({
      id: user.id,
      username: user.username,
      count: exercises.count,
      log: exercises.rows,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
