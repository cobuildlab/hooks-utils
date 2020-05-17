# Hooks utils

A set of hooks for common scenarios developing React and React Native applications.

## Installation

1. Run on your terminal the following command:
```sh
$ npm i --save @cobuildlab/hooks-utils
```

2. To import the library anywhere you would like to use it:
```js
import {usePromise} from '@cobuildlab/hooks-utils';
```

## API Docs

| Object   | Description   | 
| ------ | ------ | 
| [`UsePromiseParams`](#UsePromiseParams) | Params for the `usePromise`.  |
| [`usePromise`](#usePromise) | A hook for resolve promises in a declarative way.  |


### `UsePromiseParams`

- `initialValue` - An initial value for the hook.
- `reducer` A function that mutates the state of the promise result before it gets returned.

### `usePromise(promise, initialValue)`

- It manages the promise lifecycle in a declarative way for React Components.

[`Example`](#Examples)

```javascript
// AgencyView.js

import {usePromise} from "@cobuildlab/hooks-utils";
import {fetchAgencies, fetchRoles} from "./agency-actions.js" import {useCallback} from "react";

const AgencyView = ()=> {
    const [data, loading, error, replay] = usePromise(fetchAgencies);
    const [data, loading, error, replay] = usePromise(fetchRoles, {initialValue:[], reducer: rolesData => rolesData.data});
    
    const submit = useCallback(() => {
      // Do something
      replay();
    });   
      
    return (); 
}
```

## Changelog

### v0.1.0:

- `usePromise` hook
