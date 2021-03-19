import {
  useState,
  useEffect,
  useCallback,
  useRef,
  MutableRefObject,
} from 'react';

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

export function usePromise<T>(promise: () => Promise<T>): UsePromiseReturn<T>;
export function usePromise<T, U>(
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
export function usePromise<T, U>(
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

      if (ref.current.mounted) {
        if (ref.current.onCompleted) ref.current.onCompleted(response);

        const newState = ref.current.reducer
          ? ref.current.reducer(response)
          : response;

        setState((state) => ({ ...state, loading: false, result: newState }));
      }

      return response;
    } catch (error) {
      if (ref.current.mounted) {
        if (ref.current.onError) ref.current.onError(error);
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
    ref.current.mounted = true;

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
export function useOnMount(fn: React.EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fn, []);
}

export function useOnClickOutside(
  handler: (event: UIEvent) => void,
): MutableRefObject<HTMLElement | undefined>;

/**
 * Hook that subscribe a function to be call when a click is made out side the component on wich the ref is passed down.
 *
 * @param {Function} handler - Callbanck function to call on outside click.
 * @param {MutableRefObject} innerRef - Ref to bue used instead of create a new one.
 * @returns {MutableRefObject} - Ref to be used on the react component which has to be check.
 */
export function useOnClickOutside(
  handler: (event: UIEvent) => void,
  innerRef?: MutableRefObject<HTMLElement>,
): MutableRefObject<HTMLElement | undefined> {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  const internalRef = useRef<HTMLElement>();

  const ref = innerRef || internalRef;
  useEffect(() => {
    const handlerCallBack = (event: UIEvent) => {
      if (handlerRef.current) handlerRef.current(event);
    };
    const listener = (event: UIEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      handlerCallBack(event);
    };

    // eslint-disable-next-line no-undef
    document.addEventListener('mousedown', listener);
    // eslint-disable-next-line no-undef
    document.addEventListener('touchstart', listener);

    return () => {
      // eslint-disable-next-line no-undef
      document.removeEventListener('mousedown', listener);
      // eslint-disable-next-line no-undef
      document.removeEventListener('touchstart', listener);
    };
  }, [ref]);

  return ref;
}

/**
 * A type-safe version of the `usePrevious` hook described here.
 *
 * @see {@link https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state}.
 *
 * @param value - The state value.
 * @returns The previous value.
 */
export function usePrevious<T>(
  value: T,
): MutableRefObject<T | undefined>['current'] {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}