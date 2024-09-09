const categories = {
  "Office Supplies": [
    { src: "assets/KitchenSupplies/Ballpoint Pen.png", name: "Pen" },
    { src: "assets/KitchenSupplies/Business Card.png", name: "Business Card" },
    { src: "assets/KitchenSupplies/Calculator.png", name: "Calculator" },
    { src: "assets/KitchenSupplies/Calendar.png", name: "Calendar" },
    { src: "assets/KitchenSupplies/Clipboard.png", name: "Clipboard" },
    { src: "assets/KitchenSupplies/Compass.png", name: "Compass" },
    { src: "assets/KitchenSupplies/Envelope.png", name: "Envelope" },
    { src: "assets/KitchenSupplies/Eraser.png", name: "Eraser" },
    { src: "assets/KitchenSupplies/Fastener.png", name: "Fastener" },
    { src: "assets/KitchenSupplies/Flash Drive.png", name: "Flash Drive" },
    { src: "assets/KitchenSupplies/Glue.png", name: "Glue" },
    { src: "assets/KitchenSupplies/Highlighter.png", name: "Highlighter" },
    { src: "assets/KitchenSupplies/Hole Puncher.png", name: "Hole Puncher" },
    {
      src: "assets/KitchenSupplies/Manila Envelope.png",
      name: "Manila Envelope",
    },
    { src: "assets/KitchenSupplies/Mouse Pad.png", name: "Mouse Pad" },
    { src: "assets/KitchenSupplies/Notepad.png", name: "Notepad" },
    { src: "assets/KitchenSupplies/Paper Clips.png", name: "Paper Clips" },
    { src: "assets/KitchenSupplies/Paper Weight.png", name: "Paper Weight" },
    { src: "assets/KitchenSupplies/Pencil.png", name: "Pencil" },
    {
      src: "assets/KitchenSupplies/Permanent Marker.png",
      name: "Permanent Marker",
    },
  ],
  Fruits: [
    { src: "path/to/apple.jpg", name: "apple" },
    { src: "path/to/banana.jpg", name: "banana" },
  ],
  Animals: [
    { src: "path/to/apple.jpg", name: "apple" },
    { src: "path/to/banana.jpg", name: "banana" },
  ],
  // More categories can be added here
};

let images = [];
let currentPlayer = 1;
let timer1 = 100;
let timer2 = 100;
let answer = "";
let currentImageIndex = 0;
let player1Interval, player2Interval;
let popupWindow = null;

document.getElementById("start-game").addEventListener("click", startGame);
document
  .getElementById("correct")
  .addEventListener("click", handleCorrectGuess);
document.getElementById("wrong").addEventListener("click", handleWrongGuess);
document.getElementById("restart-game").addEventListener("click", restartGame);
document.addEventListener("DOMContentLoaded", populateCategories);
document.getElementById("skip").addEventListener("click", handleSkip);

function populateCategories() {
  const dropdown = document.getElementById("category-dropdown");
  Object.keys(categories).forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    dropdown.appendChild(option);
  });
}

function openPopup() {
  if (popupWindow && !popupWindow.closed) {
    popupWindow.focus();
  } else {
    popupWindow = window.open("popup.html", "Popup", "width=600,height=400");
  }
}

function updatePopup(data) {
  if (popupWindow && !popupWindow.closed) {
    popupWindow.postMessage(
      {
        ...data,
        currentPlayer, // Include the currentPlayer info
      },
      window.location.origin
    );
  }
}

