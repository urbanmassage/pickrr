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
  
  it('works with nested objects', () => {
    expect(pick2({
      options: {
        prop1: string,
      },
    }, {
      options: {
        prop2: string,
      },
    }, {
      options: {
        prop1: '1',
        prop2: '2',
      },
    })).to.deep.equal({
      options: {
        prop1: '1',
        prop2: '2',
      },
    });
    
    expect(pick2({
      options: {
        options: {
          prop1: string,
        },
      },
    }, {
      options: {
        options: {
          prop2: string,
        },
      },
    }, {
      options: {
        options: {
          prop1: '1',
          prop2: '2',
        },
      },
    })).to.deep.equal({
      options: {
        options: {
          prop1: '1',
          prop2: '2',
        },
      },
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
