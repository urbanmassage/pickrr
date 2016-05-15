import * as hata from 'hata';

export interface PickrrType<T> {
  (value: any): T | void;
}

export function isPickrrType<T>(fn: any): fn is PickrrType<any> {
  return typeof fn === 'function';
}

export function convertToTypePicker<T>(pickrrType: PickrrType<T> | T): PickrrType<T> {
  if (isPickrrType(pickrrType)) return pickrrType;
  if (
    // string literals support
    typeof pickrrType === 'string' ||
    // numeric values support
    typeof pickrrType === 'number'
  ) {
    return value => value === pickrrType ? value : void 0;
  }
  throw new Error(`Unknown type passed to pickrr#convertToTypePicker: <${typeof pickrrType}> ${pickrrType}`);
}

/** A string */
export const string: string = (
  value =>
    value == null ? void 0 : `${value}`
) as PickrrType<string> as any;

const FloatType: PickrrType<number> = value => {
  let vFloat = parseFloat(value);
  if (isNaN(vFloat)) return void 0;
  return vFloat;
};
/** A number (float or int) */
export const number: number = FloatType as any;
export const float: number = FloatType as any;

export const integer: number = (
  value => {
    let vInt = parseInt(value, 10);
    if (isNaN(vInt)) return void 0;
    return vInt;
  }
) as PickrrType<number> as any;

/** A boolean (true/false) */
export const boolean: boolean = (
  value =>
    value == null ? void 0 : !!value
) as PickrrType<boolean> as any;

export const date: Date = (
  value => {
    let vDate = typeof value === 'Date' ? value : new Date(value);
    if (isNaN(vDate)) {
      return void 0;
    }
    return vDate;
  }
) as PickrrType<Date> as any;

/** Anything (just like in TypeScript) */
export const any: any = (
  value =>
    value
) as PickrrType<any> as any;

export function oneOf<T1>(type1: T1): T1;
export function oneOf<T1, T2>(type1: T1, type2: T2): T1 | T2;
export function oneOf<T1, T2, T3>(type1: T1, type2: T2, type3: T3): T1 | T2 | T3;
export function oneOf<T1, T2, T3, T4>(type1: T1, type2: T2, type3: T3, type4: T4): T1 | T2 | T3 | T4;
export function oneOf<T1, T2, T3, T4, T5>(type1: T1, type2: T2, type3: T3, type4: T4, type5: T5): T1 | T2 | T3 | T4 | T5;
export function oneOf<T>(...types: T[]): T;
export function oneOf<T>(...types: T[]): T {
  return (
    value =>
      types.reduce((val, type) => val == null ? convertToTypePicker(type)(value) as T : val, void 0)
  ) as PickrrType<T> as any;
}

function hasProp(prop: string, obj: Object): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function isPlainObject(object: any): object is Object {
  return Object.prototype.toString.call(object) === '[object Object]';
}

function deepObjectAssign<T1, T2>(t1: T1, t2: T2): T1 & T2;
function deepObjectAssign<T1, T2, T3>(t1: T1, t2: T2, t3: T3): T1 & T2 & T3;
function deepObjectAssign(...objects: Object[]) {
  const [target, ...rest] = objects;
  for (const obj of rest) {
    for (const key of Object.keys(obj)) {
      if (isPlainObject(target[key])) {
        target[key] = deepObjectAssign(target[key], obj[key]);
      } else {
        target[key] = obj[key];
      }
    }
  }
  return target;
}

