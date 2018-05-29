
function showReconnectingModal(){
	$('#wsLostConnectionModal').modal({
        keyboard: false,
        backdrop: 'static',
        show: true
    });
}

function hideReconnectingModal(){
	$('#wsLostConnectionModal').modal('hide');
}


// we are trying to smoothly update the UI
function pendingGameListCb(pending_game_ids){
	if (pending_game_ids.length){
		$('#no_pending_games_lbl').hide()
	}
	else {
		$('#no_pending_games_lbl').show()
	}

	var all_games = $("[id^='pending-game']");
	for (let id of pending_game_ids){
		// console.log(id)
		all_games = all_games.not($(`[id^='pending-game-${id}']`));
	}
	// console.log(all_games)
	all_games.remove();
}

function _renderRulesetParamSpan(ruleset_key, param_key, val){
	return $('<span>').attr({
				name: param_key
			}).text( `${window.rulesetInfo[ruleset_key].parameters[param_key].name}: ${val}`)
}

function renderPendingGame(pending_game_state_msg, pending_game_ruleset_msg){
	var pending_game_dom_prefix = `#pending-game-${pending_game_state_msg.pendingGameId}`;

	// console.log($(`${pending_game_dom_prefix}`).length);
	// if has already been updated before, we don't want to close the join game dialog box
	if ($(`${pending_game_dom_prefix}`).length){
		console.log('delta upd');
		$(`${pending_game_dom_prefix} h5`).text(pending_game_ruleset_msg.key);
		$(`${pending_game_dom_prefix} span`).text(pending_game_state_msg.timeout+ ' to go');

		// update list of players
		// $(`${pending_game_dom_prefix} img`).remove();

		var list_elem_flexbox = $(`${pending_game_dom_prefix} .d-flex`);

		// only one user can be in one game at one time, whether playing or spectating!
		var imgs_selector = $(`${pending_game_dom_prefix} img`);
		for (let userId of pending_game_state_msg.users){

			if ($(`#user-icon-${userId}`).length){
				imgs_selector = imgs_selector.not($(`#user-icon-${userId}`));
			}
			else {
				getUserInfo(userId).then(function(result){
				list_elem_flexbox.append(
						$('<img>').attr({
							id: `user-icon-${userId}`,
							class: ((result.id === pending_game_state_msg.host) 
								? 'p-2 rounded pending-game-avatar pending-game-host-avatar border-dark' 
								: 'p-2 rounded pending-game-avatar border-dark'),
							src: `/avatars/${result.avatar}`
						})
					)
				})
			}
		}

		// remove all the other players who have left
		imgs_selector.remove();

		// delta update the parameters info
		var params_info_spans = $(`pending-game-${pending_game_state_msg.pendingGameId}-dropdown`);

		for (let [key, obj] of Object.entries(pending_game_ruleset_msg.parameters)){
			// console.log(`#pending-game-${pending_game_state_msg.pendingGameId}-dropdown span[name=${key}]`);
			// console.log($(`#pending-game-${pending_game_state_msg.pendingGameId}-dropdown span[name=${key}]`));
			if ( $(`#pending-game-${pending_game_state_msg.pendingGameId}-dropdown span[name=${key}]`).length ){
				// console.log('jancok')
				$(`#pending-game-${pending_game_state_msg.pendingGameId}-dropdown span[name=${key}]`).text(
					window.rulesetInfo[pending_game_ruleset_msg.key].parameters[key].name +": " +obj
				);
				params_info_spans = params_info_spans.not( $(`#pending-game-${pending_game_state_msg.pendingGameId}-dropdown span[name=${key}]`) );
			}
			else {
				$(`#pending-game-${pending_game_state_msg.pendingGameId}-dropdown`).append(
					_renderRulesetParamSpan(pending_game_ruleset_msg.key, key, obj));
			}
			// $(`pending-game-${pending_game_state_msg.pendingGameId}-dropdown span[name=${key}]`)
		}

		params_info_spans.remove();

	}
	else {
		var main_list_element = $("<li>").attr({
			id: `pending-game-${pending_game_state_msg.pendingGameId}`,
			class: 'list-group-item',
			'data-toggle': 'collapse',
			'data-target': `#pending-game-${pending_game_state_msg.pendingGameId}-dropdown`,
		})

		var list_elem_flexbox = $('<div>').attr({class: 'd-flex w-100 justify-content-between flex-wrap align-items-center'});

		var rules_and_time_section = $('<div>').attr({class: 'mr-auto'});

		rules_and_time_section.append(
			$('<h5>').attr({
				class: 'd-inline'
			}).text(pending_game_ruleset_msg.key)
		);

		rules_and_time_section.append(
			$('<span>').attr({
				class: 'text-muted',
				style: 'margin-left: 1em'
			}).text(pending_game_state_msg.timeout+ ' to go')
		);

		list_elem_flexbox.append(rules_and_time_section);

		for (let userId of pending_game_state_msg.users){
			getUserInfo(userId).then(function(result){
				list_elem_flexbox.append(
					$('<img>').attr({
						id: `user-icon-${userId}`,
						class: ((result.id === pending_game_state_msg.host) 
							? 'p-2 rounded pending-game-avatar pending-game-host-avatar border-dark' 
							: 'p-2 rounded pending-game-avatar border-dark'),
						src: `/avatars/${result.avatar}`
					})
				)
			})
		}

		main_list_element.append(list_elem_flexbox);
		// $(`[id^=pending-game-${pending_game_state_msg.pendingGameId}]`).remove();
		
		$('#pendingGamesContainer').append(main_list_element);

		// now render the dropdown
		var dropdown_container = $('<div>').attr({
			id: `pending-game-${pending_game_state_msg.pendingGameId}-dropdown`,
			class: 'bg-light list-group-item collapse'
		})

		var dropdown_flexbox = $('<div>').attr({
			class: 'd-flex align-items-center flex-wrap'
		});

		var params_info_div = $('<div>').attr({
			class: 'params-info'
		});

		var num_params = Object.keys(pending_game_ruleset_msg.parameters).length;
		var params_entries = Object.entries(pending_game_ruleset_msg.parameters);
		for (var i = 0; i < num_params; i++){
			// players, rounds, etc
			var [key, val] = params_entries[i];

			params_info_div.append(_renderRulesetParamSpan(pending_game_ruleset_msg.key, key, val));
			if (i != num_params-1){
				params_info_div.append($('<hr>'))
			}
		}

		dropdown_flexbox.append(params_info_div);
		dropdown_flexbox.append(
			$('<a>').attr({
				role: 'button',
				class: 'btn btn-primary ml-auto',
				href: `game?joinGame=${pending_game_state_msg.pendingGameId}`
			}).text('Join')
		);
		dropdown_container.append(dropdown_flexbox);

		$('#pendingGamesContainer').append(dropdown_container);


	}

	
}


define({
	showReconnectingModal: showReconnectingModal,
	hideReconnectingModal: hideReconnectingModal,
	/*renderPendingGamesList: renderPendingGamesList,
	renderPendingGameState: renderPendingGameState,*/
	pendingGameListCb: pendingGameListCb,
	renderPendingGame: renderPendingGame
})