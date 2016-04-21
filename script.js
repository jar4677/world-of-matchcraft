/**
 * Created by jar4677 on 4/20/16.
 */

//declare global variables
var firstCardClicked = null;
var secondCardClicked = null;
var totalPossibleMatches = 2;
var matchCounter = 0;

//initializing jQuery
$(document).ready(function () {

    //function to flip card
    function flipCard(x) {
        $(x).children("div").toggleClass('down');
    }

    function cardClicked() {

        //checks to see if card is already face down. prevents re-flipping cards
        if ($(this).children(".front").hasClass('down') && secondCardClicked == null) {

            flipCard(this);

            if (firstCardClicked == null) {
                firstCardClicked = this;
            } else {
                secondCardClicked = this;
                if ($(firstCardClicked).html() == $(secondCardClicked).html()) {
                    matchCounter++;
                    firstCardClicked = null;
                    secondCardClicked = null;
                    if (matchCounter == totalPossibleMatches) {
                        setTimeout(function () {
                            $("#victory").toggleClass('victory');
                        }, 750);
                    }
                } else {
                    setTimeout(function () {
                        flipCard(firstCardClicked);
                        flipCard(secondCardClicked);
                        firstCardClicked = null;
                        secondCardClicked = null;
                    }, 2000);
                }
            }
        }
    }

    $("#game-area").on('click', ".card", cardClicked);

});