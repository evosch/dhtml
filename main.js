const myWorker = new Worker("./worker/worker.js");

myWorker.addEventListener('message', (data) => {
  console.log(data);
  for (const id in data) {
    const obj = document.getElementById(id);
    if (!obj) { continue; }
    const props = data[id];
    for (const k in props) {
      if (obj.hasAttribute(k)) {
        obj.setAttribute(k, props[k]);
        continue;
      }
      if (typeof obj[prop] == 'function') {
        obj[prop](props[prop]);
        continue;
      }
      obj[prop] = props[prop];
    }
  }
})

myWorker.postMessage({
  action: 'internal.register',
  payload: {
    id: '1',
    props: {
      innerText: {
        parser: 'ld',
        value: 'people.name'
      }
    }
  }
})

myWorker.postMessage({
  action: 'query',
  payload: {
    variableName: 'people',
    request: {
      url: 'https://swapi.dev/api/people/1/'
    }
  }
})