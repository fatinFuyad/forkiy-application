import View from "./View";
import icons from "url:../../img/icons.svg";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _message = "Recipe was succesfully uploaded";

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  // we are adding constructor because the controller has nothing to do with showing window and as we want to run this file after loading so we add that to the constructor and then we need to import that to the controller. Otherwise this module will not be executed
  // AddRecipe is a child of View and so we need to write super() and we don't pass anything because we don't create something passing into the view;
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  _generateMarkup() {
    const markup = `
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input  required name="title" type="text" />
          <label>URL</label>
          <input 
            required
            name="sourceUrl"
            type="text"
          />
          <label>Image URL</label>
          <input
             required
            name="image"
            type="text"
          />
          <label>Publisher</label>
          <input  required name="publisher" type="text" />
          <label>Prep time</label>
          <input   required name="cookingTime" type="number" />
          <label>Servings</label>
          <input   required name="servings" type="number" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label>Ingredient 1</label>
          <input 
            type="text"
            required
            name="ingredient-1"
            placeholder="Format: Quantity, Unit, Description"
          />
          <label>Ingredient 2</label>
          <input 
            type="text"
            name="ingredient-2"
            placeholder="Format: Quantity, Unit, Description"
          />
          <label>Ingredient 3</label>
          <input 
            type="text"
            name="ingredient-3"
            placeholder="Format: Quantity, Unit, Description"
          />
          <label>Ingredient 4</label>
          <input 
            type="text"
            name="ingredient-4"
            placeholder="Format: Quantity, Unit, Description"
          />
          <label>Ingredient 5</label>
          <input 
            type="text"
            name="ingredient-5"
            placeholder="Format: Quantity, Unit, Description"
          />
          <label>Ingredient 6</label>
          <input 
            type="text"
            name="ingredient-6"
            placeholder="Format: Quantity, Unit, Description"
          />
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="${icons}#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
    `;
    return markup;
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  _renderUploadForm() {
    this._clearParentHTML();
    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      this._generateMarkup()
    );
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener(
      "click",
      function () {
        this.toggleWindow();
        this._renderUploadForm();
      }.bind(this)
    );
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
}

export default new AddRecipeView();
