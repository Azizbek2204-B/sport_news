const { addUser, getAllUsers, getUserById, updateUser, deleteUser, activateUser, logoutUser, loginUser } = require("../controllers/users.controller");


const router = require("express").Router();

router.post("/", addUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.get("/activate/:link", activateUser)

module.exports = router;