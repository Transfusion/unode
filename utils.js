// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array 
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

// https://stackoverflow.com/questions/13335873/how-can-i-check-whether-a-variable-is-defined-in-node-js
function definedAndNotNull(obj){
    return ( typeof obj !== 'undefined' && obj );
}

module.exports.shuffle = shuffle;
module.exports.arraysEqual = arraysEqual;