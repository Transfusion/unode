class CommsClientInterface {

    constructor(){
        if (new.target === CommsClientInterface){
            throw new TypeError('CommsClient is an abstract class');
        }
    }

    get clientType(){
        throw new TypeError('CommsClient is an abstract class');
    }   

    /*get userObj(){
        throw new TypeError('CommsClient is an abstract class');
    }*/

    sendMessage(msg){
        throw new TypeError('CommsClient is an abstract class');    
    }

    onDisconnect(){
        throw new TypeError('CommsClient is an abstract class');    
    }

}

module.exports = CommsClientInterface;