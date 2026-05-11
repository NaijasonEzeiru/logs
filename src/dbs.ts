// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "default",
//   password: "fJ95InwLoayE",
//   host: "ep-frosty-darkness-25058668-pooler.us-east-1.aws.neon.tech",
//   port: 5432,
//   database: "bec",
//   ssl: true,
// });

// module.exports = {
//   query: (text, params) => pool.query(text, params),
// };

import { Pool } from "pg";

const pool = new Pool({
  user: "default",
  password: "fJ95InwLoayE",
  host: "ep-frosty-darkness-25058668-pooler.us-east-1.aws.neon.tech",
  port: 5432,
  database: "bec",
  ssl: true,
});

export const query = (text: string) => pool.query(text);

console.log("connect");