function startGame() {
  const selectedCategory = document.getElementById("category-dropdown").value;
  if (!selectedCategory) {
    alert("Please select a category to start the game.");
    return;
  }

  openPopup(); // Open the popup window when the game starts

  let countdownValue = 3;
  const countdownDisplay = document.getElementById("countdown");
  const countdownSound = document.getElementById("countdown-sound");

  countdownSound.play(); // Play the sound once at the start of the countdown
  countdownDisplay.style.display = "block";
  countdownDisplay.textContent = `Starting in ${countdownValue}...`;

  const countdownInterval = setInterval(() => {
    countdownValue--;
    countdownDisplay.textContent = `Starting in ${countdownValue}...`;

    if (countdownValue <= 0) {
      clearInterval(countdownInterval);
      countdownDisplay.style.display = "none";

      // Proceed to start the game setup
      beginGameSetup(selectedCategory);
    }
  }, 1000);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

function beginGameSetup(selectedCategory) {
  images = categories[selectedCategory];
  shuffleArray(images);
  document.getElementById("game-container").style.display = "block";
  document.getElementById("player-info").style.display = "block";
  document.getElementById("player2-info").style.display = "block";
  document.getElementById("game-status").style.display = "block";
  document.getElementById("answer").style.display = "block";
  document.getElementById("answer").innerText = images[currentImageIndex].name; // Show correct answer
  document.getElementById("category-selection").style.display = "none";

  currentImageIndex = 0;
  document.getElementById("image").src = images[currentImageIndex].src;
  document.getElementById(
    "status-message"
  ).innerText = `Player ${currentPlayer}'s Turn`;
  startTimer(currentPlayer);
}

// function startTimer(player) {
//     if (player === 1) {
//         document.getElementById('timer1').classList.add('timer-red');
//         player1Interval = setInterval(() => {
//             timer1--;
//             document.getElementById('timer1').innerText = timer1;
//             updatePopup({ timer1, timer2, imageSrc: images[currentImageIndex].src, imageName: images[currentImageIndex].name });
//             if (timer1 <= 0) {
//                 clearInterval(player1Interval);
//                 endGame(1);
//             }
//         }, 1000);
//     } else {
//         document.getElementById('timer2').classList.add('timer-red');
//         player2Interval = setInterval(() => {
//             timer2--;
//             document.getElementById('timer2').innerText = timer2;
//             updatePopup({ timer1, timer2, imageSrc: images[currentImageIndex].src, answer: images[currentImageIndex].name });
//             if (timer2 <= 0) {
//                 clearInterval(player2Interval);
//                 endGame(2);
//             }
//         }, 1000);
//     }
// }

function startTimer(player) {
  if (player === 1) {
    player1Interval = setInterval(() => {
      timer1--;
      document.getElementById("timer1").innerText = timer1;
      updatePopup({
        timer1,
        timer2,
        imageSrc: images[currentImageIndex].src,
        imageName: images[currentImageIndex].name,
        statusMessage: `Player ${currentPlayer}'s Turn`,
      });
      if (timer1 <= 0) {
        clearInterval(player1Interval);
        endGame(1);
      }
    }, 1000);
  } else {
    player2Interval = setInterval(() => {
      timer2--;
      document.getElementById("timer2").innerText = timer2;
      updatePopup({
        timer1,
        timer2,
        imageSrc: images[currentImageIndex].src,
        imageName: images[currentImageIndex].name,
        statusMessage: `Player ${currentPlayer}'s Turn`,
      });
      if (timer2 <= 0) {
        clearInterval(player2Interval);
        endGame(2);
      }
    }, 1000);
  }
}

function handleCorrectGuess() {
  const correctSound = document.getElementById("correct-sound");
  correctSound.play();
  pauseCurrentTimer(); // Pause the current timer
  document.getElementById(
    "status-message"
  ).innerText = `Correct! Player ${currentPlayer}'s turn is over.`;

  // Send the correct answer to the popup with an indication that it should be shown briefly
  updatePopup({
    timer1,
    timer2,
    imageSrc: images[currentImageIndex].src,
    imageName: images[currentImageIndex].name, // Send answer to popup
    statusMessage: `Correct! Player ${currentPlayer}'s turn is over.`,
    currentPlayer,
    showAnswer: true, // Indicate that the answer should be shown
  });

  // Move to the next image and player
  setTimeout(() => {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    document.getElementById("image").src = images[currentImageIndex].src;
    document.getElementById("answer").innerText = ""; // Clear the answer for the next image
    document.getElementById(
      "status-message"
    ).innerText = `Player ${currentPlayer}'s Turn`;

    // Resume the new player's timer
    resumeTimer(currentPlayer);
  }, 1000); // Delay before switching players and starting the new timer
}

function handleSkip() {
  const skipSound = document.getElementById("skip-sound");
  skipSound.play();
  pauseCurrentTimer(); // Pause the current timer
  document.getElementById(
    "status-message"
  ).innerText = `Skipped! Player ${currentPlayer}'s Turn Continues.`;

  // Send the skip action to the popup with an indication to show the answer
  updatePopup({
    timer1,
    timer2,
    imageSrc: images[currentImageIndex].src,
    statusMessage: `Skipped! Player ${currentPlayer}'s Turn Continues.`,
    currentPlayer,
    showAnswer: true, // Indicate that the answer should be shown
  });

  // Move to the next image
  setTimeout(() => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    document.getElementById("image").src = images[currentImageIndex].src;

    // Resume the timer for the current player
    resumeTimer(currentPlayer);
  }, 1000); // Delay before updating image and resuming the timer
}

