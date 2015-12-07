import {expect} from 'chai';
import {pick, pickRqr, string, integer} from '../index';

describe('pickrr', () => {
  it('picks', () => {
    const obj = {
      name: 'Louay',
      email: 'louay@example.com',
    };

    const picked = {
      name: 'Louay',
    };

    expect(pick({
      name: string,
    }, obj)).to.deep.equal(picked);

    expect(pickRqr({
      name: string,
    }, obj)).to.deep.equal(picked);
  });

  it('throws for required attributes', () => {
    const obj = {
      name: 'Louay',
      email: 'louay@example.com',
    };

    expect(() => pickRqr({
      name: string,
      age: integer,
    }, obj)).to.throw();

    expect(() => pick({
      name: string,
      age: integer,
    }, obj)).not.to.throw();
  });

  it('accepts multiple objects');
});
