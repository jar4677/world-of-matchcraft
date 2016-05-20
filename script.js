/**
 * Created by jar4677 on 4/29/16.
 */

//TODO MAIN GAME OBJECT
var matchCraft = {
    numPlayers: 1,
    player1: null,
    player2: null,
    activePlayer: null,
    
    setActivePlayer: function () {
        if (this.numPlayers == 2) {
            if (this.activePlayer == null) {
                var x = Math.round(Math.random()) + 1;
                if (x == 1){
                    this.activePlayer = this.player1;
                } else {
                    this.activePlayer = this.player2;
                }
            } else {
                this.activePlayer = this.activePlayer.opponent;
            }
        } else {
            this.activePlayer = this.player1;
        }
    },

    slideBoard: function () {
        if (this.activePlayer == this.player2) {
            $("#card-area").addClass('player2');
        } else {
            $("#card-area").removeClass('player2');
        }
    }


};

//CONSTRUCTOR FOR PLAYERS
function Player(name, faction, numCards, playerNumber) {
    this.name = name;
    this.faction = factions[faction];
    this.numCards = numCards;
    this.playerNumber = 'player' + playerNumber;
    this.board = null;
    this.opponent = null;
    
    this.createBoard = function () {
        this.board = new GameBoard(this);
        this.board.prepCharacters();
        this.board.createCardObjs();
    };
    
    return this;
}

//Player Method To Display Stats
Player.prototype.displayStats = function () {
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
    this.matches = 0;
    this.possibleMatches = (this.player.numCards / 2);
    
    return this;
}

//Game Board Method To Prep Characters
GameBoard.prototype.prepCharacters = function () {
    var tempArray = [];
    for (var x in this.player.faction.characters) {
        tempArray.push(x);
    }
    for (var i = 0; i < (this.player.numCards / 2); i++) {
        var index = Math.floor((Math.random() * tempArray.length - 1) + 1);
        this.characters.push(tempArray[index], tempArray[index]);
        tempArray.splice(index, 1);
    }
};

//Game Board Method To Generate DOM Objects
GameBoard.prototype.createDOMObj = function (character) {
    var card = $("<div>").addClass('card');
    var front = $("<div>").addClass('front down');
    var frontImg = $("<img>").attr('src', "images/" + character + ".jpg");
    var back = $("<div>").addClass('back');
    var backImg = $("<img>").attr('src', "images/" + this.player.faction.name + "-back.jpg");
    
    $(front).append(frontImg);
    $(back).append(backImg);
    $(card).append(front, back);
    
    return card;
};

//Game Board Method To Generate Cards
GameBoard.prototype.createCardObjs = function () {
    for (var i = 0; i < this.player.numCards; i++) {
        //select random character from array of characters
        var index = Math.floor((Math.random() * this.characters.length - 1) + 1);
        var character = this.characters[index];
        this.characters.splice(index, 1);
        
        //create card using that character and append it to the correct card area
        var domObj = this.createDOMObj(character);
        var cardArea = "#" + this.player.playerNumber + "-card-area";
        $(cardArea).append(domObj);
        
        //create card object
        // this.cards[i] = new Card(domObj, character, this);
        var card = new Card(domObj, character, this);
        $(domObj).data(card);
        
    }
};

//Game Board Method To Handle Clicks
GameBoard.prototype.cardClicked = function (card) {
    var self = this;
    
    //check that card clicked is not down or a third card and that the player is correct
    if (card.state == 'down' && this.secondCard == null && matchCraft.activePlayer == this.player) {
        //if not, flip the card
        card.flip();
        
        //if it is the first card clicked this round set it as such
        if (this.firstCard == null) {
            this.firstCard = card;
            //if it is the second card clicked this round set it as such and...
        } else if (this.secondCard == null) {
            this.secondCard = card;

            //check for match
            if (this.firstCard.character == this.secondCard.character) {
                this.matches++;
                
                this.firstCard = null;
                this.secondCard = null;
                
                //check for win
                if (this.matches == this.possibleMatches) {
                    setTimeout(function () {
                        $("#victory").show();
                    }, 750);
                } 

            } else {
                matchCraft.setActivePlayer();
                setTimeout(function () {
                    self.firstCard.flip();
                    self.secondCard.flip();
                    self.firstCard = null;
                    self.secondCard = null;
                }, 1250);
                setTimeout(function () {
                    matchCraft.slideBoard();
                }, 2150);
            }
        }
    }
};

//Game Board Method To Clear Cards
GameBoard.prototype.clearCards = function () {
    $("#game-area").html("<h1 id='victory'>Victory!!!</h1>");
    this.numCards = [];
};

