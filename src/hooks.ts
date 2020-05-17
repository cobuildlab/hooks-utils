import {useState} from "react";

export type UsePromiseParams = {
    initialValue?: any
    reducer?: Function
};
/**
 * React Hook to manage promises.
 * @param {Promise} promise - The promise to be resolved.
 * @param {initialValue} initialValue -  An initial value to be hold until the promise is resolved.
 */
const usePromise = (promise: Promise<any>, params: UsePromiseParams) => {
    const [value, setValue] = useState(params.initialValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const replay = () => {
        setLoading(true);
        promise.then(result => {
            setLoading(false);
            if (params.reducer !== null && params.reducer !== undefined)
                setValue(params.reducer(result))
            else setValue(result);
        }).catch(error => {
            setLoading(false);
            setError(error)
        });
    };
    replay();
    return [value, loading, error, replay];
};
export {usePromise};
