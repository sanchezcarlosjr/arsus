import { newE2EPage } from '@stencil/core/testing';

describe('gov-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<gov-form></gov-form>');

    const element = await page.find('gov-form');
    expect(element).toHaveClass('hydrated');
  });
});
