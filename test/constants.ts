import {expect} from 'chai';
import pickrr = require('../index');

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
});
