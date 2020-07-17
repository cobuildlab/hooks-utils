'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.useOnMount = exports.usePromise = void 0;
const react_1 = require('react');
/**
 * @param {Function} promise - A funtion that returns the promise to handle.
 * @param {object} options - Options to set the hook.
 * @param {Array} dependencies - Dependencies to re-run the promise automatically.
 * @returns {object} Hook state.
 */
function usePromise(promise, options, dependencies = []) {
  const [{ loading, result, error }, setState] = react_1.useState({
    loading: false,
    result:
      options === null || options === void 0 ? void 0 : options.initialState,
    error: null,
  });
  const ref = react_1.useRef(
    Object.assign(Object.assign({ promise }, options), { mounted: true }),
  );
  const call = react_1.useCallback(
    () =>
      __awaiter(this, void 0, void 0, function* () {
        setState((state) =>
          Object.assign(Object.assign({}, state), { loading: true }),
        );
        try {
          const response = yield ref.current.promise();
          const { onCompleted, mounted, reducer } = ref.current;
          if (mounted) {
            if (onCompleted) onCompleted(response);
            const newState = reducer ? reducer(response) : response;
            setState((state) =>
              Object.assign(Object.assign({}, state), {
                loading: false,
                result: newState,
              }),
            );
          }
          return response;
        } catch (error) {
          const { onError, mounted } = ref.current;
          if (mounted) {
            if (onError) onError(error);
            setState((state) =>
              Object.assign(Object.assign({}, state), {
                loading: false,
                error: error,
              }),
            );
          }
          return error;
        }
      }),
    [],
  );
  ref.current = Object.assign(
    Object.assign(Object.assign({}, ref.current), { promise }),
    options,
  );
  const shouldCall = (
    options === null || options === void 0 ? void 0 : options.skip
  )
    ? false
    : true;
  react_1.useEffect(() => {
    if (shouldCall) call();
    return () => {
      ref.current.mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call, shouldCall, ...dependencies]);
  return { loading, result, error, call };
}
exports.usePromise = usePromise;
/**
 * Shorthand for useEffect with an empty dependencies array.
 * It basically executes the function once on mount and unmount.
 *
 * @param {Function} fn - React effect callback to run on mount and unmount.
 * @returns {void}
 */
// eslint-disable-next-line react-hooks/exhaustive-deps
const useOnMount = (fn) => react_1.useEffect(fn, []);
exports.useOnMount = useOnMount;
