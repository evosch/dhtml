import { _get } from "./helpers.js";

export default {
  evalFn: (p, context) => {
    return _get(context, p._sv);
  },
  depsFn: (source) => {
    source._sv = source.value.split('.')
    return [source._sv];
  }
};