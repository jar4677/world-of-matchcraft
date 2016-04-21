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
        images.push('<img src="images/bayliana.jpg" alt="Bayliana">');
        images.push('<img src="images/kiggo.jpg" alt="Kiggo">');
        images.push('<img src="images/morit.jpg" alt="Morit">');
        images.push('<img src="images/eijaal.jpg" alt="Eijaal">');
        images.push('<img src="images/kachall.jpg" alt="Kachall">');
        images.push('<img src="images/xail.jpg" alt="Xail">');
        images.push('<img src="images/kiggar.jpg" alt="Kiggar">');
        images.push('<img src="images/meltheir.jpg" alt="Meltheir">');
        images.push('<img src="images/kashu.jpg" alt="Kashu">');
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

            if (firstCardClicked == null) {
                firstCardClicked = this;
            } else {
                secondCardClicked = this;
                attempts++;
                $("#attempts").text(attempts);
                
                //check for match
                if ($(firstCardClicked).html() == $(secondCardClicked).html()) {
                    matches++;
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
                    }, 2000);
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