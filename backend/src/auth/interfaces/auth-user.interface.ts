import { UserEntity, UserRole } from '../../database/entities/user.entity';

export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  branchId: string;
}

export const mapUserEntityToAuthUser = (user: UserEntity): AuthenticatedUser => ({
  id: user.id,
  email: user.email,
  displayName: user.displayName,
  role: user.role,
  branchId: user.branch.id,
});
