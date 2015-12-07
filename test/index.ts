import {expect} from 'chai';
const pickrr = require('../index');

describe('pickrr', () => {
  it('has expected properties', () => {
    expect(pickrr).to.have.property('string').that.is.a('string');
    expect(pickrr).to.have.property('number').that.is.a('number');
    expect(pickrr).to.have.property('integer').that.is.a('number');
    expect(pickrr).to.have.property('float').that.is.a('number');
    expect(pickrr).to.have.property('date').that.is.a('date');

    expect(pickrr).to.have.property('pick').that.is.a('function');
    expect(pickrr).to.have.property('pickRqr').that.is.a('function');
  });

  it('picks', () => {
    const obj = {
      name: 'Louay',
      email: 'louay@example.com',
    };

    const picked = {
      name: 'Louay',
    };

    expect(pickrr.pick({
      name: pickrr.string,
    }, obj)).to.deep.equal(picked);

    expect(pickrr.pickRqr({
      name: pickrr.string,
    }, obj)).to.deep.equal(picked);
  });

  it('throws for required attributes', () => {
    const obj = {
      name: 'Louay',
      email: 'louay@example.com',
    };

    expect(() => pickrr.pickRqr({
      name: pickrr.string,
      age: pickrr.integer,
    }, obj)).to.throw();

    expect(() => pickrr.pick({
      name: pickrr.string,
      age: pickrr.integer,
    }, obj)).not.to.throw();
  });

  it('respects string');
  it('respects number');
  it('respects date');

  it('accepts multiple objects');
});
