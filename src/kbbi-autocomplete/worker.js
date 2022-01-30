/* eslint-disable no-undef */
self.importScripts('./Trie.js');

const trie = new Trie();

postMessage('🚀 Fetching words...');

fetch('https://cdn.statically.io/gh/abdmmar/playground/main/src/kbbi-autocomplete/kbbi.json')
  .then((response) => response.json())
  .then((kamus) => {
    postMessage('📖 Adding words to trie...');

    for (let kata of kamus) {
      trie.insert(kata.toLowerCase());
    }
  })
  .finally(() => {
    postMessage('✅ Initialization complete');
    setTimeout(() => postMessage(''), 500);
  })
  .catch((e) => {
    postMessage(e);
  });

onmessage = (event) => {
  const result = trie.autocomplete(event.data);
  postMessage(result);
};
