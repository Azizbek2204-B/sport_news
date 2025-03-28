const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");
const JwtService = require("../services/jwt.service");
const config = require('config');
const DeviceDetector = require('node-device-detector');
const DeviceHelper = require('node-device-detector/helper');
const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
  deviceTrusted: false,
  deviceInfo: false,
  maxUserAgentSize: 500,
});

const addUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role,
      is_active,
      created_at,
      interests,
      bookmarks,
    } = req.body;

    const newUser = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role, is_active, created_at, interests, bookmarks) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        first_name,
        last_name,
        email,
        password,
        role,
        is_active,
        created_at,
        interests,
        bookmarks,
      ]
    ); 

    res
      .status(201)
      .send({
        message: "Yangi foydalanuvchi qo'shildi",
        user: newUser.rows[0],
      });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"]
    // console.log(userAgent);
    const result = detector.detect(userAgent);
    console.log("result", result);
    console.log(DeviceHelper.isDesktop(result));
    const results = await pool.query(
      "SELECT * FROM users ORDER BY created_at DESC"
    );
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const results = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (results.rows.length === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res.send(results.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      first_name,
      last_name,
      email,
      password,
      role,
      is_active,
      interests,
      bookmarks,
    } = req.body;

    const update = await pool.query(
      `UPDATE users SET first_name=$1, last_name=$2, email=$3, password=$4, role=$5, is_active=$6, 
       interests=$7, bookmarks=$8 WHERE id=$9 RETURNING *`,
      [
        first_name,
        last_name,
        email,
        password,
        role,
        is_active,
        interests,
        bookmarks,
        id,
      ]
    );

    if (update.rowCount === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res
      .status(200)
      .send({
        message: "Foydalanuvchi muvaffaqqiyatli yangilandi",
        user: update.rows[0],
      });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const del = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [
      id,
    ]);

    if (del.rowCount === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res
      .status(200)
      .send({ message: "Foydalanuvchi muvaffaqqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).send({ message: "Email yoki parol noto'g'ri1" });
    }
    const validPassword = password === user.rows[0].password;
    if (!validPassword) {
      return res.status(400).send({ message: "Email yoki parol noto'g'ri" });
    }    

    const payload = { id: user.rows[0].id, email: user.rows[0].email };
    const tokens = JwtService.generateTokens(payload);

    // await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
    //   tokens.refreshToken,
    //   user.rows[0].id,
    // ]);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.send({
      message: "Tizimga hush kelibsiz",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Cookie da refresh token mavjud emas" });
    }

    const user = await pool.query("UPDATE users SET refresh_token = NULL WHERE refresh_token = $1 RETURNING *", [
      refreshToken,
    ]);

    if (user.rowCount === 0) {
      return res.status(400).send({ message: "Bunday tokenli foydalanuvchi topilmadi" });
    }

    res.clearCookie("refreshToken");
    res.send({ message: "Foydalanuvchi tizimdan chiqdi" });
  } catch (error) {
    errorHandler(error, res);
  }
};


const activateUser = async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE activation_link = $1", [
      req.params.link,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    await pool.query("UPDATE users SET is_active = true WHERE activation_link = $1", [
      req.params.link,
    ]);

    res.send({ message: "Foydalanuvchi faollashtirildi", status: true });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  activateUser
};
