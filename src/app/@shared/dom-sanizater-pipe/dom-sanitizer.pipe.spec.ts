import { DomSanitizerPipe } from './dom-sanitizer.pipe';

describe('DomSanitizerPipe', () => {
  it('create an instance', () => {
    const pipe = new DomSanitizerPipe(null);
    expect(pipe).toBeTruthy();
  });
});
