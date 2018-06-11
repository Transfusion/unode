// TODO: figure out when to just hardcode the container and when not to...

function _createPlayerInfoDiv(id, name, tripcode, avatar, isHost=false){
    var parentDiv = $('<div>').attr({
        id: `player-${id}`,
        class: 'player-thumbnail d-inline-block'
    });

    var image = $('<img>').attr({
        src: `/avatars/${avatar}`,
        class: 'img-thumbnail player-thumbnail img-responsive' + (isHost ? ' thumbnail-game-host' : ''),
        alt: 'Test'
    });

    var imgCaptionContainer = $('<div>').attr({
        class: 'caption'
    });

    var actualCaption = $('<p>').attr({
        class: 'text-center wordwrap'
    }).text(name);

    actualCaption.append($('<small>').attr({
        class: 'text-muted'
    }).text(`#${tripcode}`));

    return parentDiv.append(image).append(imgCaptionContainer.append(actualCaption));
}

/*function renderGameReadyStart(ready){
    getUserInfo().then(function(result){
        if (result.)
    })
}*/


function renderPendingGameState(players_container, pgs_msg){

/*  <div class="player-thumbnail d-inline-block">
        <img src="/avatars/1" alt="Test" class="img-thumbnail player-thumbnail thumbnail-game-host img-responsive">
            <div class="caption">
                <p class="text-center wordwrap">transfusion<small class="text-muted">#va7NhDo5YI</small></p>
            </div>
        </img>
    </div>*/
    
    players_container.empty();

    getUserInfo(pgs_msg.host).then(function(result){
        players_container.append(_createPlayerInfoDiv(result.id, result.username, result.tripcode, result.avatar, isHost=true));
        // idk why but this produces a neat spacing between the elements lol
        players_container.append('\n');
    })  

    for (var user of pgs_msg.users){
        // console.log(user);
        if (user != pgs_msg.host){
            getUserInfo(user).then(function(result){
                // console.log(result);
                // players_container.append(_createPlayerInfoDiv(result))       
                players_container.append(_createPlayerInfoDiv(result.id, result.username, result.tripcode, result.avatar, isHost=false));
                players_container.append('\n');
            })
        }
    }

    if (pgs_msg.host === window.userInfo.id){
        setRulesetFormEnabled(true);
        if (pgs_msg.isReadyToStart){
            setStartGameBtnEnabled(true);   
        }
        
    }
}

function renderPendingGameTimeout(msg){
    var minutes = Math.floor(parseInt(msg.timeout)/60);
    var seconds = parseInt(msg.timeout) - minutes * 60;
    $('#pendingGameTimeInd').text(`${minutes}:${seconds}`);
}

function setStartGameBtnEnabled(enabled=false){
    console.log(console.trace());
    $('#startGameBtn').prop('disabled', !enabled);
}

function setRulesetFormEnabled(enabled=true){
    $('#saveRulesetBtn').prop('disabled', !enabled);
}

// Updates the Ruleset settings for all users.
function renderCurrentRuleset(ruleset_msg){
    $('#ruleset-selector').val(ruleset_msg.key);
    for (let [key, obj] of Object.entries(ruleset_msg.parameters)){
        if (!(obj*1)){
            obj = obj * 1;
        }
        $(`select[name=${key}]`).val(obj);
    }
}

// precondition: if we are already submitting this form ws connection has been established and we are host...
function bindRulesetFormSubmit(){
    $('#ruleset-form').on('submit', function(data){
        event.preventDefault();
        var form = $(this);
        var formJson = objectifyForm(form.serializeArray());
        var ruleset = formJson.ruleset;
        delete formJson.ruleset;

        window.wsLocalClient.sendSetGameRuleset(window.userInfo.pendingGameId, ruleset, formJson);
    })
}


function bindStartGameBtn(){
    $('#startGameBtn').on('click', function(data){
        window.wsLocalClient.sendStartGameMessage(window.userInfo.pendingGameId);
    })
}

function renderPlayerJoin(players_container, join_pending_game_success_msg){
    getUserInfo(join_pending_game_success_msg.userId).then(function(result){
        var playerInfoDiv = _createPlayerInfoDiv(result.id, result.username, result.tripcode, result.avatar);
        players_container.append(playerInfoDiv);
    })
}

function renderPlayerLeave(players_container, msg){
    $(`#player-${msg.userId}`).remove();
}

function bindPendingGameLeaveBtn(){
    $('#leavePendingGameBtn').on('click', function(data){
        window.wsLocalClient.sendLeaveGameMessage();    
    })
}

function showLobbyModal(){
    $('#lobbyModal').modal({
        keyboard: false,
        backdrop: 'static',
        show: true
    });
}

function hideLobbyModal(){
    $('#lobbyModal').modal('hide');
}

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