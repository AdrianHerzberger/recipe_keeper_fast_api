let currentId = 1;

const render = () => {
    let content = document.querySelector('#content');
    content.innerHTML = '';
    content.innerHTML += /*html*/ `
        <div class="header">
            <h1>Recipe Keeper</h1>
        </div>
    `;

    content.innerHTML += /*html*/ `
        <div class="recipe-container">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">Recipe Name:</h5>
                    <input type="text" id="recipeName" class="form-control">
                    <h5 class="card-title mt-3">Ingredients:</h5>
                    <textarea type="text" id="ingredients" class="form-control"></textarea>
                    <button href="#" class="btn btn-primary mt-3" onclick="addRecipe()">Add Recipe</button>
                </div>
            </div>
        </div>
    `;

    content.innerHTML += /*html*/ `
        <div class="recipes-display" id="recipesDisplay" style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 2rem;">
        </div>
    `;
}

const addRecipe = () => {
    let recipeName = document.getElementById('recipeName').value;
    let ingredients = document.getElementById('ingredients').value;

    const ingredientsArray = ingredients.split(",").map(ingredient => ingredient.trim());

    if (recipeName && ingredients) {
        try {
            const newRecipe = {
                "id": currentId++,
                "name": recipeName,
                "ingredients": ingredientsArray

            }
            postRecipe(newRecipe)
        } catch (err) {
            console.error("Error adding recipe data: ", err);
            throw err
        }
    }
}

const renderLoadedRecipes = async () => {
    const recipes = await getRecipes()
    let recipesDisplay = document.getElementById('recipesDisplay');
    recipesDisplay.innerHTML = '';

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];

        const recipeCard = /*html*/`
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${recipe.name}</h5>
                    <p class="card-text"><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                    <div class="button-container">
                        <button class="btn btn-danger" onclick="removeRecipe(${recipe.id})">Remove recipe</button>
                        <button class="btn btn-danger" onclick="getRecipeId(${recipe.id})">Update recipe</button>
                    </div>

                </div>
            </div>
        `;
        recipesDisplay.innerHTML += recipeCard;
    }
};

const renderUpdateForm = (recipe) => {
    let content = document.querySelector('#content');
    content.innerHTML += /*html*/ `
        <div class="recipe-container" id="updateFormContainer">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">Update Recipe</h5>
                    <input type="hidden" id="updateRecipeId" value="${recipe.id}">
                    <h5 class="card-title mt-3">Recipe Name:</h5>
                    <input type="text" id="updateRecipeName" class="form-control" value="${recipe.name}">
                    <h5 class="card-title mt-3">Ingredients:</h5>
                    <textarea id="updateIngredients" class="form-control">${recipe.ingredients.join(', ')}</textarea>
                    <button class="btn btn-primary mt-3" onclick="submitUpdate()">Update Recipe</button>
                    <button class="btn btn-secondary mt-3" onclick="closeUpdateForm()">Cancel</button>
                </div>
            </div>
        </div>
    `;
}

const getRecipes = async () => {
    try {
        const url = "http://127.0.0.1:8000/recipes"
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data
    } catch (err) {
        console.error("Error getting recipes:", err);
        throw err
    }
}

const postRecipe = async (recipe) => {
    try {
        const url = "http://127.0.0.1:8000/recipes"
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipe),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json();
        return data
    }
    catch (err) {
        console.error("Error posting recipe:", err);
        throw err
    }
}

const removeRecipe = async (id) => {
    if (id !== undefined && id !== null) {
        try {
            const url = `http://127.0.0.1:8000/recipes/${id}`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            const data = await response.json();
            return data
        }
        catch (err) {
            console.error("Error posting recipe:", err);
            throw err
        }
    }

    renderLoadedRecipes();
};

const getRecipeId = async (id) => {
    try {
        const url = `http://127.0.0.1:8000/recipes/${id}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const recipe = await response.json();
        renderUpdateForm(recipe);
    } catch (err) {
        console.error("Error getting recipe data:", err);
    }
}

const submitUpdate = async () => {
    const id = document.getElementById('updateRecipeId').value;
    const name = document.getElementById('updateRecipeName').value;
    const ingredients = document.getElementById('updateIngredients').value.split(',').map(ingredient => ingredient.trim());

    if (id && name && ingredients) {
        try {
            const updatedRecipe = {
                name: name,
                ingredients: ingredients
            };

            const url = `http://127.0.0.1:8000/recipes/${id}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedRecipe),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Recipe updated successfully:", data);
            closeUpdateForm();
            renderLoadedRecipes(); 
        } catch (err) {
            console.error("Error updating recipe:", err);
        }
    }
}

const closeUpdateForm = () => {
    const formContainer = document.getElementById('updateFormContainer');
    if (formContainer) {
        formContainer.remove();
    }
}

render();
renderLoadedRecipes()

