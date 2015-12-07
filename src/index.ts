export const string: string = '';
export const number: number = 0;
export const integer: number = 1;
export const float: number = 2;
export const boolean: boolean = true;
export const date: Date = new Date();

function hasProp(prop: string, obj: Object): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function _pick<T>(path: string, required: boolean, rules: T, ...objects: any[]): T {
  const output: T = <any>{};

  Object.keys(rules).forEach(key => {
    if (!hasProp(key, rules)) return;

    const type = rules[key];
    const truePath = (path ? path + '.' : '') + key;

    // Handle nested objects
    if (typeof type === 'object' && !Array.isArray(type)) {
      output[key] = _pick(truePath, required, type, objects.map(obj => obj && obj[key]).filter(obj => !!obj));
    }

    const value: typeof type = objects.reduce((value, object) => {
      if (typeof value !== 'undefined') return value;
      return object ? object[key] : undefined;
    }, undefined);

    // Not found in any object.
    if (typeof value === 'undefined') {
      if (required) {
        const err: any = new Error('Missing attribute "' + truePath + '"');
        err.attribute = truePath;
        throw err;
      }
      return;
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

    switch (type) {
    case string:
      return output[key] = value + '';
    case number:
    case float:
      return output[key] = parseFloat(value);
    case integer:
      return output[key] = parseInt(value, 10);
    case boolean:
      return output[key] = !!value;
    case date:
      return output[key] = typeof value === 'Date' ? value : new Date(value);
    }

    // Unknown type.
  });

  return output;
};

export function pick<T>(rules: T, ...objects: any[]): T {
  return _pick<T>('', false, rules, ...objects);
}

export function pickRqr<T>(rules: T, ...objects: any[]): T {
  return _pick<T>('', true, rules, ...objects);
}
