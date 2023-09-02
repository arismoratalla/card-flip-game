<template>
  <div class="outer-container">
    <div class="tries-container">
      Remaining Tries:
      <br/>
      <h1>{{ remainingTries }}</h1>
      
    </div>
    <div id="game-container" class="game-container">
      <Flashcard 
        v-for="(card, index) in shuffledFlashcards" 
        :key="index"
        @cardClicked="decrementTries(card.status)"
        :externalToggle="resetToggle"
        :headerFront="card.headerFront" 
        :front="card.front" 
        :back="card.back"
        :footerFront="card.footerFront"
        :status="card.status"
        :isGameActive="isGameActive">
      </Flashcard>
    </div>
    <div v-if="gameOver" class="modal">
    <div class="modal-content">
        <!-- <span class="close-button" @click="resetGame">×</span> -->
        <div v-if="remainingTries === 0" class="game-over-message">
          Game Over! <br/> You have no more tries.
        </div>
        <div v-if="remainingTries > 0" class="game-over-message">
          Congratulations! <br/> You win! <br>
          Claim your Voucher<br>for the Bazaar!!!
        </div><br>
        <button @click="resetGame" class="reset-button">Reset Game</button>
      </div>
    </div>

    <div class="stats-container">
      <h3>Statistics</h3>
      <div>Wins on 1st try: {{ stats.firstTryWins }}</div>
      <div>Wins on 2nd try: {{ stats.secondTryWins }}</div>
      <div>Wins on 3rd try: {{ stats.thirdTryWins }}</div>
      <div>Total fails: {{ stats.totalFails }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Flashcard from '../components/Flashcard.vue';

import confetti from 'canvas-confetti';
import useSound from "vue-use-sound";

import selectCard from '../assets/audio/select-card.mp3'
import selectAndWin from '../assets/audio/win.mp3'
import selectAndLose from '../assets/audio/lose.wav'

const router = useRouter();
let confettiInterval, audio;

// Computed property to get shuffled flashcards
const shuffledFlashcards = computed(() => shuffleArray([...flashcards.value]));
const resetToggle = ref(false);

const unflipAllCards = () => {
  resetToggle.value = false; // Unflip all cards
  setTimeout(() => { resetToggle.value = null; }, 50); // Allow DOM to update
};

const playMusic = () => {
  audio = new Audio('../assets/audio/bmg.mp3');
  audio.loop = true;
  audio.play();
}

const [selectcard] = useSound(selectCard);
const [selectandwin] = useSound(selectAndWin);
const [selectandlose] = useSound(selectAndLose);

onMounted(() => {
  loadStats();
  playMusic();
});

onUnmounted(() => {
  if (audio) {
    audio.pause();
  }
  if (confettiInterval) {
    clearInterval(confettiInterval);
  }
});

const gameOver = ref(false);
const remainingTries = ref(3);
const stats = ref({
  firstTryWins: 0,
  secondTryWins: 0,
  thirdTryWins: 0,
  totalFails: 0,
});

const loadStats = () => {
  const loadedStats = localStorage.getItem('gameStats');
  if (loadedStats) {
    stats.value = JSON.parse(loadedStats);
  }
};

const saveStats = () => {
  localStorage.setItem('gameStats', JSON.stringify(stats.value));
};

const updateStats = (status) => {
  const triesUsed = 3 - remainingTries.value;
  if (status === 'win') {
    if (triesUsed === 0) stats.value.firstTryWins++;
    else if (triesUsed === 1) stats.value.secondTryWins++;
    else if (triesUsed === 2) stats.value.thirdTryWins++;
  } else {
    stats.value.totalFails++;
  }
  saveStats();
};

let myCanvas = document.createElement('canvas');
document.body.appendChild(myCanvas);

const myConfetti = confetti.create(myCanvas, {
  resize: true,
  useWorker: true
});

const colors = ['#bb0000', '#F7DC6F', '#58D68D'];

const winAnimation = () => {
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 65,
    origin: { x: 0 },
    colors: colors
  });
  confetti({
    particleCount: 50,
    angle: 120,
    spread: 65,
    origin: { x: 1 },
    colors: colors
  });
}

