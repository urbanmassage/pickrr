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
      notNull: null,
    };

    expect(() => pickRqr({
      name: string,
      age: integer,
    }, obj)).to.throw();

    expect(() => pick({
      name: string,
      age: integer,
    }, obj)).not.to.throw();

    expect(() => pickRqr({
      notNull: string,
    }, obj)).to.throw();
  });

  it('accepts multiple objects', () => {
    expect(pick({
      val1: string,
      val2: string,
      val4: string,
    }, {
      val1: 'test',
    }, {
      val2: 'test',
      val4: null,
    }, {
      val1: 'test2', // should be ignored and first value should be used
      val3: 'test',
    }, {
      val4: 'test', // should be ignored and first value should be used
    })).to.deep.equal({
      val1: 'test',
      val2: 'test',
      val4: null,
    });
  });
});
