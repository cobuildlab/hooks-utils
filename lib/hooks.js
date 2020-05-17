'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.usePromise = void 0;
const react_1 = require('react');
/**
 * React Hook to manage promises.
 * @param {Promise} promise - The promise to be resolved.
 * @param {initialValue} initialValue -  An initial value to be hold until the promise is resolved.
 */
const usePromise = (promise, params) => {
  const [value, setValue] = react_1.useState(params.initialValue);
  const [loading, setLoading] = react_1.useState(true);
  const [error, setError] = react_1.useState(null);
  const replay = () => {
    setLoading(true);
    promise
      .then((result) => {
        setLoading(false);
        if (params.reducer !== null && params.reducer !== undefined)
          setValue(params.reducer(result));
        else setValue(result);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  };
  replay();
  return [value, loading, error, replay];
};
exports.usePromise = usePromise;
