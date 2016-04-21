/**
 * Created by jar4677 on 4/20/16.
 */
//initializing jQuery
$(document).ready(function () {

    //declare global variables
    var first_card_clicked = null;
    var second_card_clicked = null;
    var total_possible_matches = 2;
    var match_counter = 0;
    
    function card_clicked() {
        $(this).toggleClass('flip');
    }
    
    $(".card").on("click", "div", card_clicked)


});