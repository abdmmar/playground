class ToastItem extends HTMLElement {
  constructor() {
    super();
    this.EXIT_ANIMATION_TIMEOUT = 350;
    this.TIMEOUT_TYPE = {
      error: 4000,
      blank: 4000,
      loading: 4000,
      success: 2000
    };
  }

  connectedCallback() {
    const options = {
      closeable: this.getAttribute('closeable') || false,
      duration: parseInt(this.getAttribute('duration')),
      position:
        this.getAttribute('position') !== 'undefined' && this.getAttribute('position') != null
          ? this.getAttribute('position')
          : 'top-center',
      message: this.getAttribute('message'),
      type: this.getAttribute('type') || 'blank'
    };

    const timeout = !isNaN(options.duration) ? options.duration : this.TIMEOUT_TYPE[options.type];

    const toastBar = this.createToastBar();
    const toastIcon = this.createIcon(options.type);
    const toastMessage = this.createMessage(options.message);
    const toastCloseIcon = this.createCloseButton(options.closeable);

    toastBar.appendChild(toastIcon);
    toastBar.appendChild(toastMessage);

    if (toastCloseIcon) toastBar.appendChild(toastCloseIcon);

    // Positioning
    const top = options.position.includes('top');

    const horizontalStyle = options.position.includes('center')
      ? 'center'
      : options.position.includes('right')
      ? 'flex-end'
      : 'flex-start';

    if (top) {
      this.style.setProperty('--hot-toast-bar-factor', 1);
      this.style.top = 0;
    } else {
      this.style.setProperty('--hot-toast-bar-factor', -1);
      this.style.bottom = 0;
    }

    const css = window.getComputedStyle(document.querySelector('html'));
    const scrollbarGutter = css.getPropertyValue('scrollbar-gutter');

    if (scrollbarGutter.includes('stable')) {
      this.style.right = '4px';
    }

    this.style.justifyContent = horizontalStyle;
    this.style.transform = `translateY(${top ? 1 : -1}px)`;
    this.setAttribute('aria-role', 'status');
    this.setAttribute('aria-live', 'polite');
    this.appendChild(toastBar);

    // Remove toast after timeout
    setTimeout(() => {
      this.childNodes[0].classList.add('dismiss');

      setTimeout(() => {
        this.remove();
      }, this.EXIT_ANIMATION_TIMEOUT);
    }, timeout);
  }

  createToastBar() {
    const toastBar = document.createElement('div');
    toastBar.classList.add('toast-bar');
    return toastBar;
  }

  createCloseButton(closeable) {
    if (closeable != false && closeable != 'undefined') {
      const toastCloseIcon = document.createElement('div');
      toastCloseIcon.classList.add('toast-icon');

      const closeButton = document.createElement('button');
      closeButton.classList.add('close-icon');
      closeButton.setAttribute('aria-label', 'close');
      closeButton.setAttribute('aria-hidden', 'true');
      closeButton.setAttribute('tabindex', '-1');

      closeButton.addEventListener('click', () => {
        this.childNodes[0].classList.add('dismiss');

        setTimeout(() => {
          this.remove();
        }, this.EXIT_ANIMATION_TIMEOUT);
      });

      toastCloseIcon.appendChild(closeButton);

      return toastCloseIcon;
    }
  }

  createMessage(message) {
    const toastMessage = document.createElement('div');
    toastMessage.classList.add('toast-message');
    toastMessage.innerHTML = message;
    return toastMessage;
  }

  createIcon(toastType = 'blank') {
    const toastIcon = document.createElement('div');
    toastIcon.classList.add('toast-icon');

    switch (toastType) {
      case 'success':
        const checkmarkIcon = document.createElement('div');
        checkmarkIcon.classList.add('checkmark-icon');
        toastIcon.appendChild(checkmarkIcon);
        return toastIcon;
      case 'error':
        const errorIcon = document.createElement('div');
        errorIcon.classList.add('error-icon');
        toastIcon.appendChild(errorIcon);
        return toastIcon;
      case 'loading':
        const loadingIcon = document.createElement('div');
        loadingIcon.classList.add('loading-icon');
        toastIcon.appendChild(loadingIcon);
        return toastIcon;
      case 'blank':
        return toastIcon;
      default:
        return toastIcon;
    }
  }
}

customElements.define('hot-toast-item', ToastItem);
