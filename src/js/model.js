import { API_URL, KEY, RES_PER_PAGE } from "./config.js";
import { AJAX, deleteJSON } from "./helper.js";

// storing all received data in a state object
export const state = {
  recipe: {},
  search: {
    query: "",
    page: 1,
    results: [],
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceURL: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    // conditionally adding properties
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL + id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    const isAnyBookmark = state.bookmarks.some(
      (bkRecipe) => bkRecipe.id === id
    );
    if (isAnyBookmark) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const searchResults = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.query = query;
    state.search.results = searchResults.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
    // the page from the state will be changed when the page buttons are clicked meanwhile when we search, the page of the state is the mutated one so the page will not be the first one
  } catch (error) {
    throw error;
  }
};

// this has not been an async function because the search results are already loaded
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE; // 0;
  const end = page * RES_PER_PAGE;
  const resultsPage = state.search.results.slice(start, end);
  return resultsPage;
};

export const updateServings = function (newServing) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = ing.quantity * (newServing / state.recipe.servings);
    // formula: oldQuantity * newServings / oldServings
  });

  state.recipe.servings = newServing;
};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // delete the bookmarked recipe
  const index = state.bookmarks.findIndex((bkRecipe) => bkRecipe.id === id);
  state.bookmarks.splice(index, 1);

  // mark current recipe as NOT bookmarked
  if (state.recipe.id === id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient fromat! Please use the correct format :)"
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

// const id = `66bb7ed679f62d0014fa9912`;
// const deleteRecipe = async function (id) {
//   const data = await deleteJSON(`${API_URL}${id}?key=${KEY}`);
// };
// deleteRecipe(id);
