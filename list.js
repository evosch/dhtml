class List extends HTMLElement {
  constructor() {
    super();
    
    const template = document.createElement('template');
    for (child in this.childNodes) {
      template.appendChild(child.cloneNode(true));
    }
    this.#content = template.content;
  }
  
  setItems(data) {
    if (!data) { return; }
    // remove childen
    for (const item in data) {
      const listItem = this.#content.cloneNode(true);
      this.appendChild(listItem);
    }
  }
}

// Define the new element
customElements.define('list', List);