export declare type UsePromiseParams = {
    initialValue?: any;
    reducer?: Function;
};
/**
 * React Hook to manage promises.
 * @param {Promise} promise - The promise to be resolved.
 * @param {initialValue} initialValue -  An initial value to be hold until the promise is resolved.
 */
declare const usePromise: (promise: Promise<any>, params: UsePromiseParams) => any[];
export { usePromise };
