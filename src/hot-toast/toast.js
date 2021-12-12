const MARGIN = 16;

const generateId = (() => {
  let count = 0;
  return () => {
    return (++count).toString();
  };
})();

function createToast(message, type = 'blank', options) {
  const id = generateId();
  const hotToastItem = document.createElement('hot-toast-item');

  hotToastItem.setAttribute('message', message);
  hotToastItem.setAttribute('type', type);
  hotToastItem.setAttribute('data-toast-id', id);
  hotToastItem.setAttribute('closeable', options.closeable);
  hotToastItem.setAttribute('duration', options.duration);
  hotToastItem.setAttribute('position', options.position);
  hotToastItem.setAttribute('icon', options.icon);

  recalculateToastPosition(hotToastItem);

  const hotToast = document.querySelector('hot-toast');
  hotToast.appendChild(hotToastItem);

  return {
    id,
    createdAt: Date.now(),
    type,
    message,
    ...options
  };
}

function createHandler(type) {
  return function (
    message,
    options = { icon: '', position: 'top-center', duration: null, closeable: false }
  ) {
    const toast = createToast(message, type, options);
    return toast.id;
  };
}

function toast(message, options) {
  return createHandler('blank')(message, options);
}

toast.loading = createHandler('loading');
toast.success = createHandler('success');
toast.error = createHandler('error');

toast.dismiss = function (toastId) {
  const toastItems = document.querySelectorAll('hot-toast-item');

  for (const toastItem of toastItems) {
    const dataId = toastItem.getAttribute('data-toast-id');

    if (toastId === dataId) {
      toastItem.childNodes[0].classList.add('dismiss');

      setTimeout(() => {
        toastItem.remove();
      }, 350);
    }
  }
};

toast.promise = function (promise, message = { loading: '', success: '', error: '' }, options) {
  const id = toast.loading(message.loading, { ...options });

  return promise
    .then((result) => {
      toast.dismiss(id);
      toast.success(message.success, { ...options });
      return result;
    })
    .catch((error) => {
      toast.dismiss(id);
      toast.error(message.error, { ...options });
      return error;
    });
};

export { toast };

function recalculateToastPosition(node) {
  const hotToastOffset = getNodeHeight(node);
  const toastItems = document.querySelectorAll('hot-toast-item');

  if (toastItems.length > 0) {
    for (let i = 0; i < toastItems.length; i++) {
      const toast = toastItems[i];
      const { _, y } = getTranslateValues(toast);

      toast.style.transform = `translateY(${hotToastOffset + y + MARGIN}px)`;
    }
  }
}

/*
 * Author: vsync
 * Source: https://stackoverflow.com/questions/5944038/getting-the-height-of-an-element-before-added-to-the-dom
 */

/**
 * Gets node element height
 * @param {HTMLElement} node
 * @returns {number} height
 */
function getNodeHeight(node) {
  const clone = node.cloneNode(true);
  // Hide the meassured (cloned) element
  clone.style.visibility = 'hidden';
  // Add the clone element to the DOM
  document.body.appendChild(clone);
  // Measure the clone element
  const height = clone.clientHeight;
  // Remove the clone element from the DOM
  clone.parentNode.removeChild(clone);

  return parseInt(height);
}

/**
 * Author: Zell Liew
 * Source: https://zellwk.com/blog/css-translate-values-in-javascript/
 */

/**
 * Gets computed translate values
 * @param {HTMLElement} element
 * @returns {Object}
 */
function getTranslateValues(element) {
  const style = window.getComputedStyle(element);
  const matrix = style['transform'] || style.webkitTransform || style.mozTransform;

  // No transform property. Simply return 0 values.
  if (matrix === 'none' || typeof matrix === 'undefined') {
    return {
      x: 0,
      y: 0,
      z: 0
    };
  }

  // Can either be 2d or 3d transform
  const matrixType = matrix.includes('3d') ? '3d' : '2d';
  const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');

  // 2d matrices have 6 values
  // Last 2 values are X and Y.
  // 2d matrices does not have Z value.
  if (matrixType === '2d') {
    return {
      x: parseInt(matrixValues[4]),
      y: parseInt(matrixValues[5]),
      z: 0
    };
  }

  // 3d matrices have 16 values
  // The 13th, 14th, and 15th values are X, Y, and Z
  if (matrixType === '3d') {
    return {
      x: parseInt(matrixValues[12]),
      y: parseInt(matrixValues[13]),
      z: parseInt(matrixValues[14])
    };
  }
}
