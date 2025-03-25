const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewsTag = async (req, res) => {
  try {
    const { news_id, tag_id } = req.body;
    const newNewsTag = await pool.query(
      `INSERT INTO news_tags(news_id, tag_id) VALUES ($1, $2) RETURNING *`,
      [news_id, tag_id]
    );

    res.status(201).send({
      message: "Yangi bog'lanish qo'shildi",
      newsTag: newNewsTag.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllNewsTags = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM news_tags");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getNewsTagById = async (req, res) => {
  try {
    const id = req.params.id;
    const results = await pool.query("SELECT * FROM news_tags WHERE id = $1", [id]);

    if (results.rows.length === 0) {
      return res.status(404).send({ message: "Bog'lanish topilmadi" });
    }

    res.send(results.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateNewsTag = async (req, res) => {
  try {
    const { news_id, tag_id } = req.body;
    const id = req.params.id;

    const update = await pool.query(
      `UPDATE news_tags SET news_id = $1, tag_id = $2 WHERE id = $3 RETURNING *`,
      [news_id, tag_id, id]
    );

    if (update.rowCount === 0) {
      return res.status(404).send({ message: "Bog'lanish topilmadi" });
    }

    res.status(200).send({
      message: "Malumot muvaffaqqiyatli yangilandi",
      newsTag: update.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteNewsTag = async (req, res) => {
  try {
    const id = req.params.id;
    const del = await pool.query("DELETE FROM news_tags WHERE id = $1 RETURNING *", [id]);

    if (del.rowCount === 0) {
      return res.status(404).send({ message: "Bog'lanish topilmadi" });
    }

    res.status(200).send({ message: "Bog'lanish muvaffaqqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewsTag,
  getAllNewsTags,
  getNewsTagById,
  updateNewsTag,
  deleteNewsTag,
};
