
/*function loadUserInfo(){
    // window.userInfo = getUserInfo();
    return getUserInfo().then(function(result){
        window.userInfo = result;
        // console.log(window.userInfo);
    });
}*/

// function initProfileWidget(){
//  /*<div class="navbar-brand d-inline-block">
//         <img src="/avatars/1" width="45" height="45" class="img-thumbnail mr-2"/>
//         Gamer
//         <small class="text-muted">#jafdoasf</small>
//     </div>*/


//  profileWidget = $('<img>').attr({
//      'src': getAvatarsURL() + '/'+window.userInfo.avatar,
//      width: '45',
//      height: '45',
//      class: 'img-thumbnail mr-2'
//  });


//  $('#profile-container').append(profileWidget);
//  $('#profile-container').append(window.userInfo.username);
//  $('#profile-container').append($('<small>').attr({
//      class: 'text-muted'
//  }).text('#'+window.userInfo.tripcode));

// }



/*function loadRulesetParameters(){
    $('#ruleset-parameters-selector').empty();
    var optionSelected = $('#ruleset-selector option:selected').val();

    for (let [key, val] of Object.entries(window.rulesetInfo[optionSelected].parameters)){
        $('#ruleset-parameters-selector').append($('<label>').text(val.name))

        switch(val.type){
            case PARAMETER_TYPE.INT_PARAM:
                var selector = $('<select>').attr({
                    'name': key,
                    'class': 'form-control'
                });
                for (var i = val.lwrBound; i <= val.uprBound; i++){
                    selector.append($('<option>').val(i).text(i));
                }
                $('#ruleset-parameters-selector').append(selector);
                selector.val(val.defaultValue);
                break;
        }
    }
}
*/
function bindCreateGameFormSubmit(){
    $('#create-game-form').on('submit', function(event){
        event.preventDefault();
        var form = $(this);
        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: form.serialize()
        }).done(function(data){
            var queryParams = {
                'joinGame': data['gameId']
            }
            window.location.href = "/game?" + createQueryString(queryParams);
        }).fail(function(data){

        })
    })
}

function bindCollapsibleListElements(){
    
}

/*$(window).resize(function () { 
    spaceBelowNavbar();
});

$(window).on('load', function () { 
    spaceBelowNavbar();
});
*/

// $(document).ready(function(){
//     // spaceBelowNavbar();
    
//     getUserInfo().then(function(result){
//         window.userInfo = result;
//         initProfileWidget($('#profile-container'));
//     })

//     getRulesetInfo().then(function(result){
//         window.rulesetInfo = result;
//         populateRulesetSelector($('#ruleset-selector'));
//         loadRulesetParameters($('#ruleset-parameters-block'), $('#ruleset-selector'));
//     })

//     /*$('#wsLostConnectionModal').modal({
//         keyboard: false,
//         backdrop: 'static',
//         show: true
//     });*/
    
//     bindCreateGameFormSubmit();
    
// });

/*$(window).on('load', function () { 
    spaceBelowNavbar();
});*/

require(['game_browser_wsclient'], function(game_browser_wsclient){

    function _initWSClient(){
        $.get('/api/ws_token').done(function(data){
            if ('token' in data){
                window.wsLocalClient = new game_browser_wsclient.WSLocalClient(data['token']);
            }
            else {
                console.log(data);    
            }
        }).fail(function(data){
            console.log('failed to obtain ws token');
        })
    }

    require(['domReady'], function(domReady){

        
        getUserInfo().then(function(result){
            window.userInfo = result;
            initProfileWidget($('#profile-container'));
        }).catch(e => {
            console.log(e);
        })

        getRulesetInfo().then(function(result){
            window.rulesetInfo = result;
            populateRulesetSelector($('#ruleset-selector'));
            loadRulesetParameters($('#ruleset-parameters-block'), $('#ruleset-selector'));
        })

        /*$('#wsLostConnectionModal').modal({
            keyboard: false,
            backdrop: 'static',
            show: true
        });*/
        
        bindCreateGameFormSubmit();

        $(window).resize(function() {
            spaceBelowNavbar();
        });


        // TODO: solve this problem
        spaceBelowNavbar();
        _initWSClient();
    })
});