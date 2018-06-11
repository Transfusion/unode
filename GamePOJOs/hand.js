// represents a hand of cards as if the player was holding them

class Hand {
	constructor(){
		this.cards = [];
	}

	takeNth(nth){
		var card = this.cards[nth];
		this.cards.splice(nth, 1);
		return card;
	}

	addCard(card){
		this.cards.push(card);
	}

	get isUno(){
		return this.cards.length == 1;
	}

	get isEmpty(){
		return this.cards.length == 0;
	}

	get numberOfCards(){
		return this.cards.length;
	}

	// so the user can rearrange their cards
	// https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
	rearrange(from, to){
		this.cards.splice(to, 0, this.cards.splice(from, 1)[0]);
	}

	toJSON(){
		return {
			isUno: this.isUno,
			isEmpty: this.isEmpty,
			cards: this.cards
		}
	}
}

module.exports.Hand = Hand;