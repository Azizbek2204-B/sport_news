const { addNotification, getAllNotifications, getNotificationById, updateNotification, deleteNotification } = require("../controllers/notifactions.controller");

const router = require("express").Router();

router.post("/", addNotification);
router.get("/", getAllNotifications);
router.get("/:id", getNotificationById);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);

module.exports = router;
