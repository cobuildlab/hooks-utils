import { useState, useEffect, useCallback, useRef } from 'react';

export type UsePromiseParams = {
  initialValue?: any;
  reducer?: Function;
};
/**
 * React Hook to manage promises.
 * This hook receives a promise to be resolved and then reduced as a staful value.
 * May receives a reducer fucntion to map the result to a more proper data structure.
 *
 * @param {Promise} promise - The promise to be resolved.
 * @param {object} params - Param options.
 * @param {any} params.initialValue -  An initial value to be hold until the promise is resolved.
 * @param {Function} params.reducer -  A reducer to map the resolved data.
 * @returns {Array<any,boolean,{error:object,replay:Function}>} - And array which first value is the current state, second is the loading state, a the third is an object with a error value and replay callback.
 */
function usePromise(promise: Promise<any>, params: UsePromiseParams) {
  const [{ value, loading, error }, setState] = useState({
    value: params.initialValue,
    loading: true,
    error: null,
  });

  // Define a mutable state to know if the hook is mounted
  // this is to avoid update the state when the hook is unmounting or unmounted
  // This could happend if the hook is unmounted before the promise has been resolved
  const mounted = useRef(true);

  const replay = useCallback(() => {
    setState((state) => ({ ...state, loading: true }));

    promise
      .then((result) => {
        const newState = { loading: false, value: null };

        if (params.reducer !== null && params.reducer !== undefined)
          newState.value = params.reducer(result);
        else newState.value = result;

        // check if the hook if mounted before update the state
        if (mounted.current) setState((state) => ({ ...state, ...newState }));
      })
      .catch((error) => {
        // check if the hook if mounted before update the state
        if (mounted.current)
          setState((state) => ({ ...state, loading: false, error }));
      });
  }, [promise, params]);

  useEffect(() => {
    replay();
    return () => {
      mounted.current = false;
    };
  }, [replay]);

  return [value, loading, { error, replay }];
}
export { usePromise };
