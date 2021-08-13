const { createMajsoulConnection, fetchLatestDataDefinition } = require("./majsoul");
const FRIEND_ACCOUNTS = require("./friends");

class MahjongSoulDriver {
  constructor(){
    this._conn = null;
  }
  async connect() {
    if (this._conn) {
      return;
    }
    this._conn = await createMajsoulConnection();
    if (!this._conn) {
      throw "connection failed!"
    }
  }
  disconnect() {
    this._conn.close();
    this._conn = null;
  }
  /**
   * Fetch account info
   * @param {number} accountId
   * @return {Promise ResFetchAccountInfo}  
   */
  async fetchAccountInfo(accountId) {
    let count = 0;
    while(count < 10) {
      try {
        const resFetchAccountInfo = this._conn.rpcCall(".lq.Lobby.fetchAccountInfo", {
          account_id: accountId
        });
        return resFetchAccountInfo;
      } catch(e){
        console.log(accountId + " fetchAccountInfo error: " + e);
      } finally {
        count++;
      }
    }
    return undefined;
  }
  /**
   * Fetch account info
   * @param {number} accountId
   * @param {number} mode It Whether it's East game(동장전) or South 
   * 		game(남장전). It should be set to 1 to fetch East game, 2
   * 		to fetch South game.
   * @return {ResFetchAccountInfo}  
   */
  async fetchAccountFriendGameStatistics(accountId, mode) {
    let count = 0;
    while(count < 10) {
      try {
        const resFetchAccountStatisticInfo = await this._conn.rpcCall(
          ".lq.Lobby.fetchAccountStatisticInfo", { account_id: accountId });
        const friendGameStatistics = 
          resFetchAccountStatisticInfo["detail_data"]["friend_room_statistic"]["game_mode"];
        if (!friendGameStatistics){
          return {Error: "Empty friend games"};
        }
        for (var i = 0; i < friendGameStatistics.length; i++) {
          if (friendGameStatistics[i]["mode"] == mode) {
            return friendGameStatistics[i];
          }
        }
        return {Error: "Not existing mode."};
      } catch(e) {
        console.log(accountId + " fetchAccountFriendGameStatistics error: " + e);
      } finally {
        count++;
      }
    }
  }
  /**
   * Fetch account info
   * @param {number} accountId
   * @param {number} mode It Whether it's East game(동장전) or South 
   * 		game(남장전). It should be set to 1 to fetch East game, 2
   * 		to fetch South game.
   * @return {ResFetchAccountInfo}  
   */
  async fetchAll() {
    let res = [];
    const players = FRIEND_ACCOUNTS;
    for (var i = 0; i < players.length; i++) {
      const player = players[i];
      let data = {};
      data["account_id"] = player["account_id"];
      data["name"] = player["name"];
      data["nickname"] = player["nickname"];

      data["resFetchAccountInfo"] = await this.fetchAccountInfo(player["account_id"]);
      data["resFriendGameEastGameStatistics"] = 
        await this.fetchAccountFriendGameStatistics(player["account_id"], 1);
      data["resFriendGameSouthGameStatistics"] = 
        await this.fetchAccountFriendGameStatistics(player["account_id"], 2);
      res.push(data);
    }
    return res;
  }

  /**
   * Get friend accounts
   * @return {Array}  
   */
  getFriendAccounts() {
    return FRIEND_ACCOUNTS;
  }
}

exports.MahjongSoulDriver = MahjongSoulDriver;
exports.FRIEND_ACCOUNTS = FRIEND_ACCOUNTS;
