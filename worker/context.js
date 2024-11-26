import { _set, _inflate } from './helpers.js';
import Monitor from '././monitor.js';

const STORE = Symbol('reference for storage');

class Context  {
  #state = {};
  #observed = new Set();
  #monitors = new Set();
  
  constructor(initialState = {}){
    this.#state = initialState;
  }

  get() {
    return this.#state;
  }
  
  register(name, attr) {
    super.register(name, attr);
    this.#state[name] = attr.getStore();
    this.subscribe(STORE, name, name);
  }
  
  update(path, update) {
    this.#state = _set(this.#state, path, update);
    this.#observed.add(path);
  }
  
  subscribe(id, prop, value) {
    const monitor = new Monitor(id, prop, value, this);
    this.#monitors.add(monitor);
    return monitor;
  }
  
  unsubscribe(monitor) {
    return this.#monitors.delete(monitor);
  }
  
  async flush() {
    const toEvaluate = new Set();
    for (const monitor of this.#monitors) {
      if (monitor.affected(changes)) {
        toEvaluate.add(monitor);
      }
    }
    
    if (toEvaluate.size < 1) { return; }
    
    const changes = [];
    for (const parser of toEvaluate) {
      changes = await parser.evaluate(state);
    }
    
    const changeObject = _inflate(changes);
    
    self.postMessage(changeObject);
    
    Object.entries(changeObject[STORE]).forEach(([k,v]) => {
      const { setStore } = this.getItem(k);
      setStore(context);
    });
  }
}

export default Context;
