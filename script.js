const searchBtn = document.getElementById("search-btn");
const input = document.getElementById("ingredient-input");
const recipesContainer = document.getElementById("recipes-container");
const loadingIndicator = document.getElementById("loading-indicator");
const mealTypeFilter = document.getElementById("meal-type");
const sortByFilter = document.getElementById("sort-by");

// Spoonacular API key
const API_KEY = 'b00233ffb7334c04a7aaf077f1dc9ad1';  // Replace with your Spoonacular API key
const API_URL = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=`;

// Function to search recipes
searchBtn.addEventListener('click', () => {
    const ingredients = input.value.split(',').map(ingredient => ingredient.trim()).join(',');
    const mealType = mealTypeFilter.value;
    const sortBy = sortByFilter.value;
    
    if (ingredients) {
        fetchRecipes(ingredients, mealType, sortBy);
    } else {
        alert("Please enter some ingredients!");
    }
});

async function fetchRecipes(ingredients, mealType, sortBy) {
    loadingIndicator.style.display = 'block'; // Show loading indicator
    const url = `${API_URL}${ingredients}&number=6&apiKey=${API_KEY}&cuisine=${mealType}&sort=${sortBy === 'time' ? 'maxReadyTime' : sortBy === 'rating' ? 'rating' : ''}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Hide loading indicator after fetching data
        loadingIndicator.style.display = 'none';

        if (data.length > 0) {
            displayRecipes(data);
        } else {
            recipesContainer.innerHTML = "<p>No recipes found with these ingredients.</p>";
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
        loadingIndicator.style.display = 'none';
        recipesContainer.innerHTML = "<p>There was an error fetching the recipes. Please try again later.</p>";
    }
}

// Function to display recipes
function displayRecipes(recipes) {
    recipesContainer.innerHTML = "";
    recipes.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        
        const recipeImage = recipe.image ? `<img src="${recipe.image}" alt="${recipe.title}">` : "";
        const recipeTitle = recipe.title ? `<h3>${recipe.title}</h3>` : "";
        const recipeIngredients = recipe.ingredients ? `<p><strong>Ingredients:</strong> ${recipe.ingredients.map(ingredient => ingredient.name).join(', ')}</p>` : "";
        
        recipeCard.innerHTML = `
            ${recipeImage}
            <div class="content">
                ${recipeTitle}
                ${recipeIngredients}
                <button onclick="window.open('https://spoonacular.com/recipes/${recipe.id}', '_blank')">View Recipe</button>
            </div>
        `;
        
        recipesContainer.appendChild(recipeCard);
    });
}
