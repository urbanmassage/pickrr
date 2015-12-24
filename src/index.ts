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

function hasProp(prop: string, obj: Object): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function _pick<T>(path: string, required: boolean, rules: T, ...objects: any[]): T {
  const output: T = <any>{};

  objects = objects.filter(obj => !!obj);

  Object.keys(rules).forEach(key => {
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
      case string:
        return output[key] = value + '';
      case number:
      case float:
        const vFloat = parseFloat(value);
        if (isNaN(vFloat)) {
          throw hata(400, 'Invalid value for attribute "' + truePath + '"', {
            attribute: truePath,
          });
        }
        return output[key] = vFloat;
      case integer:
        const vInt = parseInt(value, 10);
        if (isNaN(vInt)) {
          throw hata(400, 'Invalid value for attribute "' + truePath + '"', {
            attribute: truePath,
          });
        }
        return output[key] = vInt;
      case boolean:
        return output[key] = !!value;
      case date:
        const vDate = typeof value === 'Date' ? value : new Date(value);
        if (isNaN(vDate)) {
          throw hata(400, 'Invalid value for attribute "' + truePath + '"', {
            attribute: truePath,
          });
        }
        return output[key] = vDate;
    }

    // Unknown type.
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
 * @see pick
 */
export function pickr<T>(rules: T): (...objects: any[]) => T {
  return (...objects: any[]) => pick(rules, ...objects);
}

/**
 * Curried version of `#pickRqr`
 * @see pickRqr
 */
export function pickrRqr<T>(rules: T): (...objects: any[]) => T {
  return (...objects: any[]) => pickRqr(rules, ...objects);
}
