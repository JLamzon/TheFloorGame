const categories = {
    "Office Supplies": [
        { src: 'assets/KitchenSupplies/Ballpoint Pen.png', name: 'Pen' },
        { src: 'assets/KitchenSupplies/Business Card.png', name: 'Business Card' },
        { src: 'assets/KitchenSupplies/Calculator.png', name: 'Calculator' },
        { src: 'assets/KitchenSupplies/Calendar.png', name: 'Calendar' },
        { src: 'assets/KitchenSupplies/Clipboard.png', name: 'Clipboard' },
        { src: 'assets/KitchenSupplies/Compass.png', name: 'Compass' },
        { src: 'assets/KitchenSupplies/Envelope.png', name: 'Envelope' },
        { src: 'assets/KitchenSupplies/Eraser.png', name: 'Eraser' },
        { src: 'assets/KitchenSupplies/Fastener.png', name: 'Fastener' },
        { src: 'assets/KitchenSupplies/Flash Drive.png', name: 'Flash Drive' },
        { src: 'assets/KitchenSupplies/Glue.png', name: 'Glue' },
        { src: 'assets/KitchenSupplies/Highlighter.png', name: 'Highlighter' },
        { src: 'assets/KitchenSupplies/Hole Puncher.png', name: 'Hole Puncher' },
        { src: 'assets/KitchenSupplies/Manila Envelope.png', name: 'Manila Envelope' },
        { src: 'assets/KitchenSupplies/Mouse Pad.png', name: 'Mouse Pad' },
        { src: 'assets/KitchenSupplies/Notepad.png', name: 'Notepad' },
        { src: 'assets/KitchenSupplies/Paper Clips.png', name: 'Paper Clips' },
        { src: 'assets/KitchenSupplies/Paper Weight.png', name: 'Paper Weight' },
        { src: 'assets/KitchenSupplies/Pencil.png', name: 'Pencil' },
        { src: 'assets/KitchenSupplies/Permanent Marker.png', name: 'Permanent Marker' },
    ],
    "Fruits": [
        { src: 'path/to/apple.jpg', name: 'apple' },
        { src: 'path/to/banana.jpg', name: 'banana' }
    ],
    "Animals": [
        { src: 'path/to/apple.jpg', name: 'apple' },
        { src: 'path/to/banana.jpg', name: 'banana' }
    ],
    // More categories can be added here
};

let images = [];
let currentPlayer = 1;
let timer1 = 20;
let timer2 = 20;
let currentImageIndex = 0;
let player1Interval, player2Interval;

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('correct').addEventListener('click', handleCorrectGuess);
document.getElementById('wrong').addEventListener('click', handleWrongGuess);
document.getElementById('restart-game').addEventListener('click', restartGame);
document.addEventListener('DOMContentLoaded', populateCategories); // Ensures the DOM is fully loaded before running
document.getElementById('skip').addEventListener('click', handleSkip);

function populateCategories() {
    const dropdown = document.getElementById('category-dropdown');
    Object.keys(categories).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        dropdown.appendChild(option);
    });
}

function startGame() {
    const selectedCategory = document.getElementById('category-dropdown').value;
    if (!selectedCategory) {
        alert('Please select a category to start the game.');
        return;
    }

    let countdownValue = 3;
    const countdownDisplay = document.getElementById('countdown');
    const countdownSound = document.getElementById('countdown-sound');
    
    countdownSound.play(); // Play the sound once at the start of the countdown
    countdownDisplay.style.display = 'block';
    countdownDisplay.textContent = `Starting in ${countdownValue}...`;

    const countdownInterval = setInterval(() => {
        countdownValue--;
        countdownDisplay.textContent = `Starting in ${countdownValue}...`;
        
        if (countdownValue <= 0) {
            clearInterval(countdownInterval);
            countdownDisplay.style.display = 'none';

            // Proceed to start the game setup
            beginGameSetup(selectedCategory);
        }
    }, 1000);
}

