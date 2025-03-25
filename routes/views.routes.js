const { addView, getAllViews, getViewById, updateView, deleteView } = require("../controllers/views.controller");

const router = require("express").Router();

router.post("/", addView);
router.get("/", getAllViews);
router.get("/:id", getViewById);
router.put("/:id", updateView);
router.delete("/:id", deleteView);

module.exports = router;