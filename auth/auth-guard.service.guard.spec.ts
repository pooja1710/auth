import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard.ServiceGuard } from './auth-guard.service.guard';

describe('AuthGuard.ServiceGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard.ServiceGuard] 
    });
  });

  it('should ...', inject([AuthGuard.ServiceGuard], (guard: AuthGuard.ServiceGuard) => {
    expect(guard).toBeTruthy();
  }));
});
