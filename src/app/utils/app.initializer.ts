import { catchError, finalize, of } from 'rxjs';
import { AuthApiService } from '../api/auth.service';

export function appInitializer(authenticationService: AuthApiService) {
    return () => authenticationService.refreshToken()
        .pipe(
            // catch error to start app on success or failure
            catchError(() => of())
        );
}
