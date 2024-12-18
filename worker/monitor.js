import { _has } from './helpers.js';
import { PARSER } from './constants.js'

class Monitor {
  #ref;
  #value;
  #deps;

  /**
  * define a new monitor
  * @param {any} ref - a reference to the object requesting the monitor
  * @param {any} value - the parsable that needs to be monitored
  * @param {Context} context - the context to obtain access to registered parsers
  */
  constructor(ref, value, context) {
    this.#ref = ref;
    this.#value = value;
    this.#deps = registry.getItem(PARSER, value.parser).getDeps(value);
  }

  /**
  * checks if with the provided changes this monitor will be affected
  * @param {any} changes - list of changed context paths
  * @returns {boolean}
  */
  affected(changes) {
    for (const dep of this.#deps) {
      if (_has(changes, dep)) {
        return true;
      }
    }
    return false;
  }

  /**
  * evaluate the monitor, by processing the provided value with the associated parser
  * @param {object} context - the context to be used for the evaluation
  * @returns {[string, any]} an array containing first the original reference followed by the new value
  */
  evaluate(context) {
    const value = registry.getItem(PARSER, this.#value.parser).evaluate(this.#value.value, context);

    return [this.#ref, value];
  }
}

export default Monitor;