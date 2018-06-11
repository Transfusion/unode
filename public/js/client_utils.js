function getBaseURL(){
    return window.location.protocol + "//" + window.location.hostname + 
                    (window.location.port ? ':' + window.location.port: '');
}

function getBaseWSURL(){
    return 'ws://' + window.location.hostname + 
                    (window.location.port ? ':' + window.location.port: '');
}

function getAvatarsURL(){
    return getBaseURL() + '/avatars'
}

/*function getUserInfo(){
    var x;
    $.get("/api/user_info", function(data){
        x = data;
    });
    console.log(x);
    return x;
}*/

// depends on window.userInfo to be populated.
function initProfileWidget(container){

    profileWidget = $('<img>').attr({
        'src': getAvatarsURL() + '/'+window.userInfo.avatar,
        width: '45',
        height: '45',
        class: 'img-thumbnail mr-2'
    });


    container.append(profileWidget);
    container.append(window.userInfo.username);
    container.append($('<small>').attr({
        class: 'text-muted'
    }).text('#'+window.userInfo.tripcode));

}

function populateRulesetSelector(selector_parent){
    for (let [key, val] of Object.entries(window.rulesetInfo)){
        var optionDomElement = $('<option>').text(key);
        selector_parent.append(optionDomElement);
    }
}


function loadRulesetParameters(selector_block, selector_parent){
    selector_block.empty();
    // var optionSelected = $('#ruleset-selector option:selected').val();
    var optionSelected = selector_parent.find('option:selected').val();

    for (let [key, val] of Object.entries(window.rulesetInfo[optionSelected].parameters)){
        selector_block.append($('<label>').text(val.name))

        switch(val.type){
            case PARAMETER_TYPE.INT_PARAM:
                var selector = $('<select>').attr({
                    'name': key,
                    'class': 'form-control'
                });
                for (var i = val.lwrBound; i <= val.uprBound; i++){
                    selector.append($('<option>').val(i).text(i));
                }
                selector_block.append(selector);
                selector.val(val.defaultValue);
                break;
        }
    }
}


function spaceBelowNavbar(){
    $('body').css('padding-top', parseInt($('#main-navbar').height()) + 40);
}

function getUserInfo(id=""){
    return new Promise(function(resolve, reject){
        $.get(`/api/user_info/${id}`).done(resolve).fail(reject);
    })
}

function getRulesetInfo(){
    return new Promise(function(resolve, reject){
        $.get('/api/rulesets').done(resolve).fail(reject);
    })
}

function getAvatarsInfo(){
    return new Promise(function(resolve, reject){
        $.get(getAvatarsURL()).done(resolve).fail(reject);
    })
}

var PARAMETER_TYPE = {
    INT_PARAM: 1,
    FLOAT_PARAM: 2,
    STRING_PARAM: 3
}

// https://stackoverflow.com/questions/316781/how-to-build-query-string-with-javascript
function createQueryString(params){
    var esc = encodeURIComponent;
    var query = Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&'); 
    return query;
}

// https://stackoverflow.com/questions/1184624/convert-form-data-to-javascript-object-with-jquery
function objectifyForm(formArray) {//serialize data function

    var returnArray = {};
    for (var i = 0; i < formArray.length; i++){
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}

// used in simulating synchronous websocket calls
function uniqueString(){
    return (new Date()).getTime() + Math.random().toString(36).substring(2, 15)
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
// Required for FF 46!
if (!Object.entries){
    Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
    };
}

function definedAndNotNull(obj){
    return ( typeof obj !== 'undefined' && obj );
}

function createErrorMessageModal(heading="error", error_msg){

}

const HEARTBEAT_INTERVAL = 5000;
const MAX_MISSED_HEARTBEATS = 4;
const RECONNECT_WAIT_INTERVAL = 2000;