import { RequestStatusPipe } from './request-status-pipe';

describe('RequestStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new RequestStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
