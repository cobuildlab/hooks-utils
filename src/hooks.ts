import { useState, useEffect, useCallback, useRef } from 'react';

export interface UsePromiseOptions<T> {
  onComplete?: (result: T) => void;
  onError?: (error: any) => void;
  lazy?: boolean;
  called: boolean;
}
export interface UsePromiseRef<T> extends UsePromiseOptions<T> {
  promise: () => Promise<T>;
  mounted: boolean;
}
export interface UsePromiseState<T> {
  loading: boolean;
  result: T | null;
  error: any | null;
}
export interface UsePromiseReturn<T> extends UsePromiseState<T> {
  call: () => Promise<T | any | null | undefined>;
}

/**
 * @param {Function} promise - A funtion that returns the promise to handle.
 * @param {object} options - Options to set the hook.
 * @returns {object} Hook state.
 */
function usePromise<T>(
  promise: () => Promise<T>,
  options?: UsePromiseOptions<T>,
): UsePromiseReturn<T> {
  const [{ loading, result, error }, setState] = useState<UsePromiseState<T>>({
    loading: false,
    result: null,
    error: null,
  });

  const ref = useRef<UsePromiseRef<T>>({
    promise,
    ...options,
    mounted: true,
    called: false,
  });

  const call = useCallback(async () => {
    setState((state) => ({ ...state, loading: true }));

    ref.current.called = true;

    try {
      const response = await ref.current.promise();
      const { onComplete, mounted } = ref.current;

      if (mounted) {
        if (onComplete) onComplete(response);
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

  useEffect(() => {
    ref.current = {
      ...ref.current,
      promise,
      ...options,
    };

    if (options?.lazy && !ref.current.called) {
      call();
    }
    return () => {
      ref.current.mounted = false;
    };
  });

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
