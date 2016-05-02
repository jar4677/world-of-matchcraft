/**
 * Created by jar4677 on 4/29/16.
 */

//DOCUMENT READY FOR EVENT HANDLERS
$(document).ready(function () {
    //things to do when the page loads
    //set up game board
    var gameBoard = new GameBoard(1);
    gameBoard.createCardObjs(18);
    gameBoard.player.displayStats();
    
    //start music
    gameBoard.setVolume();
    // $("#background_music_player")[0].play();
    
    
    //CLICK HANDLERS
    $("#game-area").on("click", ".card", gameBoard.cardClicked);
    $("#reset").click(gameBoard.reset);
    $(".slider").on("change", gameBoard.setVolume);
    $("#settings").click(function () {
        $("#settings-background").addClass('settings-open');
    });
    $("#settings-window").find(".button").click(function () {
        $("#settings-background").removeClass('settings-open');
    });
});

//CONSTRUCTOR FOR GAME BOARD
function GameBoard(players) {
    // var self = this;
    this.charArray = [];
    this.cards = [];
    this.players = players;
    this.firstCard = null;
    this.secondCard = null;
    this.player = new Player();
    this.possibleMatches = null;
    $("#reset").data(this);
}

//Method To Generate Cards
GameBoard.prototype.createCardObjs = function (numCards) {
    this.prepCharacters(numCards);
    this.possibleMatches = numCards / 2;
    for (var i = 0; i < numCards; i++) {
        var index = Math.floor((Math.random() * this.charArray.length - 1) + 1);
        var character = new Character(this.charArray[index]);
        this.charArray.splice(index, 1);
        var domObj = this.createDOMObj(character);
        
        var newCard = new Card(domObj , character, this);
        $(domObj).data(newCard);
        this.cards.push($(domObj).data());
        
        // attempted to make the cards directly into the array - encountered anomalies
        //     this.cards[i] = new Card(domObj, character, this);
        //     $(domObj).data(this.cards[i]);
    }
    console.log(this.cards);
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
    var front = $("<div>").addClass('front down');
    var frontImg = $("<img>").attr('src', "images/" + character.name + ".jpg");
    var back = $("<div>").addClass('back');
    var backImg = $("<img>").attr('src', "images/card-back-1.jpg");
    
    $(front).append(frontImg);
    $(back).append(backImg);
    $(card).append(front, back);
    $("#game-area").append(card);
    
    return card;
};

//Method To Handle Clicks
GameBoard.prototype.cardClicked = function () {
    var card = $(this).data();
    var board = card.board;
    var player = board.player;
    
    if (card.state == 'down' && board.secondCard == null) {
        card.flip();
        $("#spell_player").attr('src', card.character.spell);
        $("#spell_player")[0].play();
        
        if (board.firstCard == null) {
            board.firstCard = card;
        } else if (board.secondCard == null) {
            board.secondCard = card;
            player.attempts++;
            $("#attempts").text(player.attempts);
            
            //check for match
            if (board.firstCard.character.name == board.secondCard.character.name) {
                player.matches++;
                
                $("#emote_player").attr('src', card.character.emote);
                $("#emote_player")[0].play();
                board.firstCard = null;
                board.secondCard = null;
                
                if (player.matches == board.possibleMatches) {
                    setTimeout(function () {
                        $("#victory").addClass('victory');
                    }, 750);
                    player.games += 1;
                }
            } else{
                setTimeout(function () {
                    board.firstCard.flip();
                    board.secondCard.flip();
                    board.firstCard = null;
                    board.secondCard = null;
                }, 1250);
            }
            player.accuracy = Math.round(100 * (player.matches / player.attempts));
            $("#accuracy").text(player.accuracy + "%");
        }
    }
};

//Method To Clear Cards
GameBoard.prototype.clearCards = function () {
    $("#game-area").html("<h1 id='victory'>Victory!!!</h1>");
    this.cards = [];
};

//Method To Reset Board
GameBoard.prototype.reset = function () {
    var board = $(this).data();
    board.player.attempts = 0;
    board.player.matches = 0;
    board.player.accuracy = 0;
    board.player.displayStats();
    $("#victory").removeClass('victory');
    
    console.log(board.cards);
    //flip cards back over
    for (var i = 0; i < board.cards.length; i++){
        if (board.cards[i].state == 'up'){
            board.cards[i].flip();
        }
    }
    
    //reset board
    setTimeout(function () {
        board.clearCards();
        board.createCardObjs(18);
    }, 1000);
};

//Method To Set Volume
GameBoard.prototype.setVolume = function () {
    $("#background_music_player").prop('volume', ($("#background-volume").val() / 100));
    $("#spell_player").prop('volume', ($("#spell-volume").val() / 100));
    $("#emote_player").prop('volume', ($("#emote-volume").val() / 100));
};

//CONSTRUCTOR FOR CARDS
function Card(element, character, board) {
    this.element = element;
    this.character = character;
    this.board = board;
    this.state = 'down';
}

//Method To Flip Cards
Card.prototype.flip = function () {
    $(this.element).find('div').toggleClass('down');
    
    if(this.state == 'down'){
        this.state = 'up';
    } else {
        this.state = 'down';
    }
    
    console.log(this.board.cards);
};

//CONSTRUCTOR FOR CHARACTERS
function Character(name) {
    this.name = name;
    this.spell = spells[this.name];
    this.emote = emotes[this.name];
}

//CONSTRUCTOR FOR PLAYERS
function Player(){
    this.attempts = 0;
    this.matches = 0;
    this.games = 0;
    this.accuracy = 0;
}

//Method To Display Stats
Player.prototype.displayStats = function() {
    $("#games-played").text(this.games);
    $("#attempts").text(this.attempts);
    $("#accuracy").text(this.accuracy + "%");
};

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