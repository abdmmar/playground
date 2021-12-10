export async function loadHTML(path) {
  const response = await fetch(path)
  const doc = await response.text()
  const parser = new DOMParser()
  const html = parser.parseFromString(doc, 'text/html')

  return html
}
