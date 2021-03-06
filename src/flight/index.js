function isBadFormat(value) {
  if (typeof value === 'string') {
    const dateInputRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const date = value.match(dateInputRegex);

    if (date) {
      const [, day, month, year] = date;

      if (day > 0 && month > 0 && year > 0 && day < 32 && month < 13) {
        return false;
      }
    }
  }

  return true;
}

function setDeparture(date = new Date()) {
  const today = new Intl.DateTimeFormat('id').format(date);
  const [d, m, year] = today.split('/');
  const day = parseInt(d) < 10 ? '0' + d : d;
  const month = parseInt(m) < 10 ? '0' + m : m;

  return `${day}/${month}/${year}`;
}

class Flight extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = Flight.template();
  }

  connectedCallback() {
    const departureDate = document.getElementById('departure');
    const returnDate = document.getElementById('return');

    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    returnDate.value = setDeparture(tomorrow);
    departureDate.value = setDeparture(today);

    departureDate.addEventListener('input', (e) => {
      if (isBadFormat(e.target.value)) {
        this.setAriaInvalid(departureDate);
        return;
      }

      this.setAriaValid(departureDate);
    });

    returnDate.addEventListener('input', (e) => {
      if (isBadFormat(e.target.value)) {
        this.setAriaInvalid(returnDate);
        return;
      }

      this.setAriaValid(returnDate);
    });
  }

  setAriaInvalid(element) {
    element.setAttribute('aria-invalid', true);
  }

  setAriaValid(element) {
    element.setAttribute('aria-invalid', false);
  }

  static template() {
    return `
      <section id="flight">
        <div class="flight">
          <div class="title">
            <svg
              enable-background="new 0 0 24 24"
              height="32"
              viewBox="0 0 24 24"
              width="32"
              focusable="false"
            >
              <rect fill="none" height="24" width="24"></rect>
              <path
                d="M3.29,6.56l1.41-1.41l9.55,2.47l3.89-3.89c0.59-0.59,1.53-0.59,2.12,0s0.59,1.53,0,2.12l-3.89,3.89l2.47,9.55l-1.41,1.41 l-4.24-7.78l-3.89,3.89l0.35,2.47L8.6,20.35l-1.77-3.18L3.65,15.4l1.06-1.06l2.47,0.35l3.89-3.89L3.29,6.56z"
              ></path>
            </svg>
            <h2>flight</h2>
          </div>
          <div class="travel">
            <div class="origin-container">
              <div class="origin">
                <label for="origin" class="sr-only">Origin</label>
                <div class="input-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    focusable="false"
                    class="IILp3 kmKQme LKTCxe NMm5M"
                  >
                    <path
                      d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm10 6c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z"
                    ></path>
                  </svg>
                  <input list="origin-list" id="origin" name="origin" placeholder="Where from?" />
                </div>

                <datalist id="origin-list">
                  <option value="Bali"></option>
                  <option value="Bandung"></option>
                  <option value="Jakarta"></option>
                  <option value="Makassar"></option>
                  <option value="Palembang"></option>
                </datalist>
              </div>
              <div class="circle-origin"></div>
            </div>

            <div class="travel-circle">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                focusable="false"
                class="Auu9lc NMm5M hhikbc"
              >
                <path
                  d="M17 4l-1.41 1.41L18.17 8H11v2h7.17l-2.58 2.59L17 14l5-5-5-5zM7 20l1.41-1.41L5.83 16H13v-2H5.83l2.58-2.59L7 10l-5 5 5 5z"
                ></path>
              </svg>
            </div>

            <div class="destination-container">
              <div class="destination">
                <label for="destination" class="sr-only">Destination</label>
                <div class="input-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    focusable="false"
                    class="IILp3 oTFJue LKTCxe NMm5M"
                  >
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"
                    ></path>
                    <circle cx="12" cy="9" r="2.5"></circle>
                  </svg>
                  <input
                    list="destination-list"
                    id="destination"
                    name="destination"
                    placeholder="Where to?"
                  />
                </div>

                <datalist id="destination-list">
                  <option value="Bali"></option>
                  <option value="Bandung"></option>
                  <option value="Jakarta"></option>
                  <option value="Makassar"></option>
                  <option value="Palembang"></option>
                </datalist>
              </div>
              <div class="circle-destination"></div>
            </div>
          </div>

          <div class="date">
            <div id="departure-date">
              <label for="departure" class="sr-only">Departure Date</label>
              <div class="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" focusable="false" class="NMm5M">
                  <path
                    d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"
                  ></path>
                  <path
                    d="M8 11c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm4 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm4 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"
                  ></path>
                </svg>
                <input
                  type="text"
                  name="departure"
                  id="departure"
                  placeholder="DD/MM/YYYY"
                  aria-invalid="false"
                />
              </div>
            </div>
            <div id="return-date">
              <label for="return" class="sr-only">Return Date</label>
              <input
                type="text"
                name="return"
                id="return"
                placeholder="DD/MM/YYYY"
                aria-invalid="false"
              />
            </div>
          </div>
          <button class="search-flight">
            <svg width="18" height="18" viewBox="0 0 24 24" focusable="false">
              <path
                d="M20.49 19l-5.73-5.73C15.53 12.2 16 10.91 16 9.5A6.5 6.5 0 1 0 9.5 16c1.41 0 2.7-.47 3.77-1.24L19 20.49 20.49 19zM5 9.5C5 7.01 7.01 5 9.5 5S14 7.01 14 9.5 11.99 14 9.5 14 5 11.99 5 9.5z"
                fill="currentColor"
              ></path>
            </svg>
            Search
          </button>
        </div>
      </section>
    `;
  }
}

customElements.define('flight-card', Flight);
