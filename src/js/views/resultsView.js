import previewView from "./previewView";
import View from "./View";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recipe found for your query. Please again :(";

  _generateMarkup() {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join("");
  }
}

export default new ResultsView();
