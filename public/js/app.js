$(document).ready(function () {

    //Menu mobile
    $('header .open-mobile').click(function () {
        $('header nav').animate({
            right: 0
        })
    });
    $('header .close-mobile').click(function () {
        $('header nav').animate({
            right: -320
        })
    });

});