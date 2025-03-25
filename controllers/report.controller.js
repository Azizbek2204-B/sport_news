const pool = require('../config/db');
const { errorHandler } = require('../helpers/error_handler');

const addReport = async (req, res) => {
    try {
        const { user_id, news_id, reason, status } = req.body;
        const created_at = new Date();
        const newReport = await pool.query(
            `INSERT INTO reports (user_id, news_id, reason, status, created_at) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [user_id, news_id, reason, status, created_at]
        );
        res.status(201).send({ message: "Report qo'shildi", report: newReport.rows[0] });
    } catch (error) {
        errorHandler(error, res);
    }
};

const getAllReports = async (req, res) => {
    try {
        const results = await pool.query(`SELECT * FROM reports ORDER BY created_at DESC`);
        res.send(results.rows);
    } catch (error) {
        errorHandler(error, res);
    }
};

const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`SELECT * FROM reports WHERE id = $1`, [id]);
        if (result.rows.length === 0) return res.status(404).send({ message: "Report topilmadi" });
        res.send(result.rows[0]);
    } catch (error) {
        errorHandler(error, res);
    }
};

const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await pool.query(
            `UPDATE reports SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        );
        if (updated.rows.length === 0) return res.status(404).send({ message: "Report topilmadi" });
        res.send({ message: "Report yangilandi", report: updated.rows[0] });
    } catch (error) {
        errorHandler(error, res);
    }
};

const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const del = await pool.query(`DELETE FROM reports WHERE id = $1 RETURNING *`, [id]);
        if (del.rowCount === 0) return res.status(404).send({ message: "Report topilmadi" });
        res.status(200).send({ message: "Report o'chirildi" });
    } catch (error) {
        errorHandler(error, res);
    }
};

module.exports = {
    addReport,
    getAllReports,
    getReportById,
    updateReportStatus,
    deleteReport
};
