/**
 * Created by jar4677 on 4/20/16.
 */

//initializing jQuery
$(document).ready(function () {

    //declare global variables
    firstCardClicked = null;
    secondCardClicked = null;
    totalPossibleMatches = $('.card').length / 2;
    matches = 0;
    attempts = 0;
    accuracy = 0;
    gamesPlayed = 0;

//BOARD SETUP

    //declare images array and function to push image tags
    var images = [];

    function pushImages() {
        images.push('<img src="images/bayliana.jpg" alt="bayliana">');
        images.push('<img src="images/kiggo.jpg" alt="kiggo">');
        images.push('<img src="images/morit.jpg" alt="morit">');
        images.push('<img src="images/eijaal.jpg" alt="eijaal">');
        images.push('<img src="images/kachall.jpg" alt="kachall">');
        images.push('<img src="images/xail.jpg" alt="xail">');
        images.push('<img src="images/kiggar.jpg" alt="kiggar">');
        images.push('<img src="images/meltheir.jpg" alt="meltheir">');
        images.push('<img src="images/kashu.jpg" alt="kashu">');
    }

    //push two copies of each image into array and assign randomly to cards
    function assignImages() {
        pushImages();
        pushImages();

        $(".card").each(function () {
            var x = Math.floor((Math.random() * images.length - 1) + 1);
            $(this).find('.front').html(images[x]);
            images.splice(x, 1);
        })
    }

    //set cards on page load
    assignImages();
    
//AUDIO FILE SETUP
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

//AUDIO SETUP

    //start music
    $("#background_music_player")[0].play();

    function setVolume() {
        $("#background_music_player").prop('volume', ($("#background-volume").val() / 100));
        $("#spell_player").prop('volume', ($("#spell-volume").val() / 100));
        $("#emote_player").prop('volume', ($("#emote-volume").val() / 100));
    }

    //sets volume to half on load
    setVolume();

    

//GAME PLAY FUNCTIONALITY
    
    //function to flip card
    function flipCard(x) {
        $(x).children("div").toggleClass('down');
    }

    //function for when a card is clicked
    function cardClicked() {
        //checks to see if card is already face down. prevents re-flipping cards && if two cards are flipped,
        // prevents third card
        if ($(this).find(".front").hasClass('down') && secondCardClicked == null) {

            flipCard(this);

            //plays spell sound
            var character = $(this).find('img').attr('alt');
            $("#spell_player").attr('src', spells[character]);
            $("#spell_player")[0].play();

            if (firstCardClicked == null) {
                firstCardClicked = this;
            } else {
                secondCardClicked = this;
                attempts++;
                $("#attempts").text(attempts);
                
                //check for match
                if ($(firstCardClicked).html() == $(secondCardClicked).html()) {
                    matches++;

                    //plays emote on match
                    $("#emote_player").attr('src',emotes[character]);
                    $("#emote_player")[0].play();
                    firstCardClicked = null;
                    secondCardClicked = null;
                    
                    //check for finished
                    if (matches == totalPossibleMatches) {
                        setTimeout(function () {
                            $("#victory").addClass('victory');
                        }, 750);
                        gamesPlayed += 1;
                    }
                    
                //not matched
                } else {
                    setTimeout(function () {
                        flipCard(firstCardClicked);
                        flipCard(secondCardClicked);
                        firstCardClicked = null;
                        secondCardClicked = null;
                    }, 1250);
                }
                //set the accuracy after checking for matches with each second pick
                accuracy = Math.round(100 * (matches / attempts));
                $("#accuracy").text(accuracy + "%");
            }
        }
    }
    
    //delegated handler
    $("#game-area").on('click', ".card", cardClicked);

//STATS AND RESET
    function displayStats() {
        $("#games-played").text(gamesPlayed);
        $("#attempts").text(attempts);
        $("#accuracy").text(accuracy + "%");
    }

    //shows stat placeholders on load
    displayStats();
    
    function resetStats() {
        matches = 0;
        attempts = 0;
        accuracy = 0;
        displayStats();
    }
    
    $("#reset").click(function () {
        resetStats();

        //flip over all cards that are face up
        $(".card").each(function () {
            if ($(this).find(".back").hasClass("down")){
                flipCard(this);
            }
        });

        //remove victory message
        $("#victory").removeClass('victory');

        //shuffle w/ delay
        setTimeout(function () {
            assignImages();
        }, 1000);
        
    })
});

