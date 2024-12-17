import { _has } from './helpers.js';
import { PARSER } from './constants.js'

class Monitor {
  #ref;
  #value;
  #deps;

  /**
  * define a new monitor
  * @params {any} ref - a reference to the object requesting the monitor
  * @params {any} value - the parsable that needs to be monitored
  * @params {Context} context - the context to obtain access to registered parsers
  */
  constructor(ref, value, context) {
    this.#ref = ref;
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
    const value = context[PARSER].evaluate(this.#value, context);

    return [this.#ref, value];
  }
}

export default Monitor;