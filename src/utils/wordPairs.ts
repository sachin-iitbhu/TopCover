// Word pairs for TopCover game
// Each pair contains a civilian word and a similar undercover word

export interface WordPair {
  civilian: string;
  undercover: string;
  category: string;
}

export const wordPairs: WordPair[] = [
  // Animals
  { civilian: "Lion", undercover: "Tiger", category: "Animals" },
  { civilian: "Dog", undercover: "Wolf", category: "Animals" },
  { civilian: "Cat", undercover: "Leopard", category: "Animals" },
  { civilian: "Horse", undercover: "Zebra", category: "Animals" },
  { civilian: "Elephant", undercover: "Rhino", category: "Animals" },
  { civilian: "Penguin", undercover: "Seal", category: "Animals" },
  { civilian: "Butterfly", undercover: "Moth", category: "Animals" },
  { civilian: "Eagle", undercover: "Hawk", category: "Animals" },

  // Food & Drinks
  { civilian: "Apple", undercover: "Orange", category: "Food" },
  { civilian: "Pizza", undercover: "Burger", category: "Food" },
  { civilian: "Coffee", undercover: "Tea", category: "Food" },
  { civilian: "Ice Cream", undercover: "Frozen Yogurt", category: "Food" },
  { civilian: "Sushi", undercover: "Sashimi", category: "Food" },
  { civilian: "Bread", undercover: "Toast", category: "Food" },
  { civilian: "Chocolate", undercover: "Candy", category: "Food" },
  { civilian: "Rice", undercover: "Noodles", category: "Food" },
  { civilian: "Milk", undercover: "Cream", category: "Food" },
  { civilian: "Soup", undercover: "Stew", category: "Food" },

  // Transportation
  { civilian: "Car", undercover: "Truck", category: "Transportation" },
  {
    civilian: "Airplane",
    undercover: "Helicopter",
    category: "Transportation",
  },
  { civilian: "Bicycle", undercover: "Motorcycle", category: "Transportation" },
  { civilian: "Train", undercover: "Subway", category: "Transportation" },
  { civilian: "Ship", undercover: "Boat", category: "Transportation" },
  { civilian: "Bus", undercover: "Van", category: "Transportation" },

  // Technology
  { civilian: "Computer", undercover: "Laptop", category: "Technology" },
  { civilian: "Phone", undercover: "Tablet", category: "Technology" },
  { civilian: "Television", undercover: "Monitor", category: "Technology" },
  { civilian: "Camera", undercover: "Camcorder", category: "Technology" },
  { civilian: "Speaker", undercover: "Headphones", category: "Technology" },
  { civilian: "Keyboard", undercover: "Piano", category: "Technology" },

  // Sports & Games
  { civilian: "Soccer", undercover: "Football", category: "Sports" },
  { civilian: "Basketball", undercover: "Volleyball", category: "Sports" },
  { civilian: "Tennis", undercover: "Badminton", category: "Sports" },
  { civilian: "Swimming", undercover: "Diving", category: "Sports" },
  { civilian: "Chess", undercover: "Checkers", category: "Games" },
  { civilian: "Cards", undercover: "Poker", category: "Games" },

  // Clothing
  { civilian: "Shirt", undercover: "Blouse", category: "Clothing" },
  { civilian: "Jeans", undercover: "Pants", category: "Clothing" },
  { civilian: "Shoes", undercover: "Boots", category: "Clothing" },
  { civilian: "Hat", undercover: "Cap", category: "Clothing" },
  { civilian: "Jacket", undercover: "Coat", category: "Clothing" },
  { civilian: "Dress", undercover: "Skirt", category: "Clothing" },

  // Nature
  { civilian: "Tree", undercover: "Bush", category: "Nature" },
  { civilian: "Ocean", undercover: "Sea", category: "Nature" },
  { civilian: "Mountain", undercover: "Hill", category: "Nature" },
  { civilian: "River", undercover: "Stream", category: "Nature" },
  { civilian: "Sun", undercover: "Moon", category: "Nature" },
  { civilian: "Rain", undercover: "Snow", category: "Nature" },
  { civilian: "Flower", undercover: "Plant", category: "Nature" },

  // Objects
  { civilian: "Book", undercover: "Magazine", category: "Objects" },
  { civilian: "Pen", undercover: "Pencil", category: "Objects" },
  { civilian: "Chair", undercover: "Stool", category: "Objects" },
  { civilian: "Table", undercover: "Desk", category: "Objects" },
  { civilian: "Mirror", undercover: "Window", category: "Objects" },
  { civilian: "Clock", undercover: "Watch", category: "Objects" },
  { civilian: "Lamp", undercover: "Candle", category: "Objects" },

  // Buildings & Places
  { civilian: "School", undercover: "University", category: "Places" },
  { civilian: "Hospital", undercover: "Clinic", category: "Places" },
  { civilian: "Restaurant", undercover: "Cafe", category: "Places" },
  { civilian: "Hotel", undercover: "Motel", category: "Places" },
  { civilian: "Bank", undercover: "ATM", category: "Places" },
  { civilian: "Library", undercover: "Bookstore", category: "Places" },
  { civilian: "Park", undercover: "Garden", category: "Places" },

  // Entertainment
  { civilian: "Movie", undercover: "TV Show", category: "Entertainment" },
  { civilian: "Concert", undercover: "Musical", category: "Entertainment" },
  { civilian: "Theater", undercover: "Cinema", category: "Entertainment" },
  { civilian: "Party", undercover: "Celebration", category: "Entertainment" },
  { civilian: "Dancing", undercover: "Singing", category: "Entertainment" },

  // Professions
  { civilian: "Doctor", undercover: "Nurse", category: "Professions" },
  { civilian: "Teacher", undercover: "Professor", category: "Professions" },
  { civilian: "Chef", undercover: "Cook", category: "Professions" },
  { civilian: "Artist", undercover: "Painter", category: "Professions" },
  { civilian: "Police", undercover: "Security", category: "Professions" },
  { civilian: "Pilot", undercover: "Captain", category: "Professions" },
];

export const getRandomWordPair = (): WordPair => {
  const randomIndex = Math.floor(Math.random() * wordPairs.length);
  return wordPairs[randomIndex];
};

export const getWordPairsByCategory = (category: string): WordPair[] => {
  return wordPairs.filter((pair) => pair.category === category);
};

export const getAllCategories = (): string[] => {
  const categories = [...new Set(wordPairs.map((pair) => pair.category))];
  return categories.sort();
};

export const getRandomWordPairFromCategory = (
  category: string
): WordPair | null => {
  const categoryPairs = getWordPairsByCategory(category);
  if (categoryPairs.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * categoryPairs.length);
  return categoryPairs[randomIndex];
};
