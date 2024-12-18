class Registry {
  #registry = {};
  
  /**
  * Register a new entity
  * @param {string} group - group to register on
  * @param {string} name - name of the function
  * @param {any} attr - entity to register
  */
  register(group, name, attr) {
    this.#registry[group][name] = attr;
  }

  /**
  * Obtain a entity from the registry
  * @param {string} group - group to register on
  * @param {string} name - name of the function
  * @returns {any}
  * @throws missing entry
  */
  getItem(group, name) {
    const entry = this.#registry[group][name];
    if (!entry) {
      throw new Error('missing entry', name);
    }
    return entry;
  }
}

export default Registry;