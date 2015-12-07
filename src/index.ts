export const string: string = '';
export const number: number = 0;
export const integer: number = 1;
export const float: number = 2;
export const boolean: boolean = true;
export const date: Date = new Date();

function hasProp(prop: string, obj: Object): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function _pick<T>(path: string, require: boolean, rules: T, ...objects: any[]): T {
  const output: T = <any>{};

  Object.keys(rules).forEach(key => {
    if (!hasProp(key, rules)) return;

    const type = rules[key];
    const truePath = (path ? path + '.' : '') + key;

    // Handle nested objects
    if (typeof type === 'object') {
      output[key] = _pick(truePath, require, type, objects.map(obj => obj && obj[key]).filter(obj => !!obj));
    }

    const value: typeof type = objects.reduce((value, object) => {
      if (typeof value !== 'undefined') return value;
      return object ? object[key] : undefined;
    }, undefined);

    // Not found in any object.
    if (typeof value === 'undefined') {
      if (require) {
        const err: any = new Error('Missing attribute "' + truePath + '"');
        err.attribute = truePath;
        throw err;
      }
      return;
    }

    switch (type) {
    case string:
      output[key] = value + '';
      return;
    case number:
    case float:
      output[key] = parseFloat(value);
      return;
    case integer:
      output[key] = parseInt(value, 10);
      return;
    case boolean:
      output[key] = !!value;
      return;
    case date:
      output[key] = typeof value === 'Date' ? value : new Date(value);
      return;
    }
  });

  return output;
};

export function pick<T>(rules: T, ...objects: any[]): T {
  return _pick<T>('', false, rules, ...objects);
}

export function pickRqr<T>(rules: T, ...objects: any[]): T {
  return _pick<T>('', true, rules, ...objects);
}
