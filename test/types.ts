import {expect} from 'chai';
import {pick, pickRqr, string, boolean, number, integer, float, date, any} from '../index';
import {BadRequestError} from 'hata';

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

    expect(pick({
      string: number,
    }, obj)).to.deep.equal({string: null});

    expect(() => pickRqr({
      string: number,
    }, obj)).to.throw(BadRequestError);

    expect(pick({
      time: number,
    }, obj)).to.deep.equal({time: null});

    expect(() => pickRqr({
      time: number,
    }, obj)).to.throw(BadRequestError);

    expect(pick({
      trueish: number,
    }, obj)).to.deep.equal({trueish: null});

    expect(() => pickRqr({
      trueish: number,
    }, obj)).to.throw(BadRequestError);

    expect(pick({
      falseish: number,
    }, obj)).to.deep.equal({falseish: null});

    expect(() => pickRqr({
      falseish: number,
    }, obj)).to.throw(BadRequestError);

    expect(pick({
      emptyString: number,
    }, obj)).to.deep.equal({emptyString: null});

    expect(() => pickRqr({
      emptyString: number,
    }, obj)).to.throw(BadRequestError);

    expect(pick({
      emptyString: integer,
    }, obj)).to.deep.equal({emptyString: null});

    expect(() => pickRqr({
      emptyString: integer,
    }, obj)).to.throw(BadRequestError);

    expect(pick({
      emptyString: float,
    }, obj)).to.deep.equal({emptyString: null});

    expect(() => pickRqr({
      emptyString: float,
    }, obj)).to.throw(BadRequestError);
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

    expect(pick({
      string: date,
    }, obj)).to.deep.equal({string: null});

    expect(() => pickRqr({
      string: date,
    }, obj)).to.throw(BadRequestError);

    expect(pick({
      emptyString: date,
    }, obj)).to.deep.equal({emptyString: null});

    expect(() => pickRqr({
      emptyString: date,
    }, obj)).to.throw(BadRequestError);
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
        ids: ['1'],
      },
    };

    expect(pick({
      params: {ids: [integer]},
    }, obj)).to.deep.equal({
      params: {ids: [1]},
    });
  });

  it('respects any type', () => {
    const obj = {
      object: {
        id: '1',
      },
      number: 123,
      string: 'asd',
      array: [string],
      boolean: false,
    };

    expect(pick({
      object: any,
      number: any,
      string: any,
      array: any,
      boolean: any,
    }, obj)).to.deep.equal(obj); // no change
  });
});
