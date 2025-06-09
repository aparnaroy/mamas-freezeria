import Ticket from './ticket.js'; // Ensure the correct path
import { game } from './game.js';
import { removeTicketHTML } from './cup-ingredients-animate.js';

let full_duration;
let ticketInterval; // To store the ticket creation interval
let updateInterval; // To store the ticket update interval

$(function () {
    let currentTicketNum = 0;
    const ticketSound = document.getElementById('ticketSound');

    // Create the first ticket immediately
    createTicket();
    
    // Set up intervals and store their IDs
    ticketInterval = setInterval(createTicket, 40000); // Create tickets every 40 seconds
    updateInterval = setInterval(updateTickets, 1000); // Update tickets every second

    // Random Ticket Generation
    function generateTicket() {
        currentTicketNum++;
        const newTicket = new Ticket(currentTicketNum);
        game.tickets.push(newTicket); // Store the ticket in the global array
        const ticketHTML = newTicket.render();

        $('#ticketPlaceholder' + currentTicketNum).replaceWith(ticketHTML);

        if (ticketSound) {
            ticketSound.play().catch(function (error) {
                console.log("Failed to play ticket sound: ", error);
            });
        }
    }

    function createTicket() {
        if (game.tickets.length < 7) {
            console.log("New ticket created");
            const numTickets = game.tickets.length + 1;
            const newTicket = new Ticket(numTickets);
            game.tickets.push(newTicket);
            const ticketHTML = newTicket.render();
            $('#ticketPlaceholder' + game.tickets.length).replaceWith(ticketHTML);
        }
    }

    // Controls time bar animation, updates every second
    function updateTickets() {
        game.tickets.forEach((ticket) => {
            // Determine the duration based on the game score
            if (game.score < 200) {
                full_duration = 50;
            } else if (game.score < 500) {
                full_duration = 45;
            } else if (game.score < 1000) {
                full_duration = 40;
            } else {
                full_duration = 35;
            }

            const ticketElement = $('#ticket' + ticket.ticketNum);
            const timeBar = ticketElement.find('.time-bar');
            const elapsedTime = (Date.now() - ticket.creationTime) / 1000; // Elapsed time in seconds
            const remainingTime = full_duration - elapsedTime; // Calculate remaining time

            if (elapsedTime >= full_duration) {
                // Ticket has expired
                timeBar.width('0%'); // Set the time bar to zero width
                timeBar.css('background-color', '#FF0000'); // Set it to red when time is up
                
                // Play losing sound
                if (ticketLosingSound) {
                    ticketLosingSound.play().catch(function (error) {
                        console.error("Failed to play ticket losing sound:", error);
                    });
                }
                
                // Remove ticket from the game state
                game.tickets = game.tickets.filter((t) => t.ticketNum !== ticket.ticketNum); 
                const redX = $('#ticket' + ticket.ticketNum + ' .red-x'); // Get the red X element
                redX.css('opacity', '1'); // Show X

                setTimeout(() => {
                    removeTicketHTML(ticket.ticketNum); // Remove ticket HTML
                    game.addStrike(); // Add a strike
                    var ticketInteger = ticket.ticketNum;
                    var replacementTicket = new Ticket(ticketInteger);
                    var replacementHTML = replacementTicket.render();
                    $('#ticketPlaceholder' + ticketInteger).replaceWith(replacementHTML);
                    game.tickets[ticketInteger] = replacementTicket;
                }, 1000);
            } else {
                const timeBarWidth = 100 - (elapsedTime / full_duration) * 100;
                timeBar.width(timeBarWidth + '%');

                // Update the color based on remaining time
                if (remainingTime <= full_duration * 0.35) {
                    timeBar.css('background-color', '#FF0000');
                    if (!ticket.hasWarningPlayed) {
                        if (timeWarningSound) {
                            timeWarningSound.play().catch(function (error) {
                                console.error("Failed to play time warning sound:", error);
                            });
                        }
                        ticket.hasWarningPlayed = true; // Ensure sound plays only once per ticket
                    }
                } else if (remainingTime <= full_duration * 0.55) {
                    timeBar.css('background-color', '#fcc428');
                } else {
                    timeBar.css('background-color', '#88B954');
                }
            }
        });
    }
});

// For when the game is over
function stopTickets() {
    // Stop creating new tickets
    clearInterval(ticketInterval);
    // Stop updating tickets
    clearInterval(updateInterval);
}

export { stopTickets }; 