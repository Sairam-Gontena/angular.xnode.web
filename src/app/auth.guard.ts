import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthApiService } from './api/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  let activate = false;
  let router = inject(Router);
  const auth = inject(AuthApiService);
  if (auth.userLoggedIn || auth.otpVerifyInprogress || auth.restInprogress) {
    activate = true;
  } else
    if (!auth.isUserLoggedIn()) {
      router.navigate(['login'])
      activate = false
    }
  return activate
};
