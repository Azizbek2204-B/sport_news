const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewLang = async (req, res) => {
  try {
    const { name, lang_code } = req.body;
    const newLang = await pool.query(
      `INSERT INTO languages(name ,code)
        VALUES ($1, $2) RETURNING *
        `,
      [name, lang_code]
    );
    console.log(newLang);
    console.log(newLang.rows[0]);
    res
      .status(201)
      .send({ message: "Yangi til qo'shildi", lang: newLang.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};
const getALLlanguagestypes = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM languages");
    res.send(results.rows[0]);
  } catch (error) {
    errorHandler(error, res);
    res.send("Malumot olishda xatolik");
  }
};
const getALLlanguagesById = async (req, res) => {
  try {
    const id = req.params.id;
    const results = await pool.query(`SELECT * FROM languages where id=${id}`);
    res.send(results.rows[0]);
  } catch (error) {
    console.log(error);
    res.send("Malumot olishda xatolik");
  }
};
const Updatelangstypes = async (req, res) => {
  const { name, lang_code } = req.body;
  const id = req.params.id;
  const update = await pool.query(
    `UPDATE languages set name=$1,lang_code=$2 where id=${id}`,
    [name, lang_code]
  );
  res.status(201).send({ message: "Malumotlar muvaffaqqiyatli yangilandi" });
};
const deletelangstypes = async (req, res) => {
  const id = req.params.id;
  await pool.query(`DELETE FROM languages where id=${id}`);
  res.status(201).send({ message: "Malumotlar muvaffaqqiyatli o'chirildi" });
};

module.exports = {
  addNewLang,
  getALLlanguagestypes,
  getALLlanguagesById,
  Updatelangstypes,
  deletelangstypes
};
