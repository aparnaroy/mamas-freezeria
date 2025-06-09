$(function () {
    // Check if the current page is game.html
    if (window.location.pathname.endsWith('game.html')) {
        // get music 
        var backgroundMusic = document.getElementById("backgroundMusic");

        // check music status from localStorage
        var isMusicPlaying = localStorage.getItem('isMusicPlaying');
        var currentTime = localStorage.getItem('currentTime');

        if (isMusicPlaying === 'true') {
            backgroundMusic.currentTime = parseFloat(currentTime) || 0;

            // play bgm
            backgroundMusic.play().then(function () {
                console.log("Background music continues playing on game page.");
            }).catch(function (error) {
                console.error("Failed to continue background music:", error);
            });
        }
    }
});