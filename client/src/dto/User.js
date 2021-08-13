import Match from './Match'

class User {
    constructor(userData, eastStats, SouthStats) {
       this.account_id = userData.account_id
       this.level4_rank = userData.level4_rank
       this.level4_score= userData.level4_score
       this.name = userData.name
       this.nickname = userData.nickname
       this.signature = userData.signature
       this.match_east = new Match(eastStats)
       this.match_south = new Match(SouthStats)
    }
}

export default User;