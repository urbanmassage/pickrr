import * as hata from 'hata';

/** A string */
export const string: string = '';

/** A number (float or int) */
export const number: number = 0;

export const integer: number = 1;
export const float: number = 2;

/** A boolean (true/false) */
export const boolean: boolean = true;

export const date: Date = new Date();

/** Anything (just like in TypeScript) */
export const any: any = 'ANY';

function hasProp(prop: string, obj: Object): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop);
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
    if (typeof type === 'object' &&
      !Array.isArray(type) &&
      !(type instanceof Date)
    ) {
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
        throw hata(400, 'Missing attribute "' + truePath + '"', {
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
        console.warn('pickrr#pick can only accept Arrays with one value. You passed: ', type);
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
      return output[key] = value;
    }

    switch (type) {
      case any:
        return output[key] = value;
      case string:
        return output[key] = value != null ? value + '' : null;
      case number:
      case float:
        let vFloat = parseFloat(value);
        if (isNaN(vFloat)) {
          if (required) {
            throw hata(400, 'Invalid value for attribute "' + truePath + '"', {
              attribute: truePath,
            });
          } else {
            vFloat = null;
          }
        }
        return output[key] = vFloat;
      case integer:
        let vInt = parseInt(value, 10);
        if (isNaN(vInt)) {
          if (required) {
            throw hata(400, 'Invalid value for attribute "' + truePath + '"', {
              attribute: truePath,
            });
          } else {
            vInt = null;
          }
        }
        return output[key] = vInt;
      case boolean:
        return output[key] = !!value;
      case date:
        let vDate = typeof value === 'Date' ? value : new Date(value);
        if (isNaN(vDate)) {
          if (required) {
            throw hata(400, 'Invalid value for attribute "' + truePath + '"', {
              attribute: truePath,
            });
          } else {
            vDate = null;
          }
        }
        return output[key] = vDate;
    }

    // Unknown type.
    /* istanbul ignore next */
    console.warn('An unknown type was passed to pickrr', type);
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
export function pick2<T>(rulesRqr: T, rulesOpt: Object, ...objects: any[]): T;
export function pick2<T1, T2>(rulesRqr: T1, rulesOpt: T2, ...objects: any[]): T1 & T2;
export function pick2<T1, T2>(rulesRqr: T1, rulesOpt: T2, ...objects: any[]): T1 & T2 {
  let obj = pickRqr(rulesRqr, ...objects);

  return Object.keys(rulesOpt).reduce((obj, key) => {
    if (!hasProp(key, obj)) {
      let val = _pick('', false, {[key]: rulesOpt[key]}, ...objects)[key];
      if (val !== undefined) obj[key] = val;
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
