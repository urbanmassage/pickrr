import {expect} from 'chai';
import {pick2, pick2r, string, number} from '../index';

describe('pickrr#pick2', () => {
  it('works', () => {
    expect(pick2({
      req: string,
    }, {
      opt: number,
    }, {
      req: 'a',
      opt: 1,
    })).to.deep.equal({
      req: 'a',
      opt: 1,
    });
  });

  it('works curried', () => {
    expect(pick2r({
      req: string,
    }, {
      opt: number,
    })({
      req: 'a',
      opt: 1,
    })).to.deep.equal({
      req: 'a',
      opt: 1,
    });
  });

  it('ignores optional', () => {
    expect(pick2({
      req: string,
    }, {
      opt: number,
    }, {
      req: 'a',
    })).to.deep.equal({
      req: 'a',
    });
  });

  it('throws for required', () => {
    expect(() => pick2({
      req: string,
    }, {
      opt: number,
    }, {
      opt: number,
    })).to.throw;
  });
});
