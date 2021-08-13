class Match {
    constructor(data) {
        this.account_id = data.account_id
        this.deal_in_count_sum = data.deal_in_count_sum
        this.fly_count_sum = data.fly_count_sum
        this.game_count_sum = data.game_count_sum
        this.game_final_position1 = data.game_final_position1
        this.game_final_position2 = data.game_final_position2
        this.game_final_position3 = data.game_final_position3
        this.game_final_position4 = data.game_final_position4
        this.highest_lianzhuang = data.highest_lianzhuang
        this.mode = data.mode
        this.riichi_count_sum = data.riichi_count_sum
        this.ron_count_sum = data.ron_count_sum
        this.round_count_sum = data.round_count_sum
        this.score_sum = data.score_sum
        this.tsumo_count_sum = data.tsumo_count_sum
        this.win_turn_count_sum = data.win_turn_count_sum
    }
}

export default Match