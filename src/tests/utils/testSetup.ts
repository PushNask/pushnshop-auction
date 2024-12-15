import '@testing-library/jest-dom';

// Define global jest object since we're not importing from @jest/globals
declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jest: any;
}