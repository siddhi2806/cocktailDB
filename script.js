// DOM Elements - Group by feature for better organization
const elements = {
  search: {
    input: document.getElementById('search-input'),
    button: document.getElementById('search-button'),
    resultsGrid: document.getElementById('results-grid'),
    resultsTitle: document.getElementById('results-title'),
    loadingElement: document.getElementById('loading'),
    noResultsElement: document.getElementById('no-results'),
    resultsSection: document.querySelector('.results-section')
  },
  modal: {
    container: document.getElementById('modal'),
    closeButton: document.querySelector('.close-modal'),
    title: document.getElementById('modal-title'),
    image: document.getElementById('modal-image'),
    ingredients: document.getElementById('modal-ingredients'),
    instructions: document.getElementById('modal-instructions'),
    favoriteButton: document.getElementById('favorite-button')
  },
  favorites: {
    link: document.getElementById('favorites-link'),
    section: document.getElementById('favorites-section'),
    grid: document.getElementById('favorites-grid'),
    noFavoritesElement: document.getElementById('no-favorites')
  }
};

// App state
const state = {
  currentCocktail: null,
  favorites: JSON.parse(localStorage.getItem('favoriteCocktails')) || []
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners using an object to group related functionality
    setupEventListeners();
});

// Centralized event listener setup
function setupEventListeners() {
    // Search functionality
    elements.search.input.addEventListener('input', e => {
        e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '');
    });
    elements.search.button.addEventListener('click', handleSearch);
    elements.search.input.addEventListener('keypress', e => {
        if (e.key === 'Enter') handleSearch();
    });

    // Modal functionality
    elements.modal.closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', e => {
        if (e.target === elements.modal.container) closeModal();
    });
    elements.modal.favoriteButton.addEventListener('click', toggleFavorite);

    // Navigation
    elements.favorites.link.addEventListener('click', e => {
        e.preventDefault();
        showFavorites();
    });
}

// Helper function to close modal
function closeModal() {
    elements.modal.container.style.display = 'none';
}

// Search functionality
async function handleSearch() {
    const searchTerm = elements.search.input.value.trim().toLowerCase();
    
    // Validate input
    if (!isValidSearchTerm(searchTerm)) return;

    // Switch to results view and show loading state
    showResults();
    toggleLoadingState(true);
    
    try {
        // Fetch and display results
        const cocktails = await fetchCocktails(searchTerm);
        displayResults(cocktails);
    } catch (error) {
        console.error('Error searching cocktails:', error);
        toggleNoResultsState(true);
    } finally {
        toggleLoadingState(false);
    }
}

// Input validation
function isValidSearchTerm(term) {
    if (!term) {
        alert('Please enter a letter to search.');
        return false;
    }

    if (term.length !== 1 || !/^[a-z]$/.test(term)) {
        alert('Please enter a single letter (a-z).');
        return false;
    }
    
    return true;
}

// API call function
async function fetchCocktails(letter) {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const data = await response.json();
    return data.drinks || [];
}

// Display search results
function displayResults(cocktails) {
    elements.search.resultsGrid.innerHTML = '';
    
    // Handle empty results
    if (!cocktails || cocktails.length === 0) {
        toggleNoResultsState(true);
        return;
    }
    
    // Display results
    toggleNoResultsState(false);
    elements.search.resultsTitle.classList.remove('hidden');
    
    // Create and append cocktail cards
    cocktails.forEach(cocktail => createCocktailCard(cocktail, elements.search.resultsGrid));
}

// Create a cocktail card element
function createCocktailCard(cocktail, container) {
    const isFavorite = state.favorites.some(fav => fav.idDrink === cocktail.idDrink);
    
    const card = document.createElement('div');
    card.className = 'cocktail-card';
    card.setAttribute('data-id', cocktail.idDrink);
    
    card.innerHTML = `
        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
        <div class="card-content">
            <h3>${cocktail.strDrink}</h3>
        </div>
        ${isFavorite ? '<div class="is-favorite">★</div>' : ''}
    `;
    
    card.addEventListener('click', () => openModal(cocktail));
    container.appendChild(card);
}

// Open modal with cocktail details
function openModal(cocktail) {
    // Update state and basic details
    state.currentCocktail = cocktail;
    
    const modal = elements.modal;
    modal.title.textContent = cocktail.strDrink;
    modal.image.src = cocktail.strDrinkThumb;
    modal.image.alt = cocktail.strDrink;
    
    // Process and display ingredients
    modal.ingredients.innerHTML = extractIngredients(cocktail)
        .map(item => `<li>${item.measure} ${item.ingredient}</li>`)
        .join('');
    
    modal.instructions.textContent = cocktail.strInstructions;
    
    // Update favorite button and show modal
    updateFavoriteButton();
    modal.container.style.display = 'block';
}

