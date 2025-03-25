const { addNewsTag, getAllNewsTags, getNewsTagById, updateNewsTag, deleteNewsTag } = require("../controllers/new_tags.controller");

const router = require("express").Router();

router.post("/", addNewsTag);
router.get("/", getAllNewsTags);
router.get("/:id", getNewsTagById);
router.put("/:id", updateNewsTag);
router.delete("/:id", deleteNewsTag);

module.exports = router;
