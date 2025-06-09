import Cup from './cup.js';
import Ticket from './ticket.js';
import { game } from './game.js';

// Define cups and cupCount globally
let cupCount = 3; // Initial number of cups to generate unique cup IDs
export let cups = {}; // Object to keep track of all cups
export let ticketsCompleted = 0;

function removeTicketHTML(ticketNum) {
    // console.log("id of ticket removed: " + ticketNum);
    $('#ticket' + ticketNum).replaceWith(`<div id='ticketPlaceholder${ticketNum}' class='ticket'></div>`); // Remove the ticket's HTML element
}

// Show a popup error message when a cup is rejected from done-droparea
function showErrorMessage(message) {
    if (errorSound) {
        errorSound.play().catch(function (error) {
            console.error("Failed to play error sound:", error);
        });
    }
    const popup = document.getElementById('errorMessage');
    popup.innerText = message; // Set the message text
    popup.classList.add('show');
    popup.classList.remove('hidden');
    // Hide the popup after 3 seconds
    setTimeout(() => {
        popup.classList.remove('show');
        popup.classList.add('hidden');
    }, 3000); // 3000ms = 3 seconds
}

// Handles dragging and dropping cups to the trash + done areas and replacing them with new cups
$(function () {
    // Initialize cups
    $('.cup').each(function () {
        const cupId = $(this).attr('id');
        cups[cupId] = new Cup();
    });

    // Dragging cup to trash or done
    $(document).on('dragstart', '.cup', function (e) {
        const cupId = $(this).attr('id');
        // Prevent dragging if the cup is blending
        if (cups[cupId] && cups[cupId].blending) {
            e.preventDefault(); // Stop the drag action
            console.log('Cup is blending and cannot be dragged');
            return;
        }

        $(this).css('opacity', '.3'); // Make the cup invisible while dragging
        e.originalEvent.dataTransfer.setData('text/plain', $(this).attr('id'));

        // Show and start animating the dashed outlines
        $('.trash-dashed-outline').css({
            opacity: 1,
            animation: 'pulse-trash-outline .8s infinite'
        });
        $('.done-dashed-outline').css({
            opacity: 1,
            animation: 'pulse-done-outline .8s infinite'
        });

        // Show drop areas
        $('#trash-droparea, #done-droparea').css('visibility', 'visible');
    });

    $(document).on('dragend', '.cup', function () {
        $(this).css('opacity', '1');   // Make the cup visible again on drag end

        // Hide and stop animating the dashed outlines
        $('.trash-dashed-outline, .done-dashed-outline').css({
            opacity: 0,
            animation: 'none'
        });

        // Hide drop areas
        $('#trash-droparea, #done-droparea').css('visibility', 'hidden');
    });

    // Allow drop on trash while holding cup over it
    $('#trash-droparea').on('dragover', function (e) {
        e.preventDefault();
        $('.trash-dashed-outline').css('animation-play-state', 'paused');
    });

    // Allow drop on done while holding cup over it
    $('#done-droparea').on('dragover', function (e) {
        e.preventDefault();
        $('.done-dashed-outline').css('animation-play-state', 'paused');
    });

    // Resume animation when cup leaves trash area without dropping
    $('#trash-droparea').on('dragleave', function () {
        $('.trash-dashed-outline').css('animation-play-state', 'running');
    });

    // Resume animation when cup leaves done area without dropping
    $('#done-droparea').on('dragleave', function () {
        $('.done-dashed-outline').css('animation-play-state', 'running');
    });

    // Remove cup when it's dragged to trash and replace it with a new one
    $('#trash-droparea').on('drop', function (e) {
        e.preventDefault();
        // Hide and stop animating the dashed outlines
        $('.trash-dashed-outline, .done-dashed-outline').css({
            opacity: 0,
            animation: 'none',
            'animation-play-state': 'running'
        });

        // Hide drop areas
        $('#trash-droparea, #done-droparea').css('visibility', 'hidden');

        const cupId = e.originalEvent.dataTransfer.getData('text/plain');

        // Play the trash sound
        const trashSound = document.getElementById('trashSound');
        if (trashSound) {
            trashSound.play().catch(function (error) {
                console.error("Failed to play trash sound:", error);
            });
        }
        replaceCup(cupId);
    });

    // Remove cup when it's dragged to done and replace it with a new one
    $('#done-droparea').on('drop', function (e) {
        e.preventDefault();
        // Hide and stop animating the dashed outlines
        $('.trash-dashed-outline, .done-dashed-outline').css({
            opacity: 0,
            animation: 'none',
            'animation-play-state': 'running'
        });
    
        // Hide drop areas
        $('#done-droparea, #trash-droparea').css('visibility', 'hidden');
    
        const cupId = e.originalEvent.dataTransfer.getData('text/plain'); // Get the ID of the dragged element
        let matchFound = false; // Track if a match was found
        let messageReceived = false;
    
        for (let i = 0; i < game.tickets.length; i++) {
            const result = compareCup(cups[cupId], game.tickets[i]); // Get the detailed result
    
            if (result.matched) {
                // Adds points to the player's score
                addScore(game.tickets[i]);
                removeTicketHTML(game.tickets[i].ticketNum); // Remove the ticket's HTML
                ticketsCompleted++;
    
                // Automatically creates a new ticket to fill the ticket that was completed
                var ticketInteger = i + 1;
                var replacementTicket = new Ticket(ticketInteger);
                var replacementHTML = replacementTicket.render();
                $('#ticketPlaceholder' + ticketInteger).replaceWith(replacementHTML);
                game.tickets[i] = replacementTicket;
    
                replaceCup(cupId); // Replace the cup
                matchFound = true; // Mark that a match was found
                break; // Exit the loop once a match is found
            } else if (result.message) {
                messageReceived = true;
                showErrorMessage(result.message);
            }
        }
        
        if (!matchFound && !messageReceived) {
            showErrorMessage("Whose order is this? \nIt doesn't match any tickets.");
            console.log("Cup does not match any tickets RAHHH.");
        }
    });
    

    function addScore(ticket) {
        // Use ticket.ticketNum to find the corresponding ticket div
        const ticketDiv = $('#ticket' + ticket.ticketNum);

        // Get the width of time-bar div
        const timeBarWidth = ticketDiv.find('.time-bar').width();

        // The full width of the time-bar is 100 
        const fullWidth = 100;

        // Calculate the remaining time as a percentage
        const remainingTimePercentage = (timeBarWidth / fullWidth) * 100;

        // Add the remaining time to the player's score
        const scoreToAdd = Math.round(remainingTimePercentage); // Convert to an integer score
        game.incrementScore(scoreToAdd);
    }

    function compareCup(cup, ticket) {
        // Compare the cup and ticket here
        if (!ticket) {
            console.log("No ticket available for comparison.");
            return { matched: false, message: "All tickets have expired." };
        }
    
        const isBlended = cup.blended;
    
        // Comparison logic
        if (cup.ingredient) {
            if (cup.ingredient.length === 2) {
                if (
                    (cup.iceCream[0] === ticket.iceCream && cup.iceCream.length === 1) &&
                    (
                        (cup.ingredient[0] === ticket.ingredient1 && cup.ingredient[1] === ticket.ingredient2) ||
                        (cup.ingredient[0] === ticket.ingredient2 && cup.ingredient[1] === ticket.ingredient1)
                    ) &&
                    (cup.syrup[0] === ticket.syrup && cup.syrup.length === 1) &&
                    (cup.hasWhippedCream[0] === ticket.whippedCream && cup.hasWhippedCream.length === 1)
                ) {
                    if (isBlended) {
                        console.log("Cup matches the ticket and has been blended!");
                        return { matched: true, message: "Cup matches the ticket and has been blended!" };
                    } else {
                        console.log("Cup matches the ticket but hasn't been blended.");
                        return { matched: false, message: "Did you blend it?" };
                    }
                } else {
                    console.log("Cup does not match any tickets.");
                    return { matched: false };
                }
            } else if (cup.ingredient.length > 2) {
                console.log("Cup has more than 2 ingredients.");
                return { matched: false, message: "The ingredients combo is wrong." };
            } else {
                console.log("Cup doesn't have enough ingredients.");
                return { matched: false, message: "There aren't enough ingredients!" };
            }
        }
    }
    

    // function removeTicketHTML(ticketNum) {
    //     console.log("id of ticket removed: " + ticketNum);
    //     $('#ticket' + ticketNum).replaceWith(`<div id='ticketPlaceholder` + ticketNum + `' class='ticket'></div>`); // Remove the ticket's HTML element
    // }


    function replaceCup(cupId) {
        cupCount++; // Increment the cup count for a unique ID
        const newCupId = 'cup' + cupCount; // Create a new unique cup ID

        // Create a new cup object
        const newCup = new Cup(newCupId);
        cups[newCupId] = newCup;

        // Create a new cup element
        var newCupElement = $('<div>', {
            id: newCupId,
            class: 'cup',
            draggable: 'true',
            html: '<img alt="Milkshake Cup" src="./img/cup.png" draggable="false" />'
        });

        // Insert the new cup in place of the old one
        $('#' + cupId).replaceWith(newCupElement);

        // Add drop animation to new cup
        newCupElement[0].offsetHeight;
        newCupElement.addClass('drop');
    }

    $(document).on('click', '.cup', function () {
        console.log('Cup ID:', $(this).attr('id'));
    });

    // Ingredients animation logic
    let holdingImage = null;
    let ingredientType = null; // Declare ingredientType here

    // Handle mousedown event on any ingredient
    $('.ingredient').on('mousedown', function (event) {
        event.preventDefault();

        // Get the ingredient image path from the data attribute
        const ingredientImagePath = $(this).data('draggable-ingredient');
        ingredientType = $(this).data('ingredient-type'); // Get the ingredient type here
        // Create an image element for the scoop
        holdingImage = $('<img>', {
            src: ingredientImagePath,
            class: 'holding-image',
            css: {
                position: 'absolute',
                pointerEvents: 'none', // Make sure the image doesn't interfere with other elements
                zIndex: 1000, // Ensure the image is on top
                width: '70px', // Ingredients size while dragging it
                height: 'auto',
                left: event.pageX + 'px', // Start the image at the cursor position
                top: event.pageY + 'px' // Start the image at the cursor position
            }
        });

        // Append the image to the body
        $('body').append(holdingImage);

        // Update the position of the image to follow the cursor
        $(document).on('mousemove.holding', function (event) {
            holdingImage.css({
                left: event.pageX + 'px',
                top: event.pageY + 'px'
            });
        });

        // Handle mouseup event to drop the ingredient into a cup
        $(document).on('mouseup.holding', function (event) {
            // Check if the mouse is over a cup
            const cup = $(event.target).closest('.cup');
            if (cup.length > 0) {
                let ingredientClass = 'cup-ingredients';
                if (ingredientType === 'whipped-cream') {
                    ingredientClass = 'cup-whipped-cream';
                } else if (ingredientType === 'syrup') {
                    ingredientClass = 'cup-syrup';
                } else if (ingredientType === 'ice-cream') {
                    ingredientClass = 'cup-ice-cream';
                } else if (ingredientType === 'sprinkles') {
                    ingredientClass = 'cup-sprinkles';
                } else if (ingredientType === 'ingredient') {
                    ingredientClass = 'cup-ingredient';
                }

                // Update the cup object with the new ingredient
                const cupId = cup.attr('id');
                const cupObject = cups[cupId];

                // Prevent ingredient from being dragged to a blending cup
                if (cupObject && cupObject.blending) {
                    console.log('Cup is blending. No ingredients can be added.');
                } else {
                    // Check if the cup already contains ice cream
                    const hasIceCream = cupObject.hasIceCream();

                    // Modify ingredient positioning based on the presence of ice cream
                    let ingredientPosition = '';
                    if (ingredientType !== 'ice-cream' && !hasIceCream) {
                        ingredientPosition = 'bottom: 20px;';
                    } else {
                        ingredientPosition = ''; // Use default positioning from CSS
                    }

                    if (cupObject.hasWhippedCream[0] !== true && ingredientType === 'syrup') {
                        showErrorMessage("Did your training go out the window? \nWhipped cream before syrup!");
                        console.log("Syrup can only be added after whipped cream");
                    } else {
                        // Append the ingredient to the cup with the correct positioning
                        cup.append(`<img src="${ingredientImagePath}" class="${ingredientClass}" style="${ingredientPosition}" alt="Ingredient" draggable="false" />`);
                        const ingredientAddSound = document.getElementById('ingredientAddSound');
                        if (ingredientAddSound) {
                            ingredientAddSound.play().catch(function (error) {
                                console.error("Failed to play ingredient add sound:", error);
                            });
                        }
                        const trimmedImagePath = ingredientImagePath.split('/').pop().replace('.png', '');
                        switch (ingredientType) {
                            case 'ice-cream':
                                cupObject.setIceCream(trimmedImagePath);
                                break;
                            case 'ingredient':
                                cupObject.addIngredient(trimmedImagePath);
                                break;
                            case 'sprinkles':
                                cupObject.addIngredient(trimmedImagePath);
                                break;
                            case 'syrup':
                                cupObject.setSyrup(trimmedImagePath);
                                break;
                            case 'whipped-cream':
                                cupObject.setWhippedCream(true);
                                break;
                            default:
                                console.log("Error: Unknown ingredient type");
                                break;
                        }
                    }
                }
            }

            // Remove the holding image and event listeners
            holdingImage.remove();
            holdingImage = null;
            $(document).off('mousemove.holding mouseup.holding');
        });
    });
});

export { removeTicketHTML }; // Export the function for use in other files
export { showErrorMessage };