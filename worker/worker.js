import Registry from './registry.js';
import Context from './context.js';
import { _get } from './helpers.js';
import { PARSER, ACTION } from './constants.js';

const registry = new Registry();
const context = new Context();

registry.register(PARSER, 'ld', {
  evalFn: (p, context) => {
    return _get(context, p._sv);
  },
  depsFn: (source) => {
    source._sv = source.value.split('.')
    return [source._sv];
  }
});

registry.register(ACTION, 'sequence', {
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

registry.register(ACTION, 'query', {
  evalFn: async ({ variableName, request: { url: requestUrl, ...requestOptions } }, context) => {
    const requestObject = new Request(requestUrl, requestOptions);
    const response = await fetch(requestObject);
    response.data = await response.json();
    context.update(variableName, response);
  }
});

registry.register(ACTION, 'submit', {
  evalFn: ({ variableName, formData }, context) => {
    context.update(variableName, formData);
  },
});

registry.register(ACTION, 'out', {
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
self.onmessage = async (event) => {
  
  const { action, payload } = event.data;
  activeProcesses++;
  await actions.evaluate(action, payload, context);
  activeProcesses--;
  if (activeProcesses === 0) {
    const result = await context.flush();
    self.postMessage(result);
  }
}