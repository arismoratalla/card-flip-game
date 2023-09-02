<template>
  <div>
    <div @click="handleClick" 
          :class="{flipped: flipped || externalFlip}"
          v-bind:style="{backgroundColor: colorFront, color: colorTextFront}" 
          v-show="!isToggle" 
          class="animated flipInX flashcard">
      <div class="card-header" style="padding-bottom: 15px;">{{ headerFront }}</div>
      <div class="card-content center">
        <img src="vite.svg" alt="Flashcard Front" class="logo">
      </div>
      <div class="card-footer">{{ footerFront }}</div>
    </div>
    <div @click="handleClick" 
          :class="{highlight: highlight}"
          v-bind:style="{backgroundColor: dynamicColorBack, color: colorTextBack}" 
          v-show="isToggle" 
          class="animated flipInX flashcard">
      <div class="card-header" style="padding-bottom: 15px;">{{ dynamicHeaderBack }}</div>
      <div class="card-content center">
        <p v-bind:style="{fontSize: textSizeBack, fontWeight: 'bold'}">{{ back }}</p>
      </div>
      <div class="card-footer">{{ dynamicFooterBack }}</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isToggle: false,
    };
  },
  props: {
      status: {
        type: String,
        default: 'tryAgain'
      },
      externalToggle: {
        type: Boolean,
        default: false,
      },
      isGameActive: {
        type: Boolean,
        default: true,
      },
      imgFront: {
          type: String,
          default: ''
      },
      imgBack: {
          type: String,
          default: ''
      },
      front: {
          type: String,
          // default: ''
      },
      back: {
          type: String,
          // default: ''
      },
      textSizeFront: {
          type: String,
          default: '2em'
      },
      textSizeBack: {
          type: String,
          default: '1em'
      },
      colorTextFront: {
          type: String,
          default: 'black'
      },
      colorTextBack: {
          type: String,
          default: 'white'
      },
      colorFront: {
          type: String,
          default: 'white'
      },
      colorBack: {
          type: String,
          default: '#2ecc71'
      },
      headerFront: {
          type: String,
          default: 'Event Name'
      },
      headerBack: {
          type: String,
          // default: 'Answer'
      },
      footerFront: {
          type: String,
          default: 'Footer Text'
      },
      footerBack: {
          type: String,
          default: ''
      }
  },
  computed: {
    dynamicColorBack() {
      return this.status === 'win' ? '#2ecc71' : '#f1c40f';
    },
    dynamicHeaderBack() {
      return this.status === 'win' ? 'Congratulations ! ! !' : 'Sorry ! ! !';
    },
    dynamicFooterBack() {
      return this.status === 'win' ? 'Claim Prize.' : '';
    }
  },
  watch: {
    externalToggle: function(newVal, oldVal) {
      this.isToggle = newVal;
    },
  },
  methods: {
    handleClick() {
      if (this.isGameActive) {
        this.isToggle = !this.isToggle;
        // this.isHighlighted = !this.isHighlighted;
        this.$emit('cardClicked'); // Emit event to parent

        // Highlight if clicked during the first 3 tries
        if (this.$root.remainingTries > 0 && this.$root.remainingTries <= 3) {
          this.highlight = true;
        }

        // Trigger confetti if this card is a 'win'
        if (this.status === 'win') {
          this.triggerConfetti();
        }
      }
    },

    triggerConfetti() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  },
}
</script>
<style scoped>
.center {
  text-align: center;
}

.flashcard {
  cursor: pointer;
  border-radius: 10px;
  margin: 20px;
  padding: 50px;
  box-shadow: 0 0px 10px rgba(0, 0, 0, 0.4);
  text-align: center;
}

.flashcard:hover {
  box-shadow: 0 0px 25px rgba(0, 0, 0, 0.8);
}

.logo {
  width: 100px;
  height: 60px;
}

.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

@keyframes flipInX {
  from {
      transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
      animation-timing-function: ease-in;
      opacity: 0;
  }
  40% {
      transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
      animation-timing-function: ease-in;
  }
  60% {
      transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
      opacity: 1;
  }
  80% {
      transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }
  to {
      transform: perspective(400px);
  }
}

.flipInX {
  backface-visibility: visible !important;
  animation-name: flipInX;
}

.highlighted {
  border: 4px solid blue;
}
</style>
