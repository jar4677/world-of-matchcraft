/**
 * Created by jar4677 on 4/29/16.
 */

//DOCUMENT READY FOR EVENT HANDLERS
$(document).ready(function () {
    
    
});

//CONSTRUCTOR FOR GAME BOARD
/*TODO             numCards needs to be 1/2 the total              TODO*/
function GameBoard(numCards, type) {
    var self = this;
    var charArray = [];
    self.type = type;
}

//Method To Prep Characters
GameBoard.prototype.prepCharacters = function () {
    var localArray = [];
    for (var x in spells) {
        localArray.push(x);
    }
    for (var i = 0; i < numCards; i++) {
        var index = Math.floor((Math.random() * localArray.length - 1) + 1);
        charArray.push(localArray[index], localArray[index]);
        localArray.splice(index, 1);
    }
};

//Method To Generate Cards
GameBoard.prototype.createCards = function () {
    for (var i = 0; i < numCards; i++) {
        
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