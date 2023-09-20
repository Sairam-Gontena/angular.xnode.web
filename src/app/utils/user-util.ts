export interface User {
  firstName?: string;
  lastName?: string;
  password: string;
  email: string;
  id?: number;
  role?: string;
  user_id?: string;
}

export class UserUtil {
  private static currentUser: User | undefined;

  static getCurrentUser(): User | undefined {
    const storedCurrentUser = localStorage.getItem('currentUser');
    UserUtil.currentUser = storedCurrentUser ? JSON.parse(storedCurrentUser) : undefined;

    return UserUtil.currentUser;
  }
}