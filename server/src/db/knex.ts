import knex from "knex";
// @ts-ignore
import config from "../../knexfile";

const db = knex(config.development);

export default db;
