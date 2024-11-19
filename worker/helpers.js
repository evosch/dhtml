export function _isUndefined(val) {
  return val === undefined;
}

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

export function _has(object, path) {
  return _isUndefined(_get(object, path));
}

export function _set(object, path, value) {
  const base = path[0];

  if (base === undefined) {
    return object;
  }

  if (!object.hasOwnProperty(base)) {
    object[base] = {};
  }

  value = path.length <= 1 ? value : _set(object[base], path.slice(1), value);

  return {
    ...object,
      [base]: value,
  }
}

export function _inflate(arr) {
  const r = {};
  for (const a of arr) {
    const path = a.slice(0, -1);
    const v = a.slice(-1);
    r = _set(r, path, v);
  }
  return r;
}