const generateFlashcards = (totalCards, maxWinCards) => {
  const cards = [];
  let winCount = 0;
  for (let i = 0; i < totalCards; i++) {
    let winOrLose = 'tryAgain';
    if (winCount < maxWinCards && Math.random() > 0.85) {
      winOrLose = 'win';
      winCount++;
    }
    cards.push({ 
      status: winOrLose, 
      back: winOrLose === 'win' ? 'You Win' : 'Please Try Again',
    });
  }
  return cards;
};

const resetGame = () => {
  // location.reload();
  unflipAllCards();
  remainingTries.value = 3;
  gameOver.value = false;
  flashcards.value = generateFlashcards(18, 3); // Resetting the flashcards
};

const flashcards = ref(generateFlashcards(18, 3));

const decrementTries = (status) => {
  if (gameOver.value) {
    selectandlose();
    return;
  }

  if (status === 'win') {
    updateStats(status);
    gameOver.value = true;
    selectandwin();
    if (confettiInterval) clearInterval(confettiInterval);

    // Start new confetti interval
    confettiInterval = setInterval(winAnimation, 250);  // Call winAnimation every 500 milliseconds

    // Stop the confetti after 5 seconds
    setTimeout(() => {
      clearInterval(confettiInterval);
    }, 15000);

    return;
  }

  selectcard();
  remainingTries.value--;

  if (remainingTries.value === 0) {
    updateStats('lose');
    selectandlose();
    gameOver.value = true;
  }
};

function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

</script>

<style scoped>
.outer-container {
  display: flex;
  align-items: center; /* Center items vertically */
  justify-content: center; /* Center items horizontally */
  height: 90vh; /* Take up the full viewport height */
  width: 100%;  /* Take up the full viewport width */
}
.game-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 0px;  /* Reduced gap between grid items */
  margin: auto;  /* Center the grid horizontally */
  max-width: 90%;
  max-height: 90%;
  /* width: 100%;   */
}

.flashcard {
  margin: 0px;  /* Reduced margin around each flashcard */
}

.tries-container {
  position: absolute; /* Absolute positioning */
  left: 0;  /* Positioned at the left */
  top: 50%; /* Centered vertically */
  transform: translateY(-50%); /* Further centering adjustment */
  background: rgba(255,255,255,0.8); /* Background color with some opacity */
  padding: 50px; /* Padding around text */
  border-radius: 0 10px 10px 0; /* Rounded corners on right side */
  font-size: 24px;
  text-align: center;
}

.tries-container h3 {
  font-size: 48px;
  text-align: center;  /* Centers the text */
}

/* The Modal (background) */
.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  vertical-align: middle;
  text-align: center;
  padding: 30px;
  border: 1px solid #888;
  width: 30%;
  /* height: 40%; */
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 10px; 
  transform: translate(-50%, -50%);
}

/* The Close Button */
.close-button {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close-button:hover,
.close-button:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
.game-over-message {
  font-size: 3em;
  /* font-size: 48x; */
  text-align: center;
  color: red; /* or whatever color you prefer */
}

.stats-container {
  position: absolute; /* Absolute positioning */
  right: 0;  /* Positioned at the left */
  top: 50%; /* Centered vertically */
  transform: translateY(-50%); /* Further centering adjustment */
  background: rgba(255,255,255,0.8); /* Background color with some opacity */
  padding: 60px; /* Padding around text */
  border-radius: 0 10px 10px 0; /* Rounded corners on right side */
  text-align: center;
}

/* Add this to your existing <style scoped> section in App.vue */
.reset-button {
  background-color: #4CAF50; /* Green background */
  border: none; /* Remove borders */
  color: white; /* White text */
  padding: 15px 32px; /* Padding */
  text-align: center; /* Center text */
  text-decoration: none; /* Remove underline */
  display: inline-block; /* Display as inline-block */
  font-size: 16px; /* Font size */
  margin: 4px 2px; /* Margin */
  cursor: pointer; /* Pointer cursor on hover */
  border-radius: 6px; /* Rounded corners */
}

.reset-button:hover {
  background-color: #45a049; /* Darker green on hover */
}
</style>
