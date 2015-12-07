export const string: string = '';
export const number: number = 0;
export const integer: number = 1;
export const float: number = 2;
export const boolean: boolean = true;
export const date: Date = new Date();

export function pick<T>(rules: T, ...args: any[]): T {
  throw new Error('Not implemented');
}

export function pickRqr<T>(rules: T, ...args: any[]): T {
  throw new Error('Not implemented');
}
