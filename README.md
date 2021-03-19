# Hooks utils

A set of hooks for common scenarios developing React and React Native applications.

## Installation

1. Run on your terminal the following command:

```sh
$ npm i --save @cobuildlab/hooks-utils
```

2. To import the library anywhere you would like to use it:

```js
import { usePromise } from '@cobuildlab/hooks-utils';
```

## API Docs

| Object                                           | Description                                                |
| ------------------------------------------------ | ---------------------------------------------------------- |
| [`UsePromiseParams`](#UsePromiseParams)          | Params for the `usePromise`.                               |
| [`usePromise`](#usepromisepromise-initialvalue)  | A hook for resolve promises in a declarative way.          |
| [`useOnMount`](#useonmounteffectcallback)        | Shorthand for `useEffect` with an empty dependencies array |
| [`useOnClickOutside`](#useOnMounteffectCallback) | Subscribe call to be called when a click is fired outside  | 
[`usePrevious`](#useOnMounteffectCallback) | Get previous value of a state  |

### `UsePromiseParams`

- `initialValue` - An initial value for the hook.
- `reducer` A function that mutates the state of the promise result before it gets returned.

### `usePromise(promise, initialValue)`

- It manages the promise lifecycle in a declarative way for React Components.

[`Example`](#Examples)

```javascript
// AgencyView.js

import { useCallback } from "react";
import { usePromise } from "@cobuildlab/hooks-utils";
import { fetchAgencies, fetchRoles } from "./agency-actions.js"

const AgencyView = ()=> {
  // NOTE: be aware that we using the same names for the error keys returned by the hook
  // This is just for keep the example simplest as posible
  const [agencies, loadingAgencies,  {error, call: fetchAgencies()} ] = usePromise(fetchAgencies);
  const [roles, loadingRoles, {error, call: fetchRoles()} ] = usePromise(()=>fetchRoles(agency), {
    onCmplete: (response)=>{
      console.log(response) // Roles response
    },
    onError: (error)=>{
      console.log(error) // Handle Error
    },
  });

  const fetchData = useCallback(() => {
    // Do something
    fetchRoles();
    fetchAgencies();
  });

  return ();
}
```

### `useOnMount(effectCallback)`

Shorthand for useEffect with an empty dependencies array.
It basically executes the function once on mount and unmount.

[`Example`](#Examples)

```javascript
import React from 'react';
import { useOnMount } from '@cobuildlab/hooks-utils';
import { useHistory } from 'react-router-dom';

const Session = () => {
  const history = useHistory();

  useOnMount(() => {
    if (!isNotAuthenticated) {
      history.push(LOGIN_PAGE_ROUTE);
    } else {
      fetchData(); // Do something
    }
  });

  return <React.Fragment>{children}</React.Fragment>;
};
```

### `useOnClickOutside(callback,innerRef)`

Hook that subscribe a function to be call when a click is made out side the component on wich the ref is passed down.

```javascript
import React, { useState, useRef } from 'react';
import { useOnClickOutside } from '@cobuildlab/hooks-utils';

const Dropdown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDropdown = () => setIsOpen(false);
  const openDropdown = () => setIsOpen(true);

  // close dropdown when a click is fired outside itself
  const ref = useOnClickOutside(() => {
    closeDropdown();
  });
  // pass the ref returned by the hook to the component
  return isOpen && <div ref={ref}>{children}</div>;
};
```

If you already are using a ref inside your component yo could pass it to the hook so the hook use that instead of returning a ref

```javascript
import React, { useState, useRef } from 'react';
import { useOnClickOutside } from '@cobuildlab/hooks-utils';

const Dropdown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDropdown = () => setIsOpen(false);
  const openDropdown = () => setIsOpen(true);
  const ref = useRef();

  // Do somthing with the ref...

  // close dropdown when a click is fired outside itself
  useOnClickOutside(() => {
    closeDropdown();
  }, ref); // passing the ref to the hook

  // pass the same ref to the component
  return isOpen && <div ref={ref}>{children}</div>;
};
```

### `usePrevious(currentState)`

Hook that returns the previous value of a state variable.

```javascript
import React, { useState, useRef } from 'react';

const CreateUser = ({ children }) => {
  const [user, setUser] = useState({ username: '', password: '' });
  const previousUser = usePrevious(user);

  useEffect(() => {
    // compare user with previousUser state here
  }, [user, previousUser]);

  const onChange = (value: string, key: string): void => {
    setData({ ...user, [field]: value });
  }

  return <div onChange={onChange}>{children}</div>;
};
```

## Changelog

### v0.1.6

- `usePrevious`hook

### v0.1.5

- `useOnClickOutside`hook

### v0.1.2

- `useOnMount`hook

### v0.1.0

- `usePromise` hook
