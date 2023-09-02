# Card Flip Game

An interactive card-flipping game built with Vue.js.

## Table of Contents

1. [Project Setup](#project-setup)
2. [Overview](#overview)
3. [Features](#features)
4. [Technologies Used](#technologies-used)
5. [Usage](#usage)
6. [Components](#components)
7. [Contributing](#contributing)
8. [License](#license)

## Project Setup

### Installation
\`\`\`bash
npm install
\`\`\`

### Compiles and hot-reloads for development
\`\`\`bash
npm run serve
\`\`\`

### Compiles and minifies for production
\`\`\`bash
npm run build
\`\`\`

### Lints and fixes files
\`\`\`bash
npm run lint
\`\`\`

### Customize configuration
For more details, see [Vue CLI Configuration Reference](https://cli.vuejs.org/config/).

## Overview

This is a flashcard game that offers an interactive way to learn and test your knowledge. The game features dynamic flashcards that flip when clicked to reveal answers, customizable styles, and winning animations.

![Screenshot of the game](screenshot.png)

## Features

- **Interactive Flashcards**: Click to flip and reveal the answer.
- **Dynamic Styling**: Customizable text and background colors.
- **Game Status**: Know instantly whether you won or need to try again.
- **Confetti Animation**: Enjoy a confetti celebration when you win.
- **Responsiveness**: Adapts to different screen sizes.

## Technologies Used

- Vue.js
- CSS3 Animations
- Canvas-Confetti for winning animations

## Usage

To start the development server:

\`\`\`bash
npm run serve
\`\`\`

Navigate to \`http://localhost:8080\` in your web browser.

## Components

### `Game.vue`

The main component that manages the game logic. It controls the game status, checks if you won or need to try again, and triggers the win animations.

### `Flashcard.vue`

A reusable component that represents a single flashcard. It flips when clicked, revealing the answer, and has customizable styles.

## Contributing

1. Fork the repository.
2. Create your feature branch (\`git checkout -b feature/fooBar\`).
3. Commit your changes (\`git commit -am 'Add some fooBar'\`).
4. Push to the branch (\`git push origin feature/fooBar\`).
5. Create a new Pull Request.

For bugs, questions, and discussions, please use the [GitHub Issues](https://github.com/your_username/card-flip-game/issues).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