function _pick<T>(path: string, required: boolean, rules: T, ...objects: any[]): T {
  const output: T = <any>{};

  objects = objects.filter(obj => !!obj);

  Object.keys(rules).forEach(key => {
    /* istanbul ignore next */
    if (!hasProp(key, rules)) return;

    const type = rules[key];
    const truePath = (path ? path + '.' : '') + key;

    // Handle nested objects
    if (isPlainObject(type)) {
      output[key] = _pick(truePath, required, type, ...objects.map(obj => obj && obj[key]).filter(obj => !!obj));
      return;
    }

    const value: typeof type = objects.reduce((value, object) => {
      if (value != null) return value;
      // keep previous null value if exists
      return object[key] === undefined ? value : object[key];
    }, undefined);

    // Not found in any object.
    if (value == null) {
      if (required) {
        throw hata(400, `Missing attribute "${truePath}"`, {
          attribute: truePath,
        });
      }
      if (typeof value === 'undefined') {
        // skip undefined values
        return;
      }
    }

    // Handle arrays
    if (Array.isArray(type)) {
      /* istanbul ignore next */
      if (type.length !== 1) {
        console.warn(new Error(`pickrr#pick can only accept Arrays with one value. You passed: ${type}`).stack);
      }

      output[key] = value.map((val, index) => {
        let newVal = _pick(truePath, required, {
          [index]: type[0],
        }, {
            [index]: val,
          });

        return newVal ? newVal[index] : undefined;
      });
      return;
    }

    // Keep null as is.
    if (value == null) {
      if (required) {
        throw hata(400, `Missing value for attribute "${truePath}"`, {
          attribute: truePath,
        });
      }
      return output[key] = value;
    }

    const pickrrType = convertToTypePicker(type);
    const newValue = pickrrType(value);
    if (required && typeof newValue === 'undefined') {
      throw hata(400, `Invalid value for attribute "${truePath}"`, {
        attribute: truePath,
      });
    }
    return output[key] = newValue;
  });

  return output;
};

/**
 * Pick attributes.
 *
 * Null/undefined attributes are left intact.
 * You can pass multiple objects and only the first non-null value
 *   for each attribute will be considered.
 */
export function pick<T>(rules: T, ...objects: any[]): T;
export function pick<T>(rules: T, ...objects: any[]): T {
  return _pick<T>('', false, rules, ...objects);
}

/**
 * Pick required attributes.
 *
 * Will throw hata 400 only in case one of the attributes is null or undefined.
 * Doesn't check for emptiness/falseness.
 *
 * You can pass multiple objects and only the first non-null value
 *   for each attribute will be considered.
 */
export function pickRqr<T>(rules: T, ...objects: any[]): T {
  return _pick<T>('', true, rules, ...objects);
}

/**
 * Curried version of `#pick`
 * @see pick()
 */
export function pickr<T>(rules: T): (...objects: any[]) => T {
  return (...objects: any[]) => pick(rules, ...objects);
}

/**
 * Curried version of `#pickRqr`
 * @see pickRqr()
 */
export function pickrRqr<T>(rules: T): (...objects: any[]) => T {
  return (...objects: any[]) => pickRqr(rules, ...objects);
}

/**
 * Pick with two set of rules. One for required values and one for the optional ones.
 *
 * Note: Merge is not recursive yet.
 *
 * @see pick()
 * @see pickRqr()
 */
export function pick2<T>(requiredRules: T, optionalRules: Object, ...objects: any[]): T;
export function pick2<T1, T2>(requiredRules: T1, optionalRules: T2, ...objects: any[]): T1 & T2;
export function pick2<T1, T2 extends T1>(requiredRules: T1, optionalRules: T2, ...objects: any[]): T1;
export function pick2<T1, T2>(requiredRules: T1, optionalRules: T2, ...objects: any[]): T1 & T2 {
  let obj = pickRqr(requiredRules, ...objects);

  return Object.keys(optionalRules).reduce((obj, key) => {
    if (!hasProp(key, obj)) {
      let val = _pick('', false, {[key]: optionalRules[key]}, ...objects)[key];
      if (val !== undefined) obj[key] = val;
    } else if(isPlainObject(obj[key])) {
      let val = _pick('', false, {[key]: optionalRules[key]}, ...objects)[key];
      deepObjectAssign(obj[key], val);
    }
    return obj;
  }, <T1 & T2> obj);
}

/**
 * Curried version of `#pick2`
 * @see pick2()
 */
export function pick2r<T>(rulesRqr: T, rulesOpt: Object): (...objects: any[]) => T;
export function pick2r<T1, T2>(rulesRqr: T1, rulesOpt: T2): (...objects: any[]) => T1 & T2;
export function pick2r<T1, T2>(rulesRqr: T1, rulesOpt: T2): (...objects: any[]) => T1 & T2 {
  return (...objects: any[]) => pick2<T1, T2>(rulesRqr, rulesOpt, ...objects);
}
