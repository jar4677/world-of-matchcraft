/**
 * Created by jar4677 on 4/29/16.
 */

//DOCUMENT READY FOR EVENT HANDLERS
$(document).ready(function () {
    var gameBoard = new GameBoard(1);
    gameBoard.createCardObjs(18);
    
});

//CONSTRUCTOR FOR GAME BOARD
/*TODO             numCards needs to be 1/2 the total              TODO*/
function GameBoard(players) {
    this.charArray = [];
    this.cards = [];
    this.players = players;
    this.state = 'none';
}

//Method To Generate Cards
GameBoard.prototype.createCardObjs = function (numCards) {
    this.prepCharacters(numCards);
    for (var i = 0; i < numCards; i++) {
        var index = Math.floor((Math.random() * this.charArray.length - 1) + 1);
        var character = new Character(this.charArray[index]);
        this.charArray.splice(index, 1);
        var domObj = this.createDOMObj(character);
        var newCard = new Card(domObj , character);
        this.cards.push(newCard);
    }
};

//Method To Prep Characters
GameBoard.prototype.prepCharacters = function (numCards) {
    var localArray = [];
    for (var x in spells) {
        localArray.push(x);
    }
    for (var i = 0; i < (numCards / 2); i++) {
        var index = Math.floor((Math.random() * localArray.length - 1) + 1);
        this.charArray.push(localArray[index], localArray[index]);
        localArray.splice(index, 1);
    }
};

//Method To Generate DOM Objects
GameBoard.prototype.createDOMObj = function (character) {
    var card = $("<div>").addClass('card');
    var front = $("<div>").addClass('front');
    var frontImg = $("<img>").attr('src', "images/" + character.name + ".jpg");
    var back = $("<div>").addClass('back down');
    var backImg = $("<img>").attr('src', "images/card-back-1.jpg");

    $(front).append(frontImg);
    $(back).append(backImg);
    $(card).append(front, back);
    $("#game-area").append(card);

    return $(card);
};

//Method To Handle Clicks
GameBoard.prototype.cardClicked = function () {
    if (this.state == 'none'){
        
    }
};

//Method To Clear Cards
GameBoard.prototype.clearCards = function () {
    
};

//CONSTRUCTOR FOR CARDS
function Card(element, character) {
    this.element = element;
    this.character = character;
    this.state = 'down';
}



//CONSTRUCTOR FOR CHARACTERS
function Character(name) {
    this.name = name;
    this.spell = spells[this.name];
    this.emote = emotes[this.name];
}

//OBJECTS FOR ASSETS
var emotes = {
    bayliana: "http://wow.zamimg.com/wowsounds/539260",
    kiggo: "http://wow.zamimg.com/wowsounds/541435",
    morit: "http://wow.zamimg.com/wowsounds/542787",
    eijaal: "http://wow.zamimg.com/wowsounds/543040",
    kachall: "http://wow.zamimg.com/wowsounds/541404",
    xail: "http://wow.zamimg.com/wowsounds/539166",
    kiggar: "http://wow.zamimg.com/wowsounds/541389",
    meltheir: "http://wow.zamimg.com/wowsounds/539228",
    kashu: "http://wow.zamimg.com/wowsounds/541391"
};

var spells = {
    bayliana: "http://wow.zamimg.com/wowsounds/569763",
    kiggo: "http://wow.zamimg.com/wowsounds/568524",
    morit: "http://wow.zamimg.com/wowsounds/569138",
    eijaal: "http://wow.zamimg.com/wowsounds/569357",
    kachall: "http://wow.zamimg.com/wowsounds/568049",
    xail: "http://wow.zamimg.com/wowsounds/568585",
    kiggar: "http://wow.zamimg.com/wowsounds/569423",
    meltheir: "http://wow.zamimg.com/wowsounds/569675",
    kashu: "http://wow.zamimg.com/wowsounds/569079"
};