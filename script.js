/**
 * Created by jar4677 on 4/29/16.
 */

/**
 * matchCraft - main game object
 * @type {{numPlayers: number, player1: null, player2: null, activePlayer: null, setActivePlayer: matchCraft.setActivePlayer, slideBoard: matchCraft.slideBoard, reset: matchCraft.reset}}
 */
var matchCraft = {
    numPlayers: 1,
    player1: null,
    player2: null,
    activePlayer: null,
    
    /**
     * matchCraft.setActivePlayer
     */
    setActivePlayer: function () {
        if (this.numPlayers == 2) {
            if (this.activePlayer == null) {
                var x = Math.round(Math.random()) + 1;
                if (x == 1) {
                    this.activePlayer = this.player1;
                } else {
                    this.activePlayer = this.player2;
                }
            } else {
                this.activePlayer = this.activePlayer.opponent;
            }
            $(this.activePlayer.nameDisplay).addClass('active-player');
            $(this.activePlayer.opponent.nameDisplay).removeClass('active-player');
            matchCraft.slideBoard();
        } else {
            this.activePlayer = this.player1;
        }
    },
    
    /**
     * matchCraft.slideBoard
     */
    slideBoard: function () {
        if (this.activePlayer == this.player2) {
            $("#card-area").addClass('player2');
        } else {
            $("#card-area").removeClass('player2');
        }
    },
    
    /**
     * matchCraft.reset
     */
    reset: function () {
        this.numPlayers = 1;
        this.player1 = null;
        this.player2 = null;
        this.activePlayer = null;
    },

    /**
     * matchCraft.startGame
     */
    startGame: function () {
        //make player1
        matchCraft.player1 = new Player($("#p1-name").val(), $("input[name = p1-faction]:checked").val(), $("#p1-num-cards").val(), 1);
        matchCraft.player1.opponent = matchCraft.player1;
        matchCraft.player1.createBoard();
        $("#p1-name-display").text(matchCraft.player1.name);

        //if two players, make player2
        if ($("input[name = number-of-players]:checked").val() == 2) {
            matchCraft.numPlayers = 2;
            matchCraft.player2 = new Player($("#p2-name").val(), $("input[name = p2-faction]:checked").val(), $("#p2-num-cards").val(), 2);
            matchCraft.player2.opponent = matchCraft.player1;
            matchCraft.player1.opponent = matchCraft.player2;
            matchCraft.player2.createBoard();
            $("#p2-name-display").text(matchCraft.player2.name);
        }
    }
};

/**
 * Player - constructor for Player objects
 * @param name
 * @param faction
 * @param numCards
 * @param playerNumber
 * @returns {Player}
 * @constructor
 */
function Player(name, faction, numCards, playerNumber) {
    this.name = name;
    this.faction = factions[faction];
    this.numCards = numCards;
    this.playerNumber = 'player' + playerNumber;
    this.nameDisplay = $('#p' + playerNumber + '-name-display');
    this.board = null;
    this.opponent = null;

    if (!this.name) {
        var index = Math.floor(Math.random() * this.faction.heroes.length);
        this.name = this.faction.heroes[index];
    }
    
    this.createBoard = function () {
        this.board = new GameBoard(this);
        this.board.prepCharacters();
        this.board.createCardObjs();
    };
    return this;
}

/**
 * GameBoard - constructor for game board objects
 * @param player
 * @returns {GameBoard}
 * @constructor
 */
function GameBoard(player) {
    this.player = player;
    this.characters = [];
    this.firstCard = null;
    this.secondCard = null;
    this.matches = 0;
    this.possibleMatches = (this.player.numCards / 2);
    
    return this;
}

/**
 * GameBoard.prepCharacters
 */
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

/**
 * GameBoard.createDOMObj
 * @param character
 * @returns {*|jQuery}
 */
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

/**
 * GameBoard.createCardObjs
 */
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

/**
 * GameBoard.cardClicked
 * @param card
 */
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
                setTimeout(function () {
                    self.firstCard.flip();
                    self.secondCard.flip();
                    self.firstCard = null;
                    self.secondCard = null;
                }, 1250);
                setTimeout(function () {
                    matchCraft.setActivePlayer();
                }, 2150);
            }
        }
    }
};

//TODO Re-introduce sounds (download sound files if possible)

/**
 * GameBoard.setVolume
 */
GameBoard.prototype.setVolume = function () {
    $("#background_music_player").prop('volume', ($("#background-volume").val() / 100));
    $("#spell_player").prop('volume', ($("#spell-volume").val() / 100));
    $("#emote_player").prop('volume', ($("#emote-volume").val() / 100));
};

/**
 * Card - constructor for card objects
 * @param element
 * @param character
 * @param board
 * @constructor
 */
function Card(element, character, board) {
    this.element = element;
    this.character = character;
    this.board = board;
    this.state = 'down';
}

/**
 * Card.flip
 */
Card.prototype.flip = function () {
    $(this.element).find('div').toggleClass('down');
    
    if (this.state == 'down') {
        this.state = 'up';
    } else {
        this.state = 'down';
    }
};

//TODO Get Alliance card faces
//OBJECTS FOR ASSETS
var factions = {
    horde: {
        name: 'horde',
        heroes: [
            'Thrall',
            'Durotan',
            'Garona',
            'Draka',
            'Orgrim',
            'Sylvanas'
        ],
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
        heroes: [
            'Varian',
            'Muradin',
            'Jaina',
            'Tyrande',
            'Velen'
        ],
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
$(document).ready(function ()   {
    $("#options-background").show();
    
    //click handler to start the game
    $("#start-game").click(function () {
        matchCraft.reset();
        
        //turn off Game Options dialog
        $("#options-background").hide();

        matchCraft.startGame();
        matchCraft.setActivePlayer();
    });
    
    //click handler for reset button
    $("#restart").click(function () {
        $("#victory").hide();
        matchCraft.reset();
        $('#player1-card-area, #player2-card-area').html('');
        $("#options-background").show();
    });

    $("#replay").click(function () {
        $("#victory").hide();

        //flip numCards back over
        $(".card").each(function () {
            var card = $(this).data();
            if (card.state == 'up') {
                card.flip();
            }
        });

        //reset board
        setTimeout(function () {
            $('#player1-card-area, #player2-card-area').html('');
            matchCraft.startGame();
            matchCraft.setActivePlayer();
        }, 1000);
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
});
