import {expect} from 'chai';
import * as pickrr from '../index';

describe('pickrr', () => {
  it('has expected properties', () => {
    expect(pickrr).to.have.property('string');
    expect(pickrr).to.have.property('number');
    expect(pickrr).to.have.property('integer');
    expect(pickrr).to.have.property('float');
    expect(pickrr).to.have.property('date');

    expect(pickrr).to.have.property('pick').that.is.a('function');
    expect(pickrr).to.have.property('pickRqr').that.is.a('function');
  });
});