//Game Board Method To Reset Board
GameBoard.prototype.reset = function () {
    var board = $(this).data();
    board.player.attempts = 0;
    board.player.matches = 0;
    board.player.accuracy = 0;
    board.player.displayStats();
    $("#victory").removeClass('victory');

    //flip numCards back over
    for (var i = 0; i < board.numCards.length; i++) {
        if (board.numCards[i].state == 'up') {
            board.numCards[i].flip();
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
    
    if (this.state == 'down') {
        this.state = 'up';
    } else {
        this.state = 'down';
    }
};

//OBJECTS FOR ASSETS
var factions = {
    horde: {
        name: 'horde',
        characters: {
            bayliana: {
                name: 'bayliana',
                emote: "http://wow.zamimg.com/wowsounds/539260",
                spell: "http://wow.zamimg.com/wowsounds/569763"
            },
            kiggo: {
                name: 'kiggo',
                emote: "http://wow.zamimg.com/wowsounds/541435",
                spell: "http://wow.zamimg.com/wowsounds/568524"
            },
            morit: {
                name: 'morit',
                emote: "http://wow.zamimg.com/wowsounds/542787",
                spell: "http://wow.zamimg.com/wowsounds/569138"
            },
            eijaal: {
                name: 'eijaal',
                emote: "http://wow.zamimg.com/wowsounds/543040",
                spell: "http://wow.zamimg.com/wowsounds/569357"
            },
            kachall: {
                name: 'kachall',
                emote: "http://wow.zamimg.com/wowsounds/541404",
                spell: "http://wow.zamimg.com/wowsounds/568049"
            },
            xail: {
                name: 'xail',
                emote: "http://wow.zamimg.com/wowsounds/539166",
                spell: "http://wow.zamimg.com/wowsounds/568585"
            },
            kiggar: {
                name: 'kiggar',
                emote: "http://wow.zamimg.com/wowsounds/541389",
                spell: "http://wow.zamimg.com/wowsounds/569423"
            },
            meltheir: {
                name: 'meltheir',
                emote: "http://wow.zamimg.com/wowsounds/539228",
                spell: "http://wow.zamimg.com/wowsounds/569675"
            },
            kashu: {
                name: 'kashu',
                emote: "http://wow.zamimg.com/wowsounds/541391",
                spell: "http://wow.zamimg.com/wowsounds/569079"
            }
        }
    },
    alliance: {
        name: 'alliance',
        characters: {
            bayliana: {
                name: 'bayliana',
                emote: "http://wow.zamimg.com/wowsounds/539260",
                spell: "http://wow.zamimg.com/wowsounds/569763"
            },
            kiggo: {
                name: 'kiggo',
                emote: "http://wow.zamimg.com/wowsounds/541435",
                spell: "http://wow.zamimg.com/wowsounds/568524"
            },
            morit: {
                name: 'morit',
                emote: "http://wow.zamimg.com/wowsounds/542787",
                spell: "http://wow.zamimg.com/wowsounds/569138"
            },
            eijaal: {
                name: 'eijaal',
                emote: "http://wow.zamimg.com/wowsounds/543040",
                spell: "http://wow.zamimg.com/wowsounds/569357"
            },
            kachall: {
                name: 'kachall',
                emote: "http://wow.zamimg.com/wowsounds/541404",
                spell: "http://wow.zamimg.com/wowsounds/568049"
            },
            xail: {
                name: 'xail',
                emote: "http://wow.zamimg.com/wowsounds/539166",
                spell: "http://wow.zamimg.com/wowsounds/568585"
            },
            kiggar: {
                name: 'kiggar',
                emote: "http://wow.zamimg.com/wowsounds/541389",
                spell: "http://wow.zamimg.com/wowsounds/569423"
            },
            meltheir: {
                name: 'meltheir',
                emote: "http://wow.zamimg.com/wowsounds/539228",
                spell: "http://wow.zamimg.com/wowsounds/569675"
            },
            kashu: {
                name: 'kashu',
                emote: "http://wow.zamimg.com/wowsounds/541391",
                spell: "http://wow.zamimg.com/wowsounds/569079"
            }
        }
    }
};

//DOCUMENT READY FOR EVENT HANDLERS
$(document).ready(function () {
    $("#options-background").css('display', 'block');
    
    //click handler to start the game
    $("#start-game").click(function () {
        //turn off Game Options dialog
        $("#options-background").css('display', 'none');
        
        //make player1
        matchCraft.player1 = new Player($("#p1-name").val(), $("input[name = p1-faction]:checked").val(), 18, 1);
        matchCraft.player1.opponent = matchCraft.player1;
        matchCraft.player1.createBoard();
        
        //if two players, make player2
        if ($("input[name = number-of-players]:checked").val() == 2) {
            matchCraft.numPlayers = 2;
            matchCraft.player2 = new Player($("#p2-name").val(), $("input[name = p2-faction]:checked").val(), 18, 2);
            matchCraft.player2.opponent = matchCraft.player1;
            matchCraft.player1.opponent = matchCraft.player2;
            matchCraft.player2.createBoard();
        }

        matchCraft.setActivePlayer();
        matchCraft.slideBoard();
    });
    
    //click handlers for number of players radio buttons
    $("input[name = number-of-players]").change(function () {
        $("#p2-options").toggle();
    });
    
    //delegated click handler for cards
    $("#card-area").on("click", ".card", function () {
        var card = $(this).data();
        card.board.cardClicked(card);
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
