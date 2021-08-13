class User {
    constructor(data) {
       this.account_id = data.account_id
       this.level4_rank = data.level4_rank
       this.level4_score= data.level4_score
       this.name = data.name
       this.nickname = data.nickname
       this.signature = data.signature
    }
}

export default User;