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
router.use("/authors", require("./authors.routes"))
router.use("/new_tags", require("./new_tags.routes"))
router.use("/notifaction", require("./new_tags.routes"))
router.use("/views", require("./views.routes"))
router.use("/opt", require("./otp.routes"))

module.exports=router