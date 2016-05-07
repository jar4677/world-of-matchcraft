/**
 * Created by jar4677 on 4/29/16.
 */

//TODO MAIN GAME OBJECT
var matchCraft = {
    numPlayers: 1,
    player1: null,
    player2: null,
    newPlayer: function (x, name, faction, cards) {
        matchCraft['player' + x] = new Player(name, faction, cards, x);
    }
};

//CONSTRUCTOR FOR PLAYERS
function Player(name, faction, cards, playerNumber){
    this.name = name;
    this.faction = characters[faction];
    this.cards = cards;
    this.playerNumber = playerNumber;
    this.board = null;
    
    this.createBoard = function () {
        this.board = new GameBoard(this);    
    };
    
    return this;
}

//Player Method To Display Stats
Player.prototype.displayStats = function() {
    $("#games-played").text(this.games);
    $("#attempts").text(this.attempts);
    $("#accuracy").text(this.accuracy + "%");
};

//CONSTRUCTOR FOR GAME BOARD
function GameBoard(player) {
    this.player = player;
    this.characters = [];
    this.cards = [];
    this.firstCard = null;
    this.secondCard = null;
    this.possibleMatches = (player.cards / 2);
}

//Game Board Method To Generate Cards
GameBoard.prototype.createCardObjs = function () {
    this.prepCharacters();
    for (var i = 0; i < numCards; i++) {
        var index = Math.floor((Math.random() * this.characters.length - 1) + 1);
        var character = new Character(this.characters[index]);
        this.characters.splice(index, 1);
        var domObj = this.createDOMObj(character);
        
        //TODO moved this from the createDOMObj method. Need to figure it out
        $("#game-area").append(domObj);
        
        var newCard = new Card(domObj, character, this);
        $(domObj).data(newCard);
        this.cards.push($(domObj).data());

        // tried with a closure
        // var self = this;
        //
        // (function () {
        //     var x = newCard;
        //     self.cards.push(x);
        //     $(domObj).data(x);
        // })();

        // attempted to make the cards directly into the array - encountered anomalies
        //     this.cards[i] = new Card(domObj, character, this);
        //     $(domObj).data(this.cards[i]);
    }
};

//Game Board Method To Prep Characters
GameBoard.prototype.prepCharacters = function () {
    var localArray = [];
    for (var x in this.player.characters) {
        localArray.push(x);
    }
    for (var i = 0; i < (this.player.cards / 2); i++) {
        var index = Math.floor((Math.random() * localArray.length - 1) + 1);
        this.characters.push(localArray[index], localArray[index]);
        localArray.splice(index, 1);
    }
};

//Game Board Method To Generate DOM Objects
GameBoard.prototype.createDOMObj = function (character) {
    var card = $("<div>").addClass('card');
    var front = $("<div>").addClass('front down');
    var frontImg = $("<img>").attr('src', "images/" + character.name + ".jpg");
    var back = $("<div>").addClass('back');
    var backImg = $("<img>").attr('src', "images/horde-back-old.jpg");
    
    $(front).append(frontImg);
    $(back).append(backImg);
    $(card).append(front, back);
    
    return card;
};

//Game Board Method To Handle Clicks
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

//Game Board Method To Clear Cards
GameBoard.prototype.clearCards = function () {
    $("#game-area").html("<h1 id='victory'>Victory!!!</h1>");
    this.cards = [];
};

//Game Board Method To Reset Board
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

//Game Board Method To Set Volume
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

//Card Method To Flip Cards
Card.prototype.flip = function () {
    $(this.element).find('div').toggleClass('down');
    
    if(this.state == 'down'){
        this.state = 'up';
    } else {
        this.state = 'down';
    }
};

//CONSTRUCTOR FOR CHARACTERS
function Character(name) {
    this.name = name;
    this.spell = spells[this.name];
    this.emote = emotes[this.name];
}

