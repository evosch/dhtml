import Registry from './registry.js';

class Parsers extends Registry {
  getDeps(p) {
    const { depsFn } = this.getItem(p.parser);
    return depsFn(p)
  }

  evaluate(p, context) {
    const { evalFn } = this.getItem(p.parser);
    return evalFn(p, context);
  }
}

export default Parsers;