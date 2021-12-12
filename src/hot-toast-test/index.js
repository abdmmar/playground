import { toast } from '../hot-toast/toast.js';
import { loadHTML } from '../index.js';

class ToastTest extends HTMLElement {
  connectedCallback() {
    loadHTML('./src/hot-toast-test/index.html')
      .then((html) => {
        const template = html.body.querySelector('template');
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.append(template.content.cloneNode(true));
        this.shadowRoot.appendChild(document.createElement('slot'));

        const buttonTypes = [
          'top-left',
          'top-center',
          'top-right',
          'bottom-left',
          'bottom-center',
          'bottom-right'
        ];
        const buttonList = this.shadowRoot.querySelectorAll('button');

        for (let i = 0; i < buttonList.length; i++) {
          const button = buttonList[i];
          const type = buttonTypes[i];

          button.addEventListener('click', () => {
            toast.success(type, { position: type });
          });
        }
      })
      .catch((err) => console.error(err));
  }
}

customElements.define('hot-toast-test', ToastTest);
