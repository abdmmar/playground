import { loadHTML } from '../index.js';

class Toast extends HTMLElement {
  connectedCallback() {
    loadHTML('./src/hot-toast/hot-toast.html')
      .then((html) => {
        const template = html.body.querySelector('template');
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.append(template.content.cloneNode(true));
        this.shadowRoot.appendChild(document.createElement('slot'));
      })
      .catch((err) => console.error(err));
  }
}

customElements.define('hot-toast', Toast);
