const pool = require('../config/db');
const { errorHandler } = require('../helpers/error_handler');

const addNewComment = async (req, res) => {
    try {
        const { user_id, news_id, content, created_at, reply_comment_id, is_approved, is_deleted, views, likes } = req.body;
        const newComment = await pool.query(
            `INSERT INTO comments (user_id, news_id, content, created_at, reply_comment_id, is_approved, is_deleted, views, likes) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [user_id, news_id, content, created_at, reply_comment_id, is_approved, is_deleted, views, likes]
        );
        res.status(201).send({ message: "Yangi izoh qo'shildi", comment: newComment.rows[0] });
    } catch (error) {
        errorHandler(error, res);
    }
};

const getAllComments = async (req, res) => {
    try {
        const results = await pool.query(`SELECT * FROM comments ORDER BY created_at DESC`);
        res.send(results.rows);
    } catch (error) {
        errorHandler(error, res);
    }
};

const getCommentById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await pool.query(`SELECT * FROM comments WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).send({ message: "Izoh topilmadi" });
        }
        res.send(result.rows[0]);
    } catch (error) {
        errorHandler(error, res);
    }
};

const updateCommentById = async (req, res) => {
    try {
        const id = req.params.id;
        const { content, is_approved, is_deleted, views, likes } = req.body;
        const updateComment = await pool.query(
            `UPDATE comments SET content=$1, is_approved=$2, is_deleted=$3, views=$4, likes=$5 WHERE id=$6 RETURNING *`,
            [content, is_approved, is_deleted, views, likes, id]
        );
        if (updateComment.rowCount === 0) {
            return res.status(404).send({ message: "Izoh topilmadi" });
        }
        res.status(200).send({ message: "Izoh muvaffaqiyatli yangilandi", comment: updateComment.rows[0] });
    } catch (error) {
        errorHandler(error, res);
    }
};

const deleteCommentById = async (req, res) => {
    try {
        const id = req.params.id;
        const del = await pool.query(`DELETE FROM comments WHERE id=$1 RETURNING *`, [id]);
        if (del.rowCount === 0) {
            return res.status(404).send({ message: "Izoh topilmadi" });
        }
        res.status(200).send({ message: "Izoh muvaffaqiyatli o'chirildi" });
    } catch (error) {
        errorHandler(error, res);
    }
};

module.exports = {
    addNewComment,
    getAllComments,
    getCommentById,
    updateCommentById,
    deleteCommentById
};