// Extract ingredients and measurements from cocktail data
function extractIngredients(cocktail) {
    const ingredients = [];
    
    for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        if (!ingredient?.trim()) continue;
        
        const measure = cocktail[`strMeasure${i}`]?.trim() || '';
        ingredients.push({ ingredient, measure });
    }
    
    return ingredients;
}

// Toggle favorite status for current cocktail
function toggleFavorite() {
    if (!state.currentCocktail) return;
    
    const id = state.currentCocktail.idDrink;
    const index = state.favorites.findIndex(fav => fav.idDrink === id);
    const isAddingToFavorites = index === -1;
    
    // Update favorites array
    if (isAddingToFavorites) {
        state.favorites.push(state.currentCocktail);
    } else {
        state.favorites.splice(index, 1);
    }
    
    // Save to localStorage
    saveFavorites();
    
    // Update UI
    updateFavoriteButton();
    updateFavoriteStar(id, isAddingToFavorites);
    
    // Refresh favorites view if it's currently shown
    if (!elements.favorites.section.classList.contains('hidden')) {
        showFavorites();
    }
}

// Update the favorite button in the modal
function updateFavoriteButton() {
    const isFavorite = isCocktailInFavorites(state.currentCocktail?.idDrink);
    const btn = elements.modal.favoriteButton;
    
    btn.textContent = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
    btn.classList.toggle('favorited', isFavorite);
}

// Check if a cocktail is in favorites
function isCocktailInFavorites(id) {
    return id && state.favorites.some(fav => fav.idDrink === id);
}

// Update favorite star on cocktail card
function updateFavoriteStar(cocktailId, isAddingToFavorites) {
    const card = document.querySelector(`.cocktail-card[data-id="${cocktailId}"]`);
    if (!card) return;
    
    const existingStar = card.querySelector('.is-favorite');
    
    if (isAddingToFavorites && !existingStar) {
        const starDiv = document.createElement('div');
        starDiv.className = 'is-favorite';
        starDiv.textContent = '★';
        card.appendChild(starDiv);
    } else if (!isAddingToFavorites && existingStar) {
        existingStar.remove();
    }
}

// Save favorites to localStorage
function saveFavorites() {
    localStorage.setItem('favoriteCocktails', JSON.stringify(state.favorites));
}

// Show favorites view
function showFavorites() {
    // Update navigation
    updateActiveNavLink(elements.favorites.link);
    
    // Switch view
    toggleView(elements.favorites.section, elements.search.resultsSection);
    
    // Display favorites
    renderFavorites();
}

// Render favorites grid
function renderFavorites() {
    const { grid, noFavoritesElement } = elements.favorites;
    grid.innerHTML = '';
    
    // Show message if no favorites
    if (state.favorites.length === 0) {
        noFavoritesElement.classList.remove('hidden');
        return;
    }
    
    // Hide no favorites message and show favorites
    noFavoritesElement.classList.add('hidden');
    state.favorites.forEach(cocktail => {
        createCocktailCard(cocktail, grid, true);
    });
}

// Show search results view
function showResults() {
    // Update navigation
    updateActiveNavLink(document.querySelector('.nav-links a:first-child'));
    
    // Switch view
    toggleView(elements.search.resultsSection, elements.favorites.section);
}

// Toggle loading state
function toggleLoadingState(isLoading) {
    const { loadingElement, resultsGrid, noResultsElement } = elements.search;
    
    loadingElement.classList.toggle('hidden', !isLoading);
    resultsGrid.classList.toggle('hidden', isLoading);
    
    if (isLoading) {
        noResultsElement.classList.add('hidden');
    }
}

// Toggle no results state
function toggleNoResultsState(show) {
    const { noResultsElement, resultsGrid, resultsTitle } = elements.search;
    
    noResultsElement.classList.toggle('hidden', !show);
    resultsGrid.classList.toggle('hidden', show);
    resultsTitle.classList.toggle('hidden', show);
}

// Helper functions for view management
function updateActiveNavLink(activeLink) {
    document.querySelector('.nav-links a.active')?.classList.remove('active');
    activeLink.classList.add('active');
}

function toggleView(showElement, hideElement) {
    showElement.classList.remove('hidden');
    hideElement.classList.add('hidden');
}
