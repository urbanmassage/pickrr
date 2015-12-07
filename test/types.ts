import {expect} from 'chai';
import {pick, pickRqr, string, boolean, integer} from '../index';

describe('pickrr', () => {
  it('respects string', () => {
    let date = new Date();
    const obj = {
      string: 'String',
      integer: 0,
      float: 25.5,
      date,
      trueish: true,
      falseish: false,
    };

    expect(pick({
      string: string,
      integer: string,
      float: string,
      date: string,
      trueish: string,
      falseish: string,
    }, obj)).to.deep.equal({
      string: 'String',
      integer: '0',
      float: '25.5',
      date: date + '',
      trueish: 'true',
      falseish: 'false',
    });
  });

  it('respects boolean', () => {
    let date = new Date();

    const obj = {
      string: 'String',
      emptyString: '',
      integer: 0,
      float: 25.5,
      date,
      trueish: true,
      falseish: false,
    };

    expect(pick({
      string: boolean,
      emptyString: boolean,
      integer: boolean,
      float: boolean,
      date: boolean,
      trueish: boolean,
      falseish: boolean,
    }, obj)).to.deep.equal({
      string: true,
      emptyString: false,
      integer: false,
      float: true,
      date: true,
      trueish: true,
      falseish: false,
    });
  });

  it('respects number');
  it('respects date');

  it('respects arrays', () => {
    const obj = {
      names: ['Louay', 'Giles', 'Jack'],
    };

    expect(pick({
      names: [string],
    }, obj)).to.deep.equal(obj);
  });

  it('respects nested arrays', () => {
    const obj = {
      matrix: [[1, 2], [3, 4], [5, 6]],
    };

    expect(pick({
      matrix: [[integer]],
    }, obj)).to.deep.equal(obj);
  });
});
