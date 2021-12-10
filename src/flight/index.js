import { loadHTML } from '../index.js'

function main() {
  function departureInput(e) {
    if (isBadFormat(e.target.value)) {
      setAriaInvalid(departureDate)
      return
    }

    setAriaValid(departureDate)
  }

  function returnInput(e) {
    if (isBadFormat(e.target.value)) {
      setAriaInvalid(returnDate)
      return
    }

    setAriaValid(returnDate)
  }

  function setAriaInvalid(element) {
    element.setAttribute('aria-invalid', true)
  }

  function setAriaValid(element) {
    element.setAttribute('aria-invalid', false)
  }

  function isBadFormat(value) {
    if (typeof value === 'string') {
      const date = value.match(dateInputRegex)

      if (date) {
        const [, day, month, year] = value.match(dateInputRegex)

        if (day > 0 && month > 0 && year > 0 && day < 32 && month < 13) {
          return false
        }
      }
    }

    return true
  }

  function setDeparture(date = new Date()) {
    const today = new Intl.DateTimeFormat('id').format(date)
    const [d, m, year] = today.split('/')
    const day = parseInt(d) < 10 ? '0' + d : d
    const month = parseInt(m) < 10 ? '0' + m : m

    return `${day}/${month}/${year}`
  }

  // =============================== MAIN =====================================

  const departureDate = document.getElementById('departure')
  const returnDate = document.getElementById('return')
  const dateInputRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/

  const today = new Date()
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

  returnDate.value = setDeparture(tomorrow)
  departureDate.value = setDeparture(today)

  departureDate.addEventListener('input', departureInput)
  returnDate.addEventListener('input', returnInput)

  // =============================== MAIN =====================================
}

class Flight extends HTMLElement {
  async connectedCallback() {
    const html = await loadHTML('./src/flight/index.html')
    this.innerHTML = html.body.innerHTML
    main()
  }
}

customElements.define('flight-card', Flight)
