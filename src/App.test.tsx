import { isProduction } from './utils/env';

test('test environment is not production', () => {
  expect(isProduction()).toBe(false);
});
