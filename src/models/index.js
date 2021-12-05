import sqlite3 from 'sqlite3';
import path from 'path';
const db = new sqlite3.Database(path.resolve('cab-booking.db'));

/**
 * Method to query all items by given query
 * @param {String} sql 
 * @param {Array} params 
 * @returns {Array}
 */
function queryAll(sql, params) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        })
    })
  }

  /**
   * Method to run given query and return last row id
   * @param {String} sql 
   * @param {Array} params 
   * @returns {Integer}
   */
  function runQuery(sql, params) {
    return new Promise((resolve, reject) => {
         db.run(sql, params, function(err) {
            if (err) {
                console.log('err', err)
                reject(err);
            }
            resolve(this.lastID);
        })
    })
  }

  module.exports = {
    queryAll,
    runQuery
  }
