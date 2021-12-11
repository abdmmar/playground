class TrieNode {
  constructor() {
    this.children = new Map()
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode()
  }
  // O(K+1)
  insert(word) {
    let currentNode = this.root
    let chars = word.split('')

    for (let char of chars) {
      let childNode = currentNode.children.get(char)

      if (childNode) {
        currentNode = childNode
      } else {
        let newNode = new TrieNode()
        currentNode.children.set(char, newNode)
        currentNode = newNode
      }
    }

    currentNode.children.set('*', null)
  }
  // O(K)
  search(word) {
    let currentNode = this.root
    let chars = word.split('')

    for (let char of chars) {
      let childNode = currentNode.children.get(char)

      if (childNode) {
        currentNode = childNode
      } else {
        return null
      }
    }

    return currentNode
  }
  collectAllWords(node, word = '', words = []) {
    let currentNode = node || this.root

    currentNode.children.forEach((value, key) => {
      // value is node
      if (key === '*') {
        words.push(word)
      } else {
        this.collectAllWords(value, word + key, words)
      }
    })

    return words
  }
  autocomplete(prefix) {
    let currentNode = this.search(prefix)

    if (!currentNode) {
      return null
    }

    return this.collectAllWords(currentNode)
  }
}

export default Trie
