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
      string: number,
      emptyString: number,
      time: number,
      trueish: number,
      falseish: number,

      integer: number,
      float: number,

      floatInt: integer,
      integerInt: integer,
      floatFloat: float,
      integerFloat: float,
    }, obj)).to.deep.equal({
      string: NaN,
      emptyString: NaN,
      time: NaN,
      trueish: NaN,
      falseish: NaN,

      integer: 0,
      float: 25.5,

      floatInt: 1,
      integerInt: 2,
      floatFloat: 5.5,
      integerFloat: 3,
    });
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
      string: date,
      emptyString: date,
      integer: date,
      float: date,
      time: date,
      trueish: date,
      falseish: date,
    }, obj)).to.deep.equal({
      string: new Date('String'),
      emptyString: new Date(''),
      integer: new Date(0),
      float: new Date(25.5),
      time,
      trueish: new Date(<any>true),
      falseish: new Date(<any>false),
    });
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
});
