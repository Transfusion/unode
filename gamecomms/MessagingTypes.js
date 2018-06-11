var OUTGOING_MESSAGE_TYPE = {
	PENDING_GAMES_LIST: 'pending_games_list',

	JOIN_PENDING_GAME_SUCCESS: 'join_pending_game_success',
	JOIN_PENDING_GAME_FAILED: 'join_pending_game_failed',

	LEAVE_PENDING_GAME_SUCCESS: 'leave_pending_game_success',
	LEAVE_PENDING_GAME_FAILED: 'leave_pending_game_failed',

	// synchronous option
	PENDING_GAME_STATE: 'pending_game_state',
	// synchronous option
	PENDING_GAME_RULESET: 'pending_game_ruleset',

	// when a pending game is destroyed without having started a full game
	PENDING_GAME_DESTROYED: 'pending_game_destroyed',

	HEARTBEAT_CLIENT_PONG: 'heartbeat_client_pong',

	PENDING_GAME_READY_START_STATUS: 'pending_game_ready_start_status',

	PENDING_GAME_TIMEOUT: 'pending_game_timeout',


	GAME_START: 'game_start',
	USER_GAME_STATE: 'user_game_state',
	UNO: 'uno'
}


module.exports = OUTGOING_MESSAGE_TYPE;