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
  * @params {string} ref - 
  * @params {string} value - ??
  * @returns {Monitor}
  */
  subscribe(ref, value) {
    const monitor = new Monitor(ref, value, this);
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
  flush() {
    const changes = [];
    for (const monitor of this.#monitors) {
      if (monitor.affected(this.#observed)) {
         changes.push(parser.evaluate(this.#state));
      }
    }
    
    if(changes.length <= 0) { return; }

    return Promise.all(changes);
  }
}

export default Context;
