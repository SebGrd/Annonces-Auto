$(document).ready(function () {

    $(".datepicker-yyyy").datepicker({
        format: "yyyy",
        viewMode: "years",
        minViewMode: "years",
        endDate: new Date(),
        immediateUpdates: true,
        language: 'fr',
        autoclose: true
    });

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

window.addEventListener('load', (e) => {


})