function stopTimer(player) {
  if (player === 1) {
    clearInterval(player1Interval);
  } else {
    clearInterval(player2Interval);
  }
}

function pauseCurrentTimer() {
  stopTimer(currentPlayer);
  document.getElementById("timer1").classList.remove("timer-red");
  document.getElementById("timer2").classList.remove("timer-red");
}

function resumeTimer(player) {
  startTimer(player);
}

// function handleCorrectGuess() {
//     const correctSound = document.getElementById('correct-sound');
//     correctSound.play();
//     pauseCurrentTimer(); // Pause the current timer
//     document.getElementById('status-message').innerText = `Correct! Player ${currentPlayer}'s turn is over.`;

//     // Move to the next image and player
//     setTimeout(() => {
//         currentPlayer = currentPlayer === 1 ? 2 : 1;
//         currentImageIndex = (currentImageIndex + 1) % images.length;
//         document.getElementById('image').src = images[currentImageIndex].src;
//         document.getElementById('answer').innerText = images[currentImageIndex].name; // Show correct answer
//         // document.getElementById('answer').innerText = ''; // Clear the answer for the next image
//         document.getElementById('status-message').innerText = `Player ${currentPlayer}'s Turn`;

//         // Resume the new player's timer
//         resumeTimer(currentPlayer);
//     }, 1000); // Delay before switching players and starting the new timer
// }

function handleWrongGuess() {
  const wrongSound = document.getElementById("wrong-sound");
  wrongSound.play();
  document.getElementById(
    "status-message"
  ).innerText = `Wrong! Player ${currentPlayer}, try again!`;
}

// function handleSkip() {
//     const skipSound = document.getElementById('skip-sound');
//     skipSound.play();
//     pauseCurrentTimer(); // Pause the current timer
//     document.getElementById('status-message').innerText = `Skipped! Player ${currentPlayer}'s Turn Continues.`;
//     setTimeout(() => {
//         currentImageIndex = (currentImageIndex + 1) % images.length;
//         document.getElementById('image').src = images[currentImageIndex].src;
//         updatePopup({ timer1, timer2, imageSrc: images[currentImageIndex].src });

//         // Resume the timer for the current player
//         resumeTimer(currentPlayer);
//     }, 1000); // Delay before updating image and resuming the timer
// }

function endGame(losingPlayer) {
  const endGameSound = document.getElementById("end-game-sound");
  endGameSound.play();
  stopTimer(1);
  stopTimer(2);
  document.getElementById(
    "status-message"
  ).innerText = `Player ${losingPlayer} ran out of time! Game Over.`;
  document.getElementById("correct").disabled = true;
  document.getElementById("wrong").disabled = true;
  document.getElementById("skip").disabled = true;
  document.getElementById("restart-container").style.display = "block";

  // Send game over message to the popup
  if (popupWindow && !popupWindow.closed) {
    popupWindow.postMessage(
      {
        gameOver: true,
        losingPlayer: losingPlayer,
      },
      window.location.origin
    );
  }
}

function restartGame() {
  currentPlayer = 1;
  currentImageIndex = 0;
  timer1 = 100;
  timer2 = 100;
  document.getElementById("timer1").innerText = 100;
  document.getElementById("timer2").innerText = 100;

  document.getElementById("game-container").style.display = "none";
  document.getElementById("player-info").style.display = "none";
  document.getElementById("player2-info").style.display = "none";
  document.getElementById("game-status").style.display = "none";
  document.getElementById("restart-container").style.display = "none";
  document.getElementById("category-selection").style.display = "block";

  document.getElementById("correct").disabled = false;
  document.getElementById("wrong").disabled = false;
  document.getElementById("skip").disabled = false;
  document.getElementById("status-message").innerText = "";

  const selectedCategory = document.getElementById("category-dropdown").value;
  images = categories[selectedCategory];
  shuffleArray(images);
}
