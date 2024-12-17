import { _set, _inflate } from './helpers.js';
import Monitor from '././monitor.js';

const STORAGES_KEY = Symbol('reference for storage');

class Context  {
  #state = {};
  #observed = new Set();
  #monitors = [];
  
  constructor(initialState = {}){
    this.#state = initialState;
  }

  get() {
    return this.#state;
  }
  
  /**
  * Register a new store into the context
  * @params {string} name - the name by which the store can be accessed
  * @params {}
  */
  register(name, attr) {
    // read original store data
    this.#state[name] = attr.getStore();
  }
  
  /**
  * update the state in the context
  * @params {string[]} path - path to be updated
  * @params {unknown} update - new value
  */
  update(path, update) {
    this.#state = _set(this.#state, path, update);
    this.#observed.add(path);
  }
  
  /**
  * subscribe to changes of a specific part of the context
  * @params {string} id - ??
  * @params {string[]} prop - ??
  * @params {string} value - ??
  */
  subscribe(id, prop, value) {
    const monitor = new Monitor(id, prop, value, this);
    this.#monitors.push(monitor);
    return monitor;
  }
  
  /**
  * remove a previous subscription
  * @params {Monitor} monitor - the result of the previous subscription
  */
  unsubscribe(monitor) {
    this.#monitors = this.#monitors.filter(m => m !== monitor);
  }
  
  /**
  * take all changes since the last flush, check which subscriptions are affected and calculate a computed response if required
  */
  async flush() {
    const toEvaluate = new Set();
    for (const monitor of this.#monitors) {
      if (monitor.affected(this.#observed)) {
         changes.push(parser.evaluate(this.#state));
      }
    }
    
    if(changes.length <= 0) { return; }

    const result = await Promise.all(changes);
    
    self.postMessage(result);
    
    // TODO update stores
  }
}

export default Context;
