import { useState, useEffect, useCallback, useRef } from 'react';

export interface UsePromiseOptions<T, U> {
  onCompleted?: (result: T) => void;
  onError?: (error: U) => void;
  skip?: boolean;
}
export interface UsePromiseRef<T, U> extends UsePromiseOptions<T, U> {
  promise: () => Promise<T> | Promise<T>;
  mounted: boolean;
}
export interface UsePromiseState<T, U> {
  loading: boolean;
  result: T | null;
  error: U | null;
}
export interface UsePromiseReturn<T, U> extends UsePromiseState<T, U> {
  call: () => Promise<T | any | null | undefined>;
}

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
): UsePromiseReturn<T, U> {
  const [{ loading, result, error }, setState] = useState<
    UsePromiseState<T, U>
  >({
    loading: false,
    result: null,
    error: null,
  });

  const ref = useRef<UsePromiseRef<T, U>>({
    promise,
    ...options,
    mounted: true,
  });

  const call = useCallback(async () => {
    setState((state) => ({ ...state, loading: true }));

    try {
      const response = await ref.current.promise();
      const { onCompleted, mounted } = ref.current;

      if (mounted) {
        if (onCompleted) onCompleted(response);
        setState((state) => ({ ...state, loading: false, result: response }));
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

  return { loading, result, error, call };
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
