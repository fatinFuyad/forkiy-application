import * as model from "./model.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";
import recipeView from "./views/recipeView.js";
import resultsView from "./views/resultsView.js";
import searchView from "./views/searchView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import "core-js/stable";
import "regenerator-runtime/runtime";

// this is not js code but for module and this will prevent loading the entire page while we change something in the module
if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // update search results with marked preview
    // update() will be called at first if there's an id and then it will return an empty array

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading recipe
    await model.loadRecipe(id);
    // loadRecipe is an async function so it will always return a promise immediately. so if we want the result out of it or stop the excecution until the data is reached, then we need to write await.
    // Whether an async function returns something or not, we always need to write await in front of it

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
    // const recipe = new recipeView(model.state.recipe); // if we exported and imported the whole class;
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearch = async function () {
  try {
    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;
    // we could include the getQuery into the addHandlerSearch() but then we could not use error hanlding

    resultsView.renderSpinner();

    // 2) load search results
    await model.loadSearchResults(query);

    // 3) render search results
    resultsView.render(model.getSearchResultsPage());

    // 4) render pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderError();
  }
};

const controlPagination = function (page) {
  // 1) render NEW search results
  resultsView.render(model.getSearchResultsPage(page));

  // 2) render NEW pagination buttons
  paginationView.render(model.state.search);
  resultsView.render(model.getSearchResultsPage(page));
};

const controlServings = function (newServing) {
  // update servings (in state)
  model.updateServings(newServing);

  // update in the view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add or delete bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // if (model.state.recipe.bookmarked)
  // this will not work because if there is no bookmark then addBookmark() will add bookmark and then the next condition is true and so the deleteBookmark() will run and also deletes the bookmark

  // update recipeView
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    // uploading new recipe data
    await model.uploadRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // show success message
    addRecipeView.renderMessage();

    // render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // changing the id without loading the page. and for that we use the history API and pushState( state , title , url) ; we can omit the first two parameter and only define the url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    // close form window
    setTimeout(() => addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error + "💥💥");
    addRecipeView.renderError(error.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateRecipe(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log("git initialized and components are now being tracked");
};
init();
