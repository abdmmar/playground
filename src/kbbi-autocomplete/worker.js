/* eslint-disable no-undef */
self.importScripts('./Trie.js');

console.log('Worker loaded');

const trie = new Trie();

fetch('https://cdn.statically.io/gh/abdmmar/playground/main/src/kbbi-autocomplete/kbbi.json')
  .then((response) => response.json())
  .then((kamus) => {
    for (let kata of kamus) {
      trie.insert(kata.toLowerCase());
    }
  });

onmessage = (event) => {
  const result = trie.autocomplete(event.data);
  postMessage(result);
};
