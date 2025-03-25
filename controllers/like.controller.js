const pool = require('../config/db');
const { errorHandler } = require('../helpers/error_handler');

const addLike = async (req, res) => {
    try {
        const { news_id, user_id } = req.body;
        const liked_at = new Date();
        const newLike = await pool.query(
            `INSERT INTO likes (news_id, user_id, liked_at) 
             VALUES ($1, $2, $3) RETURNING *`,
            [news_id, user_id, liked_at]
        );
        res.status(201).send({ message: "Like qo'shildi", like: newLike.rows[0] });
    } catch (error) {
        errorHandler(error, res);
    }
};

const getAllLikes = async (req, res) => {
    try {
        const results = await pool.query(`SELECT * FROM likes ORDER BY liked_at DESC`);
        res.send(results.rows);
    } catch (error) {
        errorHandler(error, res);
    }
};

const getLikesByNewsId = async (req, res) => {
    try {
        const news_id = req.params.news_id;
        const result = await pool.query(`SELECT * FROM likes WHERE news_id = $1`, [news_id]);
        res.send(result.rows);
    } catch (error) {
        errorHandler(error, res);
    }
};

const getLikesByUserId = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const result = await pool.query(`SELECT * FROM likes WHERE user_id = $1`, [user_id]);
        res.send(result.rows);
    } catch (error) {
        errorHandler(error, res);
    }
};

const deleteLike = async (req, res) => {
    try {
        const { news_id, user_id } = req.body;
        const del = await pool.query(
            `DELETE FROM likes WHERE news_id = $1 AND user_id = $2 RETURNING *`,
            [news_id, user_id]
        );
        if (del.rowCount === 0) {
            return res.status(404).send({ message: "Like topilmadi" });
        }
        res.status(200).send({ message: "Like o'chirildi" });
    } catch (error) {
        errorHandler(error, res);
    }
};

module.exports = {
    addLike,
    getAllLikes,
    getLikesByNewsId,
    getLikesByUserId,
    deleteLike
};