import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export function roleGuard(expectedRoles: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();

    if (user && expectedRoles.includes(user.role)) {
      return true;
    }

    if (authService.getToken()) {
      return authService.loadCurrentUser().pipe(
        map(({ user: refreshedUser }) => expectedRoles.includes(refreshedUser.role) ? true : router.createUrlTree(['/'])),
        catchError(() => of(router.createUrlTree(['/'])))
      );
    }

    return router.createUrlTree(['/']);
  };
}
