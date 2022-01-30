class KBBIAutocomplete extends HTMLElement {
  constructor() {
    super();
    this.currentFocus = -1; // Set -1 as init value to use as focus indicator on the first result, first result is 0
    this.innerHTML = KBBIAutocomplete.template();
  }

  connectedCallback() {
    const resetButton = document.querySelector('.reset-button');
    const inputSearch = document.getElementById('search-input');
    const autocompleteForm = document.querySelector('.autocomplete');
    const worker = new Worker('src/kbbi-autocomplete/worker.js');
    const cardDesc = document.querySelector('.card-desc');

    worker.onmessage = (e) => {
      cardDesc.textContent = e.data;
      if (e.data === '') cardDesc.remove();
    };

    // Main feature
    inputSearch.addEventListener('input', (e) => {
      const resultList = document.querySelector('.result-list');

      this.showResetButton();

      const searchValue = e.target.value.trim().toLowerCase();

      // Close autocomplete and hide reset button if search value is empty
      if (searchValue === '') {
        this.hideResetButton();
        this.closeAutocomplete();
        return;
      }

      if (window.Worker) {
        // Get all words that match the search value
        worker.postMessage(searchValue);

        worker.onmessage = (event) => {
          const res = event.data;

          if (!res || res == null) {
            this.closeAutocomplete();
            return;
          }

          // Get the five first result
          const data = res.slice(0, 5);

          // Delete all result in the list
          this.deleteAutocomplete();

          // Display result suggestion for autocomplete
          this.showAutocomplete();

          // Add new result to the list
          for (let word of data) {
            // Create a new <li> element for each result
            const item = document.createElement('li');
            item.setAttribute('class', 'result-item');
            item.innerHTML = `<strong>${searchValue}</strong>${word}`;

            item.addEventListener('click', (e) => {
              inputSearch.value = item.textContent;
              this.closeAutocomplete();
              this.currentFocus = -1;
            });

            // Add the <li> element to the results list
            resultList.appendChild(item);
          }
        };
      }
    });

    // When press arrow , focus on the autocomplete result
    inputSearch.addEventListener('keydown', (e) => {
      const resultList = document.querySelector('.result-list');
      const resultItem = resultList.querySelectorAll('.result-item');

      switch (e.key) {
        case 'Tab':
        case 'Escape':
          this.closeAutocomplete();
          break;
        case 'ArrowDown':
          this.currentFocus++;

          if (this.currentFocus >= resultItem.length) this.currentFocus = 0;

          this.removeAllActiveElement(resultItem);
          this.addActiveElement(resultItem, this.currentFocus);
          break;
        case 'ArrowUp':
          this.currentFocus--;

          if (this.currentFocus === -1) this.currentFocus = resultItem.length - 1;

          this.removeAllActiveElement(resultItem);
          this.addActiveElement(resultItem, this.currentFocus);
          break;
        case 'Enter':
          e.preventDefault();

          if (this.currentFocus > -1) {
            if (resultItem) resultItem[this.currentFocus].click();
          }
          break;
        default:
          break;
      }
    });

    // Override default behavior of clicking reset button
    resetButton.addEventListener('click', () => {
      inputSearch.value = '';
      this.closeAutocomplete();
      inputSearch.focus();
      resetButton.style.display = 'none';
    });

    // Search lema and it's definition
    autocompleteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(autocompleteForm);
      const input = formData.get('search-input').toLowerCase();
      const main = document.querySelector('#word-definition');

      main.innerHTML = '<div class="card"><strong>Loading...</strong></div>';

      try {
        const response = await fetch(`https://katla.vercel.app/api/define/${input}`);
        const result = await response.json();

        const card = this.createCard(input, result[0]);

        main.innerHTML = '';
        main.append(card);
      } catch (error) {
        let card;

        if (error.message === 'Unexpected token < in JSON at position 0') {
          card = this.createCard('Galat!', 'Kata tidak ditemukan! Coba cari kata yang lain.');
        } else {
          card = this.createCard('Galat!', error.message);
        }

        main.innerHTML = '';
        main.append(card);
      }
    });

    // Close autocomplete result list if click outside of it
    document.addEventListener('click', function (e) {
      const result = document.querySelector('.result');
      const resultList = document.querySelector('.result-list');
      resultList.innerHTML = '';
      result.style.display = 'none';
    });
  }

  createCard(title, message) {
    const card = document.createElement('div');
    const titleEl = document.createElement('h4');
    const content = document.createElement('p');

    card.setAttribute('class', 'card');
    titleEl.setAttribute('class', 'card-title');
    titleEl.textContent = title;
    content.textContent = message;

    card.appendChild(titleEl);
    card.appendChild(content);

    return card;
  }

  showResetButton() {
    const resetButton = document.querySelector('.reset-button');
    resetButton.style.display = 'block';
  }

  hideResetButton() {
    const resetButton = document.querySelector('.reset-button');
    resetButton.style.display = 'none';
  }

  showAutocomplete() {
    const result = document.querySelector('.result');
    result.style.display = 'block';
  }

  hideAutocomplete() {
    const result = document.querySelector('.result');
    result.style.display = 'none';
  }

  deleteAutocomplete() {
    const resultList = document.querySelector('.result-list');
    resultList.innerHTML = '';
  }

  closeAutocomplete() {
    this.deleteAutocomplete();
    this.hideAutocomplete();
  }

  addActiveElement(element, currentFocus) {
    if (!element || element.length <= 0) return false;
    if (currentFocus < 0) currentFocus = element.length - 1;

    element[currentFocus].classList.add('result-item-active');
    element[currentFocus].focus();
  }

  removeAllActiveElement(element) {
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove('result-item-active');
    }
  }

  static template() {
    return `
      <section id="search-autocomplete">
      <div class="search-autocomplete">
        <form class="autocomplete">
          <div class="search-field">
            <label for="search-input" class="sr-only">Search</label>
            <input
              type="text"
              id="search-input"
              class="search-input"
              name="search-input"
              autocomplete="off"
              placeholder="Cari kata dalam kamus"
            />
          </div>
          <button type="reset" class="reset-button">
            <p class="sr-only">Clear input search</p>
            <svg
              width="18"
              height="18"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="rgb(111, 110, 119)"
            >
              <use href="#clear-icon"></use>
            </svg>
          </button>
          <button type="submit" class="search-submit">
            <p class="sr-only">Search</p>
            <svg
              width="18"
              height="18"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="rgb(111, 110, 119)"
            >
              <use href="#search-icon"></use>
            </svg>
          </button>
        </form>

        <div class="result">
          <ul class="result-list"></ul>
        </div>
      </div>
    </section>
    `;
  }
}

customElements.define('kbbi-autocomplete', KBBIAutocomplete);
