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

    console.log('total possible matches: ' + totalPossibleMatches);
//GAME PLAY FUNCTIONALITY
    
    //function to flip card
    function flipCard(x) {
        $(x).children("div").toggleClass('down');
    }

    //function for when a card is clicked
    function cardClicked() {
        //checks to see if card is already face down. prevents re-flipping cards
        if ($(this).children(".front").hasClass('down') && secondCardClicked == null) {

            flipCard(this);

            if (firstCardClicked == null) {
                firstCardClicked = this;
            } else {
                secondCardClicked = this;
                attempts++;
                $("#attempts").text(attempts);
                if ($(firstCardClicked).html() == $(secondCardClicked).html()) {
                    matches++;

                    console.log('matches: ' + matches);

                    firstCardClicked = null;
                    secondCardClicked = null;
                    if (matches == totalPossibleMatches) {
                        setTimeout(function () {
                            $("#victory").addClass('victory');
                        }, 750);
                        gamesPlayed += 1;
                    }
                } else {
                    setTimeout(function () {
                        flipCard(firstCardClicked);
                        flipCard(secondCardClicked);
                        firstCardClicked = null;
                        secondCardClicked = null;
                    }, 2000);
                }
                //I think this will set the accuracy after checking for matches with each second click
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

        $(".card").each(function () {
            if ($(this).children(".back").hasClass("down")){
                flipCard(this);
            }
        })

        $("#victory").removeClass('victory');
    })
});