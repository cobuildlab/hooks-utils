import { useState, useEffect, useCallback, useRef } from 'react';

export type UsePromiseCall<T> = Promise<T | Error>;
export type UsePromiseError = Error | null;
export type UsePromiseReturn<T> = [
  T,
  boolean,
  { error: UsePromiseError; call: () => UsePromiseCall<T> },
];
export interface UsePromiseOptions<T, U> {
  initialState?: U;
  skip?: boolean;
  onCompleted?: (result: T) => void;
  onError?: (error: Error) => void;
  reducer?: (state: T) => U;
}
export interface UsePromiseRef<T, U> extends UsePromiseOptions<T, U> {
  promise: () => Promise<T>;
  mounted: boolean;
}
export interface UsePromiseState<T> {
  loading: boolean;
  result: T;
  error: UsePromiseError;
}

function usePromise<T>(promise: () => Promise<T>): UsePromiseReturn<T>;
function usePromise<T, U>(
  promise: () => Promise<T>,
  options?: UsePromiseOptions<T, U>,
  dependencies?: Array<unknown>,
): UsePromiseReturn<U>;
/**
 * @param {Function} promise - A funtion that returns the promise to handle.
 * @param {object} options - Options to set the hook.
 * @param {Array} dependencies - Dependencies to re-run the promise automatically.
 * @returns {object} Hook state.
 */
function usePromise<T, U>(
  promise: () => Promise<T>,
  options?: UsePromiseOptions<T, U>,
  dependencies: Array<unknown> = [],
): UsePromiseReturn<T | U> {
  const [{ loading, result, error }, setState] = useState<
    UsePromiseState<T | U>
  >(() => ({
    result: options?.initialState as T | U,
    loading: false,
    error: null,
  }));

  const ref = useRef<UsePromiseRef<T, U>>({
    promise,
    ...options,
    mounted: true,
  });

  const call = useCallback(async (): UsePromiseCall<T> => {
    setState((state) => ({ ...state, loading: true }));

    try {
      const response = await ref.current.promise();
      const { onCompleted, mounted, reducer } = ref.current;

      if (mounted) {
        if (onCompleted) onCompleted(response);

        const newState = reducer ? reducer(response) : response;

        setState((state) => ({ ...state, loading: false, result: newState }));
      }

      return response;
    } catch (error) {
      const { onError, mounted } = ref.current;

      if (mounted) {
        if (onError) onError(error);
        setState((state) => ({ ...state, loading: false, error: error }));
      }

      return error;
    }
  }, []);

  ref.current = {
    ...ref.current,
    promise,
    ...options,
  };

  const shouldCall = options?.skip ? false : true;

  useEffect(() => {
    if (shouldCall) call();

    return () => {
      ref.current.mounted = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call, shouldCall, ...dependencies]);

  return [result, loading, { error, call }];
}

/**
 * Shorthand for useEffect with an empty dependencies array.
 * It basically executes the function once on mount and unmount.
 *
 * @param {Function} fn - React effect callback to run on mount and unmount.
 * @returns {void}
 */
// eslint-disable-next-line react-hooks/exhaustive-deps
const useOnMount = (fn: React.EffectCallback): void => useEffect(fn, []);

export { usePromise, useOnMount };
