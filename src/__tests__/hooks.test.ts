/* eslint-disable no-undef */

import { renderHook } from '@testing-library/react-hooks';
import { usePromise } from '../hooks';

/**
 * @param {number} number - Number.
 * @returns {Array} - Array with the given number.
 */
async function testingPromise(number: number): Promise<Array<Number>> {
  return [number];
}

test('should use promise', async () => {
  const { result, waitForNextUpdate, rerender } = renderHook(
    ({ initialNumber }) =>
      usePromise(() => testingPromise(initialNumber), {}, [initialNumber]),
    {
      initialProps: { initialNumber: 10 },
    },
  );

  expect(result.current[0]).toBeUndefined(); // without initialState the default value is undefined
  expect(result.current[1]).toBe(true); // The loading state is true, the promise is resolving

  await waitForNextUpdate(); // wait to the promise to be resolved

  expect(result.current[0]).toStrictEqual([10]); // the value is the resolved from the promise
  expect(result.current[1]).toBe(false); // the loading state is false

  rerender({ initialNumber: 15 });

  expect(result.current[0]).toStrictEqual([10]); // when changing the props the state is the previos
  expect(result.current[1]).toBe(true); // loading state true and new promise is resolving

  await waitForNextUpdate(); // wait to the promise to be resolved

  expect(result.current[0]).toStrictEqual([15]); // new state with value of the resolved promise
  expect(result.current[1]).toBeFalsy(); // the loading state is false
});
