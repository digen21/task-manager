require("dotenv/config");
const mysql = require("mysql");

const setupDb = () => {
  const {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE,
  } = process.env;

  const connection = new mysql.createConnection({
    host: DATABASE_HOST,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    port: DATABASE_PORT,
  });

  connection.connect();

  console.log("Init database setup.");
  connection.query(`DROP DATABASE IF EXISTS ${DATABASE};`);
  connection.query(`CREATE DATABASE ${DATABASE};`);
  console.log("Database created.");
  connection.end();
};

setupDb();
