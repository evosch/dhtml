import Registry from './registry.js'

class Actions extends Registry {
  evaluate(action, payload, context) {
    const { evalFn } = this.getItem(action);
    return evalFn(payload, context);
  }
}

export default Actions;