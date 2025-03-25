const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNotification = async (req, res) => {
  try {
    const { user_id, news_id, msg_type, is_checked } = req.body;
    const newNotification = await pool.query(
      `INSERT INTO notifications(user_id, news_id, msg_type, is_checked, created_at) 
       VALUES ($1, $2, $3, $4, DEFAULT) RETURNING *`,
      [user_id, news_id, msg_type, is_checked || false]
    );

    res.status(201).send({
      message: "Yangi xabarnoma qo'shildi",
      notification: newNotification.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM notifications ORDER BY created_at DESC");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getNotificationById = async (req, res) => {
  try {
    const id = req.params.id;
    const results = await pool.query("SELECT * FROM notifications WHERE id = $1", [id]);

    if (results.rows.length === 0) {
      return res.status(404).send({ message: "Xabarnoma topilmadi" });
    }

    res.send(results.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateNotification = async (req, res) => {
  try {
    const { is_checked } = req.body;
    const id = req.params.id;

    const update = await pool.query(
      `UPDATE notifications SET is_checked = $1 WHERE id = $2 RETURNING *`,
      [is_checked, id]
    );

    if (update.rowCount === 0) {
      return res.status(404).send({ message: "Xabarnoma topilmadi" });
    }

    res.status(200).send({
      message: "Xabarnoma muvaffaqqiyatli yangilandi",
      notification: update.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteNotification = async (req, res) => {
  try {
    const id = req.params.id;
    const del = await pool.query("DELETE FROM notifications WHERE id=$1 RETURNING *", [id]);

    if (del.rowCount === 0) {
      return res.status(404).send({ message: "Xabarnoma topilmadi" });
    }

    res.status(200).send({ message: "Xabarnoma muvaffaqqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
};
