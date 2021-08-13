const assert = require("assert");
const sqlite3 = require('sqlite3').verbose();
const util = require('util');
const { MahjongSoulDriver } = require('./mahjong_soul_driver');

const DBSOURCE = "db.sqlite"

function safe_find(arr, type) {
  const ret = arr.find(x => x.type === type);
  if (ret == undefined) {
    return 0;
  }
  return ret["sum"];
}

class Database {
  constructor(sync){
    this._db = new sqlite3.Database(DBSOURCE, (err) => {
      if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
      } else {
        console.log('Connected to the SQLite database.');
        this._db.run = util.promisify(this._db.run);
        this._db.get = util.promisify(this._db.get);
        this._db.all = util.promisify(this._db.all);
        if (sync) {
          this._prepareDB();
        }
      }
    });
  }

  async getUserInfo(accountId) {
    const sql = "select * from user where account_id = ?";
    const params = [accountId];
    const rows = await this._db.get(sql, params);
    return rows;
  }

  async getAllUserInfo() {
    const sql = "select * from user";
    const rows = await this._db.all(sql, []);
    return rows;
  }

  async getUserStat(accountId, mode) {
    const sql = "select * from stat where account_id = ? and mode = ?";
    const params = [accountId ,mode];
    const rows = await this._db.get(sql, params);
    return rows;
  }

  async getAllUserStat(mode) {
    const sql = "select * from stat where mode = ?";
    const params = [mode];
    const rows = await this._db.all(sql, params);
    return rows;
  }

  async refreshUserInfo() {
    let driver = new MahjongSoulDriver();
    await driver.connect();
    await this._loadAllAccountsInfo(driver);
    driver.disconnect();
  }

  async refreshUserStat() {
    let driver = new MahjongSoulDriver();
    await driver.connect();
    await this._loadAllAccountsStats(driver);
    driver.disconnect();
  }

  async _prepareDB() {
    let driver = new MahjongSoulDriver();
    await driver.connect();

    await this._db.run(`CREATE TABLE IF NOT EXISTS user (
                account_id INTEGER PRIMARY KEY NOT NULL,
                name text NOT NULL, 
                nickname text NOT NULL,
                signature text, 
                level4_rank INTEGER,
                level4_score INTEGER
                )`);
    await this._loadAllAccountsInfo(driver);
    await this._db.run(`CREATE TABLE IF NOT EXISTS stat (
              account_id INTEGER NOT NULL,
              mode TEXT,
              game_count_sum INTEGER,
              fly_count_sum INTEGER,
              game_final_position1 INTEGER,
              game_final_position2 INTEGER,
              game_final_position3 INTEGER, 
              game_final_position4 INTEGER, 
              deal_in_count_sum INTEGER,
              ron_count_sum INTEGER,
              tsumo_count_sum INTEGER,
              round_count_sum INTEGER,
              score_sum INTEGER,
              riichi_count_sum INTEGER,
              win_turn_count_sum INTEGER,
              highest_lianzhuang INTEGER,
              CONSTRAINT stat_primary_key primary key(account_id, mode)
              )`);
    await this._loadAllAccountsStats(driver);
    driver.disconnect();
  }

  async _loadAllAccountsStats(driver) {
    const accounts = driver.getFriendAccounts();
    for (let i = 0; i < accounts.length; i++){
      let account = accounts[i];

      console.log(account);
      const modes = ["", "East", "South"];
      for (let mode = 1; mode < modes.length; mode++){
        const res =
          await driver.fetchAccountFriendGameStatistics(account.account_id, mode);
        let insert =
          `INSERT OR REPLACE INTO stat (
        account_id, 
        mode, 
        game_count_sum, 
        fly_count_sum, 
        game_final_position1, 
        game_final_position2, 
        game_final_position3, 
        game_final_position4, 
        deal_in_count_sum, 
        ron_count_sum, 
        tsumo_count_sum, 
        round_count_sum, 
        score_sum, 
        riichi_count_sum, 
        win_turn_count_sum, 
        highest_lianzhuang) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;


        let data;
        if ("Error" in res) {
          data = [
            account["account_id"], 
            modes[mode], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
          ];
        } else {
          data = [
            account["account_id"], 
            modes[mode],
            res["game_count_sum"],
            res["fly_count"],
            res["game_final_position"][0],
            res["game_final_position"][1],
            res["game_final_position"][2],
            res["game_final_position"][3],
            safe_find(res["round_end"], 4), //deal in
            safe_find(res["round_end"], 3), // ron
            safe_find(res["round_end"], 2), // tsumo
            res["round_count_sum"],
            res["dadian_sum"],
            res["liqi_count_sum"],
            res["xun_count_sum"],
            res["highest_lianzhuang"]
          ];
        }
        await this._db.run(insert, data);
      }
    }
    console.log("Stat table is refreshed!");
  }

  async _loadAllAccountsInfo(driver) {
    const accounts = driver.getFriendAccounts();
    for (let i = 0; i < accounts.length; i++){
      let account = accounts[i];

      console.log(account);
      const res = await driver.fetchAccountInfo(account.account_id);
      let insert =
        'INSERT OR REPLACE INTO user (account_id, name, nickname, signature, level4_rank, level4_score) VALUES (?, ?, ?, ?, ?, ?)';
      const resAccount = res["account"];
      assert(account.account_id == resAccount["account_id"]);

      const data = [
        account["account_id"], 
        account["name"],
        resAccount["nickname"],
        resAccount["signature"],
        resAccount["level"]["id"] % 1000,
        resAccount["level"]["score"],
      ];

      await this._db.run(insert, data);
    }
    console.log("User table is refreshed!");
  }
}

module.exports = Database 
