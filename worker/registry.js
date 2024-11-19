class Registry {
  #registry = {};

  register(name, attr) {
    this.#registry[name] = attr;
  }

  getItem(name) {
    const entry = this.#registry[name];
    if (!entry) {
      throw new Error('missing entry', name);
    }
    return entry;
  }
}

export default Registry;