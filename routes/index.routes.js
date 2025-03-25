const router=require("express").Router()

router.use("/tags", require("./tags.routes"));
router.use("/category", require("./category.routes"));
router.use("/news", require("./news.routes"));
router.use("/news_with_langs", require("./news_with_langs.routes"));
router.use("/users", require("./users.routes"));
router.use("/langs", require("./langs.routes"))
router.use("/comment", require("./comment.routes"))
router.use("/like", require("./like.routes"))
router.use("/media", require("./media.routes"))
router.use("/report", require("./report.routes"))

module.exports=router