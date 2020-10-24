import { GovForm } from './gov-form';

function setFetchMock() {
  const fetchMock = jest.fn().mockImplementation(v => {
    if (v === 'https://us-west4-arsus-production.cloudfunctions.net/curp?curp=B&apiKey=') {
      return Promise.resolve({
        ok: false,
        json: jest.fn().mockImplementation(() => Promise.reject({
          error: 'Not API Key'
        }))
      });
    }
    return Promise.resolve({
      ok: true,
      json: jest.fn().mockImplementation(() => Promise.resolve({
        curp: 'B'
      }))
    });
  });
  Object.defineProperty(global, 'fetch', {
    value: fetchMock,
    writable: true
  });
}

describe('gov-form', () => {
  it.only('should request', () => {
    setFetchMock();
    const temp = new GovForm();
    temp.completed = {
      emit: (event) => expect(event).toStrictEqual({
        curp: 'B'
      }) as any
    }
    temp.apikey = 'A';
    temp.type = 'curp';
    temp.curp = 'B';
    temp.handleSubmit({
      preventDefault: () => { }
    });
  })
});
