const { addLike, getAllLikes, getLikesByNewsId, getLikesByUserId, deleteLike } = require("../controllers/like.controller");

const router = require("express").Router();

router.post("/", addLike);
router.get("/", getAllLikes);
router.get("/:id", getLikesByNewsId);
router.put("/:id", getLikesByUserId);
router.delete("/:id", deleteLike);

module.exports = router;