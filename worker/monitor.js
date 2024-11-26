import { _has } from './helpers.js';
import { PARSER } from './constants.js'

class Monitor {
  #id;
  #prop;
  #value;
  #deps;

  constructor(id, prop, value, context) {
    this.#id = id;
    this.#prop = prop;
    this.#value = value;
    this.#deps = context.get()[PARSER].getDeps(value);
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
    const value = context.get()[PARSER].evaluate(this.#value, context);

    return [this.#id, this.#prop, value];
  }
}

export default Monitor;