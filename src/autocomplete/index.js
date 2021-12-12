import { loadHTML } from '../index.js';
import Trie from './Trie.js';
import words from './words.js';

const WORD_API_URL = 'https://kbbi-api-amm.herokuapp.com/search?q=';

function main() {
  let currentFocus = -1;
  const resetButton = document.querySelector('.reset-button');
  const inputSearch = document.getElementById('search-input');
  const autocompleteForm = document.querySelector('.autocomplete');

  let trie = new Trie();

  // Insert each word to trie
  for (let word of words) {
    trie.insert(word.keyword.toLowerCase());
  }

  // Main feature
  inputSearch.addEventListener('input', (e) => {
    const resultList = document.querySelector('.result-list');

    showResetButton();

    const searchValue = e.target.value.trim().toLowerCase();

    // Close autocomplete and hide reset button if search value is empty
    if (searchValue === '') {
      hideResetButton();
      closeAutocomplete();
      return;
    }

    // Set -1 as init value to use as focus indicator on the first result, first result is 0
    currentFocus = -1;

    // Get all words that match the search value
    const res = trie.autocomplete(searchValue);

    if (!res || res == null) {
      closeAutocomplete();
      return;
    }

    // Get the five first result
    const data = res.slice(0, 5);

    // Delete all result in the list
    deleteAutocomplete();

    // Display result suggestion for autocomplete
    showAutocomplete();

    // Add new result to the list
    for (let word of data) {
      // Create a new <li> element for each result
      const item = document.createElement('li');
      item.setAttribute('class', 'result-item');
      item.innerHTML = `<strong>${searchValue}</strong>${word}`;
      item.addEventListener('click', (e) => {
        inputSearch.value = item.textContent;
        closeAutocomplete();
        currentFocus = -1;
      });

      // Add the <li> element to the results list
      resultList.appendChild(item);
    }
  });

  // When press arrow , focus on the autocomplete result
  inputSearch.addEventListener('keydown', (e) => {
    const resultList = document.querySelector('.result-list');
    const resultItem = resultList.querySelectorAll('.result-item');
    const key = e.key;

    if (key === 'Tab') {
      closeAutocomplete();
      return;
    }

    if (key === 'ArrowDown') {
      currentFocus++;

      if (currentFocus >= resultItem.length) currentFocus = 0;

      removeAllActiveElement(resultItem);
      addActiveElement(resultItem, currentFocus);
    } else if (key === 'ArrowUp') {
      currentFocus--;
      removeAllActiveElement(resultItem);
      addActiveElement(resultItem, currentFocus);
    } else if (key === 'Enter') {
      e.preventDefault();

      if (currentFocus > -1) {
        if (resultItem) resultItem[currentFocus].click();
      }
    }
  });

  // Override default behavior of clicking reset button
  resetButton.addEventListener('click', () => {
    inputSearch.value = '';
    closeAutocomplete();
    inputSearch.focus();
    resetButton.style.display = 'none';
  });

  // // Get lema and meaning
  // autocompleteForm.addEventListener("submit", async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(autocompleteForm);
  //   const input = formData.get("search-input").toLowerCase();
  //   const main = document.querySelector("main");

  //   main.innerHTML = '<div class="loading-container loading"></div>';

  //   try {
  //     const result = await getKata(input);
  //     const data = result.data.resultLists;

  //     // Create card element
  //     const card = document.createElement("div");
  //     const title = document.createElement("h2");
  //     card.setAttribute("class", "card");
  //     title.setAttribute("class", "card-title");
  //     title.textContent = input;
  //     card.appendChild(title);

  //     data.forEach(({ kata, arti }) => {
  //       const lema = document.createElement("h4");
  //       lema.setAttribute("class", "card-lema");

  //       const char = kata.trim().split("");
  //       const lastChar = char.at(-1);
  //       const lastCharNum = parseInt(lastChar, 10);
  //       const isLastCharNaN = isNaN(lastCharNum);
  //       const isLastCharNumber = typeof lastCharNum === "number";

  //       if (!isLastCharNaN && isLastCharNumber) {
  //         const sup = document.createElement("sup");
  //         sup.textContent = char.pop();
  //         lema.textContent = char.join("");
  //         lema.appendChild(sup);
  //       } else {
  //         lema.textContent = kata;
  //       }

  //       card.appendChild(lema);

  //       arti.forEach((meaning) => {
  //         // const mean = meaning.split(" ");
  //         const content = document.createElement("p");
  //         content.setAttribute("class", "card-content");
  //         content.textContent = meaning;
  //         card.appendChild(content);
  //       });

  //       main.innerHTML = "";
  //       main.append(card);
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

  // Close autocomplete result list if click outside of it
  document.addEventListener('click', function (e) {
    closeAutocomplete();
  });

  function showResetButton() {
    const resetButton = document.querySelector('.reset-button');
    resetButton.style.display = 'block';
  }

  function hideResetButton() {
    const resetButton = document.querySelector('.reset-button');
    resetButton.style.display = 'none';
  }

  function showAutocomplete() {
    const result = document.querySelector('.result');
    result.style.display = 'block';
  }

  function hideAutocomplete() {
    const result = document.querySelector('.result');
    result.style.display = 'none';
  }

  function deleteAutocomplete() {
    const resultList = document.querySelector('.result-list');
    resultList.innerHTML = '';
  }

  function closeAutocomplete() {
    deleteAutocomplete();
    hideAutocomplete();
  }

  function addActiveElement(element, currentFocus) {
    if (!element || element.length <= 0) return false;
    if (currentFocus < 0) currentFocus = element.length - 1;

    element[currentFocus].classList.add('result-item-active');
    element[currentFocus].focus();
  }

  function removeAllActiveElement(element) {
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove('result-item-active');
    }
  }
}

async function getKata(word) {
  const response = await fetch(`${WORD_API_URL}${word}`);
  const result = await response.json();
  return result;
}

class Autocomplete extends HTMLElement {
  async connectedCallback() {
    if (!this.rendered) {
      await this.render();
      this.rendered = true;
      main();
    }
  }

  async render() {
    const html = await loadHTML('./src/autocomplete/index.html');
    this.innerHTML = html.body.innerHTML;
  }
}

customElements.define('search-autocomplete', Autocomplete);
