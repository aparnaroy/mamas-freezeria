// Handles blend-button click
import { cups } from './cup-ingredients-animate.js';
import { showErrorMessage } from './cup-ingredients-animate.js';

$(function() {
    function showBlendTimer(buttonId, cupId) {
        // Play the blend sound effect when the blend button is clicked
        const blendSound = document.getElementById('blendSound');
        if (blendSound) {
            blendSound.play().catch(function (error) {
                console.error("Failed to play blend sound:", error);
            });
        }

        const timerId = buttonId.replace('blend-button', 'timer');
        const pieChartId = buttonId.replace('blend-button', 'pie-chart');

        // Hide the blend button and show the timer
        $(`#${buttonId}`).hide();
        $(`#${timerId}`).show();

        const totalTime = 800; // total time in milliseconds
        let remainingTime = totalTime;

        // Disable interactions while blending
        if (cups[cupId]) {
            cups[cupId].startBlending(); // Set blending state to true
        }

        // Disable cup hover effect while blending
        const cupElement = document.getElementById(cupId); // Get the actual DOM element of the cup
        if (cupElement) {
            cupElement.classList.add('blending'); // Add the 'blending' class to the cup element
        }
        
        // Show the timer countdown colors
        function updateTimer() {
            const percentage = (remainingTime / totalTime) * 100;
            $(`#${pieChartId}`).css('background', `conic-gradient(
                pink ${percentage}% 0%,
                red ${percentage}% 100%
            )`);

            remainingTime--;
            if (remainingTime >= 0) {
                setTimeout(updateTimer, 1);
            } else {
                // Stop the ingredient animations when the timer is up
                $('.ingredient-img').css('animation', 'none'); // Stop all animations
                
                // Hide the timer and show the blend button again
                $(`#${timerId}`).hide();
                $(`#${buttonId}`).show();

                // Mark the cup as blended
                if (cups[cupId]) {
                    cups[cupId].setBlended();
                }
                // Mark the cup as blended
                if (cupElement) {
                    cupElement.classList.remove('blending'); // Remove the 'blending' class when done
                }
            }
        }
        updateTimer();
    }

    // Bind click event to blend buttons
    $('.blend-button').click(function() {
        // Get the cup ID
        const cupId = $(this).closest('.station').find('.cup').attr('id');

        const cupObject = cups[cupId];

        // If cup has whipped cream or syrup, remove them during blend
        if (cupObject.hasWhippedCream.length >= 1) {
            cupObject.hasWhippedCream = [false];
        }
        if (cupObject.syrup.length >= 1) {
            cupObject.syrup = [];
        }

        if (cupObject && cupObject.ingredient) {
            if (cupObject.ingredient.length >= 2 && cupObject.iceCream.length >= 1) {
                showBlendTimer(this.id, cupId);
                const newCupImage = cupObject.getBlendedImg();

                // Select the cup image and all ingredient images (except the first image)
                const cupImage = $('#' + cupId + ' img:first');
                const oldIngredientImages = $('#' + cupId + ' img:not(:first)');

                // Fade out the old ingredient images
                oldIngredientImages.fadeOut(2500);

                // Update the cup image source and fade it in
                cupImage.attr('src', newCupImage).attr('draggable', 'false').fadeIn(4000);

                // Get the dimensions and position of the cup
                const cup = $('#' + cupId);
                const cupWidth = cup.width();
                const cupHeight = cup.height();

                const ingredientSize = 30; // Width/height of the ingredient images
                const topOffset = 65; // Restrict top
                const bottomOffset = 12; // Restrict bottom
                const sidePadding = 38; // Padding to avoid too far left or right

                // Create and fade in new ingredient images
                cupObject.ingredient.forEach(ingredient => {
                    for (let i = 0; i < 8; i++) {
                        const ingredientImage = $('<img>')
                            .addClass('ingredient-img') // Add a class for styling
                            .attr('src', `./img/ingredients/${ingredient}.png`) // Dynamically set the src based on ingredient name
                            .attr('alt', ingredient)
                            .attr('draggable', 'false')
                            .css({
                                width: ingredientSize + 'px',  // Set a fixed width for the ingredient images
                                height: ingredientSize + 'px',
                                position: 'absolute', // Position absolute to place it over the cup
                                top: Math.random() * (cupHeight - ingredientSize - topOffset - bottomOffset) + topOffset + 'px', // Constrain within cup, avoid top 50px and bottom offset
                                left: Math.random() * (cupWidth - ingredientSize - 2 * sidePadding) + sidePadding + 'px', // Constrain to cup's width with side padding
                                display: 'none' // Initially hide the new ingredient images
                            });

                        // Append ingredient image to the cup div
                        cup.append(ingredientImage);
                        // Fade in the new ingredient image
                        ingredientImage.fadeIn(4000);
                    }
                });

            } else if (cupObject.ingredient.length === 0 && cupObject.iceCream.length === 0 && cupObject.hasWhippedCream[0] === false && cupObject.syrup.length === 0) {
                showErrorMessage("What are you blending? Air?");
            } else {
                showErrorMessage("Don't waste electricity! \nAdd more ingredients first.");
            }
        }
    });
});