//OBJECTS FOR ASSETS
var characters = {
    horde: {
        bayliana: {
            emote:"http://wow.zamimg.com/wowsounds/539260",
            spell: "http://wow.zamimg.com/wowsounds/569763"
        },
        kiggo: {
            emote: "http://wow.zamimg.com/wowsounds/541435",
            spell: "http://wow.zamimg.com/wowsounds/568524"
        },
        morit: {
            emote: "http://wow.zamimg.com/wowsounds/542787",
            spell: "http://wow.zamimg.com/wowsounds/569138"
        },
        eijaal: {
            emote: "http://wow.zamimg.com/wowsounds/543040",
            spell: "http://wow.zamimg.com/wowsounds/569357"
        },
        kachall: {
            emote: "http://wow.zamimg.com/wowsounds/541404",
            spell: "http://wow.zamimg.com/wowsounds/568049"
        },
        xail: {
            emote: "http://wow.zamimg.com/wowsounds/539166",
            spell: "http://wow.zamimg.com/wowsounds/568585"
        },
        kiggar: {
            emote: "http://wow.zamimg.com/wowsounds/541389",
            spell: "http://wow.zamimg.com/wowsounds/569423"
        },
        meltheir: {
            emote: "http://wow.zamimg.com/wowsounds/539228",
            spell: "http://wow.zamimg.com/wowsounds/569675"
        },
        kashu: {
            emote:"http://wow.zamimg.com/wowsounds/541391",
            spell: "http://wow.zamimg.com/wowsounds/569079"
        }
    },
    alliance: {
        bayliana: {
            emote:"http://wow.zamimg.com/wowsounds/539260",
            spell: "http://wow.zamimg.com/wowsounds/569763"
        },
        kiggo: {
            emote: "http://wow.zamimg.com/wowsounds/541435",
            spell: "http://wow.zamimg.com/wowsounds/568524"
        },
        morit: {
            emote: "http://wow.zamimg.com/wowsounds/542787",
            spell: "http://wow.zamimg.com/wowsounds/569138"
        },
        eijaal: {
            emote: "http://wow.zamimg.com/wowsounds/543040",
            spell: "http://wow.zamimg.com/wowsounds/569357"
        },
        kachall: {
            emote: "http://wow.zamimg.com/wowsounds/541404",
            spell: "http://wow.zamimg.com/wowsounds/568049"
        },
        xail: {
            emote: "http://wow.zamimg.com/wowsounds/539166",
            spell: "http://wow.zamimg.com/wowsounds/568585"
        },
        kiggar: {
            emote: "http://wow.zamimg.com/wowsounds/541389",
            spell: "http://wow.zamimg.com/wowsounds/569423"
        },
        meltheir: {
            emote: "http://wow.zamimg.com/wowsounds/539228",
            spell: "http://wow.zamimg.com/wowsounds/569675"
        },
        kashu: {
            emote:"http://wow.zamimg.com/wowsounds/541391",
            spell: "http://wow.zamimg.com/wowsounds/569079"
        }
    }
};

//DOCUMENT READY FOR EVENT HANDLERS
$(document).ready(function () {
    $("#start-game").click(function () {
        //TODO turn off Game Options dialog

        //if two players, make player2
        if($("input[name = number-of-players]:checked").val() == 2){
            matchCraft.player2 = new Player($("#p2-name").val(), $("input[name = p2-faction]:checked").val(), 18, 2);
            matchCraft.player2.createBoard();
        }
        
        //make player1
        matchCraft.player1 = new Player($("#p1-name").val(), $("input[name = p1-faction]:checked").val(), 18, 1);
        matchCraft.player2.createBoard();
    });
    
    //TODO local storage

// OLD /////////////////////////////////////////////
    //things to do when the page loads
    //set up game board
    // var gameBoard = new GameBoard(1);
    // gameBoard.createCardObjs(18);
    // gameBoard.player.displayStats();
    //start music
    // gameBoard.setVolume();
    // $("#background_music_player")[0].play();
    //CLICK HANDLERS
    // $("#game-area").on("click", ".card", gameBoard.cardClicked);
    // $("#reset").click(gameBoard.reset);
    // $(".slider").on("change", gameBoard.setVolume);
    // $("#settings").click(function () {
    //     $("#settings-background").addClass('settings-open');
    // });
    // $("#settings-window").find(".button").click(function () {
    //     $("#settings-background").removeClass('settings-open');
    // });
// OLD ////////////////////////////////////////////
    
});
