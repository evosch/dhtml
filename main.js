const myWorker = new Worker("./worker/worker.js", { type: 'module' });

myWorker.addEventListener('message', (event) => {
  console.log(event);
  const { data } = event;
  for (const id in data) {
    const obj = document.getElementById(id);
    if (!obj) { continue; }
    const props = data[id];
    for (const k in props) {
      if (obj.hasAttribute(k)) {
        obj.setAttribute(k, props[k]);
        continue;
      }
      if (typeof obj[k] == 'function') {
        obj[k](props[k]);
        continue;
      }
      obj[k] = props[k];
    }
  }
})

const callback = (mutationList) => {
   for (const mutation of mutationList) {
      
   }
}

const config = {
  subtree: true,
  childList: true,
  attributes: true,
};

const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

const elements = document.querySelectorAll(`[eo-*]');
  for (const element of elements) {
    const attr = element.attributes;
    myWorker.postMessage(attr);
  }
}

/*
myWorker.postMessage({
  action: 'internal.register',
  payload: {
    id: '1',
    props: {
      innerText: {
        parser: 'ld',
        value: 'people.data.name'
      }
    }
  }
})

myWorker.postMessage({
  action: 'query',
  payload: {
    variableName: ['people'],
    request: {
      url: 'https://swapi.dev/api/people/1/'
    }
  }
})
*/