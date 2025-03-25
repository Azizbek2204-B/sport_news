const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewAuthors = async (req, res) => {
  try {
    const { user_id, is_approved, is_editor} = req.body;
    const newAuthors = await pool.query(
      `INSERT INTO authors(user_id, is_approved, is_editor)
        VALUES ($1, $2, $3) RETURNING *`,
      [user_id, is_approved, is_editor]
    );
    res
      .status(201)
      .send({
        message: "Yangi muallif qo'shildi",
        category: newAuthors.rows[0],
      });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllAuthors = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM authors");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAuthorsById = async (req, res) => {
  try {
    const id = req.params.id;
    const results = await pool.query("SELECT * FROM authors WHERE id = $1", [
      id,
    ]);

    if (results.rows.length === 0) {
      return res.status(404).send({ message: "Muallif topilmadi" });
    }

    res.send(results.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateAuthorsById = async (req, res) => {
  try {
    const { user_id, is_approved, is_editor } = req.body;
    const id = req.params.id;

    const update = await pool.query(
      `UPDATE authors SET user_id=$1, is_approved=$2, is_editor=$3 WHERE id=$4 RETURNING *`,
      [user_id, is_approved, is_editor, id]
    );

    if (update.rowCount === 0) {
      return res.status(404).send({ message: "Muallif topilmadi" });
    }

    res
      .status(200)
      .send({
        message: "Malumotlar muvaffaqqiyatli yangilandi",
        category: update.rows[0],
      });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteAuthorsById = async (req, res) => {
  try {
    const id = req.params.id;
    const del = await pool.query(
      "DELETE FROM authors WHERE id=$1 RETURNING *",
      [id]
    );

    if (del.rowCount === 0) {
      return res.status(404).send({ message: "Muallif topilmadi" });
    }

    res.status(200).send({ message: "Muallif muvaffaqqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewAuthors,
  getAllAuthors,
  getAuthorsById,
  updateAuthorsById,
  deleteAuthorsById
};