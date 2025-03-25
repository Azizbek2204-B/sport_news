const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addView = async (req, res) => {
  try {
    const { news_id, user_id } = req.body;
    const newView = await pool.query(
      `INSERT INTO views(news_id, user_id, viewed_at) VALUES ($1, $2, NOW()) RETURNING *`,
      [news_id, user_id]
    );

    res.status(201).send({
      message: "Ko'rish yozuvi qo'shildi",
      view: newView.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllViews = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM views ORDER BY viewed_at DESC");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getViewById = async (req, res) => {
  try {
    const id = req.params.id;
    const results = await pool.query("SELECT * FROM views WHERE id = $1", [id]);

    if (results.rows.length === 0) {
      return res.status(404).send({ message: "Ko'rish yozuvi topilmadi" });
    }

    res.send(results.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateView = async (req, res) => {
  try {
    const { news_id, user_id } = req.body;
    const id = req.params.id;

    const update = await pool.query(
      `UPDATE views SET news_id = $1, user_id = $2, viewed_at = NOW() WHERE id = $3 RETURNING *`,
      [news_id, user_id, id]
    );

    if (update.rowCount === 0) {
      return res.status(404).send({ message: "Ko'rish yozuvi topilmadi" });
    }

    res.status(200).send({
      message: "Ko'rish yozuvi yangilandi",
      view: update.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteView = async (req, res) => {
  try {
    const id = req.params.id;
    const del = await pool.query("DELETE FROM views WHERE id = $1 RETURNING *", [id]);

    if (del.rowCount === 0) {
      return res.status(404).send({ message: "Ko'rish yozuvi topilmadi" });
    }

    res.status(200).send({ message: "Ko'rish yozuvi o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addView,
  getAllViews,
  getViewById,
  updateView,
  deleteView,
};
