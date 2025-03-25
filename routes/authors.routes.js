const { addNewAuthors, getAllAuthors, getAuthorsById, updateAuthorsById, deleteAuthorsById } = require("../controllers/authors.controller");

const router = require("express").Router();

router.post("/", addNewAuthors);
router.get("/", getAllAuthors);
router.get("/:id", getAuthorsById);
router.put("/:id", updateAuthorsById);
router.delete("/:id", deleteAuthorsById);

module.exports = router;
