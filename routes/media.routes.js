const { addNewMedia, getAllMedia, getMediaById, updateMediaById, deleteMediaById } = require("../controllers/media.controller");

const router = require("express").Router();

router.post("/", addNewMedia);
router.get("/", getAllMedia);
router.get("/:id", getMediaById);
router.put("/:id", updateMediaById);
router.delete("/:id", deleteMediaById);

module.exports = router;