import icons from "url:../../img/icons.svg";
import { RES_PER_PAGE } from "../config";
import View from "./View";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  _generateMarkup() {
    const currentPage = this._data.page;
    const totalPage = Math.ceil(this._data.results.length / RES_PER_PAGE);
    // page 1, and there are other pages
    if (currentPage === 1 && currentPage < totalPage)
      return this._generateMarkupButtons("btnNext", currentPage);

    // other pages
    if (currentPage > 1 && currentPage < totalPage)
      return this._generateMarkupButtons("btnBoth", currentPage);

    // last page
    if (currentPage > 1 && currentPage === totalPage)
      return this._generateMarkupButtons("btnPrevious", currentPage);

    // page 1, and there are NO other pages
    return "";
  }

  _generateMarkupButtons(btnType, currentPage) {
    const btnPrevious = `
         <button data-page="${
           currentPage - 1
         }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
          
        `;
    const btnNext = `
          <button data-page="${
            currentPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
    `;

    return btnType === "btnPrevious"
      ? btnPrevious
      : btnType === "btnNext"
      ? btnNext
      : btnPrevious + btnNext;
  }

  addHandlerPagination(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      const page = Number(btn.dataset.page);
      handler(page);
    });
  }
}

export default new PaginationView();
