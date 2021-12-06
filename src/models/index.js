import sqlite3 from 'sqlite3';
import path from 'path';
import { DB_FILE } from '../config/db';
import logger from '../utils/logger';
export default class DbModel {
    constructor() {
        this.db = new sqlite3.Database(path.resolve(DB_FILE));
    }
    /**
     * Method to query all items by given query
     * @param {String} sql
     * @param {Array} params
     * @returns {Array}
     */
    queryAll(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    logger.error(err);
                    return reject(err);
                }
                return resolve(rows);
            });
        });
    }

    /**
     * Method to run given query and return last row id
     * @param {String} sql
     * @param {Array} params
     * @returns {Integer}
     */
    runQuery(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    logger.error('err', err);
                    return reject(err);
                }
                return resolve(this.lastID);
            });
        });
    }

    /**
     * Method to run query and return affected row
     * @param {String} sql
     * @param {Array} params
     * @returns {Object}
     */
    getQuery(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, function (err, row) {
                if (err) {
                    logger.error('err', err);
                    return reject(err);
                }
                return resolve(row);
            });
        });
    }
}
