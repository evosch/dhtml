import { _has } from './helpers.js';
import { PARSER } from './constants.js'

class Monitor {
  constructor(id, prop, value) {
    this.#id = id;
    this.#prop = prop;
    this.#value = value;
    this.#deps = parser.getDeps(value);
  }

  affected(changes) {
    for (const dep of this.#deps) {
      if (_has(changes, dep)) {
        return true;
      }
    }
    return false;
  }

  evaluate(context) {
    const value = context[PARSER].evaluate(this.#value, context);

    return [this.#id, this.#prop, value];
  }
}

export default Monitor;