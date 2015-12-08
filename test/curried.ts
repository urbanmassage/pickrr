import {expect} from 'chai';
import {pick, pickRqr, pickr, pickrRqr, string, integer} from '../index';

describe('pickrr', () => {
  it('has curried pick function `pickr`', () => {
    const obj = {
      name: 'some string',
      age: 25,
    };
    const rules = {
      name: string,
      age: integer,
    };

    const curriedPick = pickr(rules);

    expect(curriedPick).to.be.a('function');

    expect(curriedPick(obj)).to.deep.equal(pick(rules, obj));
  });

  it('has curried pickRqr function `pickRqr`', () => {
    const obj = {
      name: 'some string',
      age: 25,
    };
    const rules = {
      name: string,
      age: integer,
    };

    const curriedPick = pickrRqr(rules);

    expect(curriedPick).to.be.a('function');

    expect(curriedPick(obj)).to.deep.equal(pickRqr(rules, obj));
  });
});
