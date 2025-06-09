import { ticketsCompleted } from './cup-ingredients-animate.js';
import { stopTickets } from './ticket-generation.js';

class Game {
    constructor() {
        this.score = 0;
        this.strikes = 0;
        this.tickets = [];
    }

    incrementScore(score) {
        this.score += score;

        // Show score being added to score display with green popup
        const plusSign = document.createElement('div');
        plusSign.innerText = "+" + score;
        plusSign.classList.add('scorePopup');
        const container = document.getElementById('scorePopupContainer');
        container.appendChild(plusSign);
        // Remove the element after the animation ends
        setTimeout(() => {
            plusSign.remove();
        }, 4000);

        this.updateScoreDisplay();

        // Play the score sound when the score is incremented
        const scoreSound = document.getElementById('scoreSound');
        if (scoreSound) {
            scoreSound.play().catch(function (error) {
                console.error("Failed to play score sound:", error);
            });
        }
    }

    resetScore() {
        this.score = 0;
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        document.getElementById("score").innerText = this.score;
    }

    addStrike() {
        this.strikes++;
        if (this.strikes < 3) {
            const strikeElement = document.getElementById(`strike-${this.strikes}`);
            if (strikeElement) {
                strikeElement.classList.add('missed');
            }
        } else {
            const strikeElement = document.getElementById(`strike-${this.strikes}`);
            if (strikeElement) {
                strikeElement.classList.add('missed');
            }
            this.gameOver();
        }
    }

    resetStrikes() {
        this.strikes = 0;
        for (let i = 1; i <= 3; i++) {
            const strikeElement = document.getElementById(`strike-${i}`);
            if (strikeElement) {
                strikeElement.classList.remove('missed');
            }
        }
    }

    gameOver() {
        // Game over sound effect
        const gameOverSound = document.getElementById('gameOverSound');
        if (gameOverSound) {
            gameOverSound.play().catch(function (error) {
                console.error("Failed to play game over sound:", error);
            });
        }

        // Display the game over pop-up
        const popup = document.getElementById('game-over-popup');
        const finalScore = document.getElementById('final-score');
        const ticketsFinished = document.getElementById('tickets-completed');
        finalScore.innerText = this.score;
        ticketsFinished.innerText = ticketsCompleted;
        popup.style.display = 'flex';

        // Stop the ticket generation and update intervals
        stopTickets();
    }
}

// Helper function to close the end game pop-up
function closeGameOver() {
    const popup = document.getElementById('game-over-popup');
    popup.style.display = 'none';
    location.reload();
}

const game = new Game();

$(function () {
    game.updateScoreDisplay(); // Ensure this is called after the DOM is ready

    // Make game a global variable
    window.game = game;

    const resize = () => {
        const { innerWidth: width, innerHeight: height } = window;
        const aspectRatio = 1770 / 1000;
        let scale;

        if (width / height > aspectRatio) {
            scale = (height * aspectRatio) / 1770;
        } else {
            scale = width / 1770;
        }

        const scaleWindow = document.getElementById("scale-window");

        if (scaleWindow) {
            const { style, offsetWidth, offsetHeight } = scaleWindow;

            style.transform = `scale(${scale})`;

            // Center the scaleWindow
            const scaleWindowWidth = offsetWidth * scale;
            const scaleWindowHeight = offsetHeight * scale;
            style.position = 'absolute';
            style.left = `${(width - scaleWindowWidth) / 2}px`;
            style.top = `${(height - scaleWindowHeight) / 2}px`;
        }
    };

    // Handle resize events
    window.addEventListener("resize", resize);

    // Add event listener for the "Play Again" button
    document.getElementById('play-again-button').addEventListener('click', closeGameOver);

    // Call resize initially
    resize();
});

export { game };