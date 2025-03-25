const { addReport, getAllReports, updateReportStatus, getReportById, deleteReport } = require("../controllers/report.controller");

const router = require("express").Router();

router.post("/", addReport);
router.get("/", getAllReports);
router.get("/:id", getReportById);
router.put("/:id", updateReportStatus);
router.delete("/:id", deleteReport);

module.exports = router;