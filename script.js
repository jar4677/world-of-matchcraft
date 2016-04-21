/**
 * Created by jar4677 on 4/20/16.
 */

//initializing jQuery
$(document).ready(function () {

    //declare global variables
    firstCardClicked = null;
    secondCardClicked = null;
    totalPossibleMatches = $('.card').length / 2;
    matchCounter = 0;
    
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
    
    //delegated handler
    $("#game-area").on('click', ".card", cardClicked);

});