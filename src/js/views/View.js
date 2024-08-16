import icons from "url:../../img/icons.svg";

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param { object | object[]} data The data to be rendered(e.g recipe)
   * @param { boolean } [ render = true ] if false, creates markup string instead of rendering to the DOM
   * @returns { undefined | string } A markup string is returned if render = false
   * @this { object } View instance
   * @author Fatin Fuyad
   * @todo Finish implementations
   */
  render(data, render = true) {
    if (Array.isArray(data) && data.length === 0) return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clearParentHTML();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  // we may also create separate parts for each markup then only update the markup that is needed to be re-redered or updated
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup("new markup generates");

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // updating changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      // updating changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
      `;
    this._clearParentHTML();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p> ${message}</p>
          </div>
      `;
    this._clearParentHTML();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _clearParentHTML() {
    this._parentElement.innerHTML = "";
  }

  renderMessage(message = this._message) {
    const markup = `
                <div class="message msg">
                    <div>
                      <svg>
                        <use href="${icons}#icon-smile"></use>
                      </svg>
                    </div>
                    <p>${message}</p>
                </div>  
            `;
    this._clearParentHTML();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
