import {expect} from 'chai';
import {pick, string, boolean, number, integer, float, date} from '../index';

describe('pickrr', () => {
  it('respects string', () => {
    let time = new Date();
    const obj = {
      string: 'String',
      integer: 0,
      float: 25.5,
      time,
      trueish: true,
      falseish: false,
    };

    expect(pick({
      string: string,
      integer: string,
      float: string,
      time: string,
      trueish: string,
      falseish: string,
    }, obj)).to.deep.equal({
      string: 'String',
      integer: '0',
      float: '25.5',
      time: time + '',
      trueish: 'true',
      falseish: 'false',
    });
  });

  it('respects boolean', () => {
    let time = new Date();

    const obj = {
      string: 'String',
      emptyString: '',
      integer: 0,
      float: 25.5,
      time,
      trueish: true,
      falseish: false,
    };

    expect(pick({
      string: boolean,
      emptyString: boolean,
      integer: boolean,
      float: boolean,
      time: boolean,
      trueish: boolean,
      falseish: boolean,
    }, obj)).to.deep.equal({
      string: true,
      emptyString: false,
      integer: false,
      float: true,
      time: true,
      trueish: true,
      falseish: false,
    });
  });

  it('respects number', () => {
    let time = new Date();

    const obj = {
      string: 'String',
      emptyString: '',
      integer: 0,
      float: 25.5,
      time,
      trueish: true,
      falseish: false,

      floatInt: 1.5,
      integerInt: 2,
      floatFloat: 5.5,
      integerFloat: 3,
    };

    expect(pick({
      integer: number,
      float: number,

      floatInt: integer,
      integerInt: integer,
      floatFloat: float,
      integerFloat: float,
    }, obj)).to.deep.equal({
      integer: 0,
      float: 25.5,

      floatInt: 1,
      integerInt: 2,
      floatFloat: 5.5,
      integerFloat: 3,
    });

    expect(() => pick({
      string: number,
    }, obj)).to.throw;

    expect(() => pick({
      time: number,
    }, obj)).to.throw;

    expect(() => pick({
      trueish: number,
    }, obj)).to.throw;

    expect(() => pick({
      falseish: number,
    }, obj)).to.throw;

    expect(() => pick({
      emptyString: number,
    }, obj)).to.throw;
  });

  it('respects date', () => {
    let time = new Date();

    const obj = {
      string: 'String',
      emptyString: '',
      integer: 0,
      float: 25.5,
      time,
      trueish: true,
      falseish: false,
    };

    expect(pick({
      integer: date,
      float: date,
      time: date,
      trueish: date,
      falseish: date,
    }, obj)).to.deep.equal({
      integer: new Date(0),
      float: new Date(25.5),
      time,
      trueish: new Date(<any>true),
      falseish: new Date(<any>false),
    });

    expect(() => pick({
      string: date,
    }, obj)).to.throw;

    expect(() => pick({
      emptyString: date,
    }, obj)).to.throw;
  });

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

  it('respects nested objects', () => {
    const obj = {
      params: {
        id: '1',
      },
    };

    expect(pick({
      params: {id: integer},
    }, obj)).to.deep.equal({
      params: {id: 1},
    });
  });
});
