# Pickrr
[![CircleCI](https://img.shields.io/circleci/project/urbanmassage/pickrr.svg)](https://circleci.com/gh/urbanmassage/pickrr)
[![npm](https://img.shields.io/npm/v/pickrr.svg)](http://npmjs.com/package/pickrr)
[![Codecov](https://img.shields.io/codecov/c/github/urbanmassage/pickrr.svg)](https://codecov.io/github/urbanmassage/pickrr)

Contracts in Typescript done right.

## Goal
To have a simple contract in typescript that doesn't need an accompanying interface.
i.e. The contract itself is the interface.

## Installation

```bash
npm i --save pickrr
```

## Usage

### General usage

```ts
import {pick, number, string} from 'pickrr'

// Let's say req.body = {id: '1', name: 'John Doe'}

const data = pick({
  id: number,
  name: string,
}, req.body);

// data now has a signature of {id: number; name: string}
// and a value of {id: 1, name: 'John Doe'}
```

You can even pass multiple objects
```ts
import {pick, number, string, date} from 'pickrr'

const data = pick({
  id: number,
  name: string,
  birthdate: date,
}, req.params, req.body);

// data now has the same signature as the contract itself.
```

### Optional vs required rules

If none of your params are required use the `pick` function.

```ts
const data = pick(
  {
    // optional rules
    id: number,
    name: string,
  }, 
  inputObject1, 
  inputObject2,
  // ... as many other objects to take properties from
);
```


If all of your params are required use the `pickRqr` function.

```ts
const data = pickRqr(
  {
    // required rules
    id: number,
    name: string,
  }, 
  inputObject1, 
  inputObject2,
  // ... as many other objects to take properties from
);
```


If some of your params are required use the `pick2` function which lets you specify some required + some optional rules.

```ts
const data = pick2(
  {
    // required rules
    id: number,
    name: string,
  }, 
  {
    // optional rules
    foo: number,
  }, 
  inputObject1, 
  inputObject2,
  // ... as many other objects to take properties from
);
```

**The trick?**
Take a look at `src/index.ts`.
