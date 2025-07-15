# Cocktail Finder

A responsive web application that allows users to search for cocktails by their first letter using TheCocktailDB API. Users can view cocktail details, save their favorite cocktails, and view their saved collection.

## Features

- **Letter Search**: Search for cocktails by entering a single letter
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Detailed View**: Click on any cocktail to see image, ingredients, and preparation instructions
- **Favorites System**: Save cocktails to your favorites with local storage persistence
- **Modern UI**: Clean, intuitive interface with smooth transitions and animations

## Technologies Used

- **HTML5**: Semantic markup for structure
- **CSS3**: Modern styling with CSS variables, flexbox, and grid
- **JavaScript (ES6+)**: Vanilla JS with modern features like async/await, template literals, optional chaining
- **Local Storage API**: For saving favorite cocktails
- **TheCocktailDB API**: External API for cocktail data

## How to Use

1. **Search**: Enter a single letter (a-z) in the search box and click "Search"
2. **View Results**: Click on any cocktail card to see details
3. **Save Favorites**: Click "Add to Favorites" in the detail view to save a cocktail
4. **View Favorites**: Click "Favorites" in the navigation to see all saved cocktails
5. **Remove Favorites**: Open any favorited cocktail and click "Remove from Favorites"

## Project Structure

```
cocktail/
│
├── index.html      - Main HTML structure
├── styles.css      - CSS styling and responsive design
├── script.js       - JavaScript functionality
└── README.md       - Project documentation
```

## API Used

This project uses [TheCocktailDB API](https://www.thecocktaildb.com/api.php), specifically:
```
http://www.thecocktaildb.com/api/json/v1/1/search.php?f=a
```

Where `a` is replaced with the letter being searched.

<img width="1338" height="628" alt="image" src="https://github.com/user-attachments/assets/c8789d52-d248-41d2-841e-444cab2e2cc4" />

<img width="1316" height="621" alt="image" src="https://github.com/user-attachments/assets/b4024ad2-075e-424e-96f5-18fc4792a218" />

<img width="680" height="395" alt="image" src="https://github.com/user-attachments/assets/fed9c29c-9bd7-47c3-a3ad-49d70dd3007e" />

<img width="1005" height="478" alt="image" src="https://github.com/user-attachments/assets/b7fecdff-bff9-4ea7-af01-3ab1fe026574" />

<img width="1325" height="635" alt="image" src="https://github.com/user-attachments/assets/eb32d40f-2940-496e-83bc-46f453e3b5a8" />