function beginGameSetup(selectedCategory) {
    images = categories[selectedCategory];
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('player-info').style.display = 'block';
    document.getElementById('player2-info').style.display = 'block';
    document.getElementById('game-status').style.display = 'block';
    document.getElementById('category-selection').style.display = 'none';

    currentImageIndex = 0;
    document.getElementById('image').src = images[currentImageIndex].src;
    document.getElementById('status-message').innerText = `Player ${currentPlayer}'s Turn`;
    resetTimers();
    startTimer(currentPlayer);
}





function startTimer(player) {
    if (player === 1) {
        player1Interval = setInterval(() => {
            timer1--;
            document.getElementById('timer1').innerText = timer1;
            if (timer1 === 0) {
                clearInterval(player1Interval);
                endGame(1);
            }
        }, 1000);
    } else {
        player2Interval = setInterval(() => {
            timer2--;
            document.getElementById('timer2').innerText = timer2;
            if (timer2 === 0) {
                clearInterval(player2Interval);
                endGame(2);
            }
        }, 1000);
    }
}

function stopTimer(player) {
    if (player === 1) {
        clearInterval(player1Interval);
    } else {
        clearInterval(player2Interval);
    }
}

function handleCorrectGuess() {
    const correctSound = document.getElementById('correct-sound');

    // Stop the sound if it's already playing, and rewind it.
    correctSound.pause();
    correctSound.currentTime = 0;  // Rewind to the start of the sound
    correctSound.play();  // Play the correct sound effect

    stopTimer(currentPlayer);
    document.getElementById('status-message').innerText = `Correct! Player ${currentPlayer}'s turn is over.`;
    document.getElementById('answer').innerText = images[currentImageIndex].name; // Show correct answer

    // Use setTimeout to delay the next picture and reset operations
    setTimeout(() => {
        currentPlayer = currentPlayer === 1 ? 2 : 1; // Switch player
        currentImageIndex = (currentImageIndex + 1) % images.length;
        document.getElementById('image').src = images[currentImageIndex].src;
        document.getElementById('answer').innerText = ''; // Clear the answer for the next image
        document.getElementById('status-message').innerText = `Player ${currentPlayer}'s Turn`;
        startTimer(currentPlayer);
    }, 400); // Delay for 250 milliseconds (0.25 seconds)
}

function handleSkip() {
    // Optionally play a sound or provide feedback that the image was skipped
    const skipSound = document.getElementById('skip-sound');
    skipSound.play();

    // Move to the next image without changing the player or resetting the timers
    currentImageIndex = (currentImageIndex + 1) % images.length;
    document.getElementById('image').src = images[currentImageIndex].src;
    document.getElementById('status-message').innerText = `Skipped! Player ${currentPlayer}'s Turn Continues.`;

    // Optional: Reset timer if you decide each new image should come with a fresh start
    // resetTimers();
    // startTimer(currentPlayer);
}


function handleWrongGuess() {
    const wrongSound = document.getElementById('wrong-sound');
    wrongSound.play();

    document.getElementById('status-message').innerText = `Wrong! Player ${currentPlayer}, try again!`;
}

function endGame(losingPlayer) {
    const endGameSound = document.getElementById('end-game-sound');
    endGameSound.play(); // Play the end game sound effect

    stopTimer(1);
    stopTimer(2);
    document.getElementById('status-message').innerText = `Player ${losingPlayer} ran out of time! Game Over.`;
    document.getElementById('correct').disabled = true;
    document.getElementById('wrong').disabled = true;
    document.getElementById('skip').disabled = true;
    document.getElementById('restart-container').style.display = 'block';
}

function restartGame() {
    currentPlayer = 1;
    currentImageIndex = 0;
    resetTimers();
    
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('player-info').style.display = 'none';
    document.getElementById('player2-info').style.display = 'none';
    document.getElementById('game-status').style.display = 'none';
    document.getElementById('restart-container').style.display = 'none';
    document.getElementById('category-selection').style.display = 'block';
    
    document.getElementById('correct').disabled = false;
    document.getElementById('wrong').disabled = false;
    document.getElementById('skip').disabled = false;
    document.getElementById('status-message').innerText = '';
}

function resetTimers() {
    stopTimer(1);
    stopTimer(2);
    timer1 = 20;
    timer2 = 20;
    document.getElementById('timer1').innerText = timer1;
    document.getElementById('timer2').innerText = timer2;
}
