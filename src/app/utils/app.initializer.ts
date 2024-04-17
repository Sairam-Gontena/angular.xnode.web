import { catchError, finalize, of } from 'rxjs';
import { AuthApiService } from '../api/auth.service';
import { LocalStorageService } from '../components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

export function appInitializer(storageService: LocalStorageService,authenticationService: AuthApiService) {
    return () => {
      let currentUser:any = storageService.getItem(StorageKeys.CurrentUser);
      if(!authenticationService.userValue && currentUser) {
        currentUser.accessToken= storageService.getItem(StorageKeys.ACCESS_TOKEN);
        currentUser.refreshToken= storageService.getItem(StorageKeys.REFRESH_TOKEN);
        authenticationService.userSubject.next(currentUser)
        authenticationService.setIsLoggedIn(true)
        authenticationService.startRefreshTokenTimer();
      }
      if(!currentUser) {
        return new Promise<void>((resolve, reject) => {
          return resolve();
        });
      }
      return authenticationService.refreshToken()
      .pipe(
        // catch error to start app on success or failure
        catchError(() => of())
        );
      }
}
