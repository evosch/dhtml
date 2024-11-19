import Parsers from './parsers.js';
import Context from './context.js';
import Actions from './actions.js';
import { _get } from './helpers.js';
import { PARSER, ACTION } from './constants.js';

const parser = new Parsers();
const context = new Context({
  [PARSER]: parser,
});
const actions = new Actions();

parser.register('ld', {
  evalFn: (p, context) => {
    return _get(context, p._sv);
  },
  depsFn: (v) => {
    v._sv = v.split('.')
    return [v._sv];
  }
});

actions.register('sequence', {
  evalFn: async ({ varName, script, start }, context) => {
    let action = script[start];
    while (action) {
      try {
      const { action: actionName, payload, outlets } = action;
        const outlet = await actions.evaluate(actionName, payload, context);
        action = script[outlet || outlets.default];
      } catch (error) {
        action = script[outlets.error];
      }
    }
  },
});

actions.register('query', {
  evalFn: async ({ variableName, request }, context) => {
    const requestObject = new Request(request);
    const response = await fetch(requestObject);
    response.data = await response.json();
    context.update(variableName, response);
  }
});

actions.register('submit', {
  evalFn: ({ variableName, formData }, context) => {
    context.update(variableName, formData);
  },
});
actions.register('internal.register', {
  evalFn: ({ id, props }, context) => {
    Object.entries(props).forEach(([k,v]) => {
      if (!v.parser) { return; }
      context.subscribe(id, k, v);
    })
  }
})

/*
context.register('persist', {
  getStore: () => localStorage.getItem(),
  setStore: (context) => localStorage.setItem()
});
*/
let activeProcesses = 0;
onmessage = async (event) => {
  const { id, action, payload } = event.data;
  activeProcesses++;
  await actions.evaluate(action, playload, context);
  activeProcesses--;
  if (activeProcesses === 0) {
    context.flush();
  }
}