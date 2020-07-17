export interface UsePromiseOptions<T, U> {
    onCompleted?: (result: T) => void;
    onError?: (error: any) => void;
    reducer?: (state: T) => U;
    skip?: boolean;
    initialState?: U;
}
export interface UsePromiseRef<T, U> extends UsePromiseOptions<T, U> {
    promise: () => Promise<T> | Promise<T>;
    mounted: boolean;
}
export interface UsePromiseState<T, U> {
    loading: boolean;
    result: T | U | undefined;
    error: any | null;
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
declare function usePromise<T, U>(promise: () => Promise<T>, options?: UsePromiseOptions<T, U>, dependencies?: Array<unknown>): UsePromiseReturn<T, U>;
/**
 * Shorthand for useEffect with an empty dependencies array.
 * It basically executes the function once on mount and unmount.
 *
 * @param {Function} fn - React effect callback to run on mount and unmount.
 * @returns {void}
 */
declare const useOnMount: (fn: React.EffectCallback) => void;
export { usePromise, useOnMount };
