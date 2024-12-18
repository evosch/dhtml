/**
* Check if a value is undefined
* @param {any} val - value to check
* @returns {boolean}
*/
export function _isUndefined(val) {
  return val === undefined;
}

/**
* get an entity from a nested object
* @param {object} object
* @param {string[]} path
* @returns {any}
*/
export function _get(object, path) {
  let x = object;
  for (const step of path) {
    x = x[step];
    if (_isUndefined(x)) {
      return;
    }
  }
  return x;
}

/**
* check if a path exists on an object
* @param {object} object
* @param {string[]} path
* @returns {boolean}
*/
export function _has(object, path) {
  return _isUndefined(_get(object, path));
}


/**
* set a nested value on an object
* @param {object} object
* @param {string[]} path
* @param {any} value
* @returns {object} returns the original object
*/
export function _set(object, path, value) {
  const base = path[0];

  if (base === undefined) {
    return object;
  }

  if (!object.hasOwnProperty(base)) {
    object[base] = {};
  }

  if (path.length > 1) {
    _set(object[base], path.slice(1), value);
    return;
  }
  
  object[base] = value;
  return object;
}
