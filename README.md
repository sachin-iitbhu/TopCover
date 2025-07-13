# 🎯 TopCover - Social Deduction Game

TopCover is an engaging social deduction game built with React and TypeScript. Similar to popular word games, players receive different words based on their secret roles and must identify the undercovers while avoiding detection themselves.

## 🎮 Game Rules

### Roles
- **👥 Civilians**: Get the same word and must identify undercovers and Mr. White
- **🕵️ Undercovers**: Get a similar but different word and must blend in with civilians
- **⚪ Mr. White**: Gets no word at all and must deduce the civilian word from context

### Victory Conditions
- **Civilians win** if all undercovers and Mr. White are eliminated
- **Undercovers win** if they eliminate civilians while Mr. White is already out
- **Mr. White wins** by correctly guessing the civilian word when eliminated

## 🚀 Features

- **Player Management**: Add/remove players with custom names
- **Role Assignment**: Automatic random role distribution
- **🎲 Automatic Word Generation**: Built-in library of 80+ word pairs across 10 categories
- **� Secure Word Management**: Words are hidden by default and only revealed when clicked
- **�📝 Manual Word Entry**: Option to enter custom words for personalized gameplay
- **🎯 Category Selection**: Choose from Animals, Food, Technology, Sports, and more
- **Secure Word Distribution**: Private word viewing for each player
- **Voting System**: Democratic elimination rounds with vote counting
- **Win Condition Detection**: Automatic game state management
- **Beautiful UI**: Modern, responsive design with dark theme
- **Game Summary**: Detailed results showing all roles and elimination order

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20.19.0 or higher recommended)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 🎯 How to Play

1. **Setup Phase**:
   - Add player names (minimum 3 players)
   - Configure number of undercovers and Mr. White
   - Choose between auto-generated words or manual entry
   - Select word category (if using auto-generation)
   - Generate or enter the civilian and undercover words

2. **Word Distribution**:
   - Pass the device to each player
   - Each player privately views their word/role
   - Ensure secrecy is maintained

3. **Elimination Rounds**:
   - Players discuss and vote to eliminate suspects
   - The player with the most votes is eliminated
   - Special rules apply when Mr. White is caught

4. **Game End**:
   - Win conditions are checked after each elimination
   - Game summary shows all roles and results

## 🎨 Game Features

### Smart Game Logic
- Automatic role assignment with shuffling
- Win condition validation
- Mr. White guessing mechanism
- Tie-breaker handling in voting

### Modern UI/UX
- Responsive design for mobile and desktop
- Dark theme with beautiful gradients
- Intuitive navigation through game phases
- Visual feedback for all interactions

### Security Features
- Private word distribution
- Hidden role information
- Secure voting system

## 🔧 Technical Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Modern CSS with CSS Variables
- **Icons**: Unicode emojis for universal compatibility

## 📱 Responsive Design

The game is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

## 🎲 Game Variants

You can customize the game by adjusting:
- Number of players (3+ recommended)
- Number of undercovers (1-3)
- Inclusion of Mr. White (0-1)
- Word pairs (civilian vs undercover words)

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Have Fun!

TopCover is designed to be a fun social game for friends and family. Enjoy the suspense, strategy, and social interaction that comes with this exciting deduction game!
