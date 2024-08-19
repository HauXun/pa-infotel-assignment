export class CreateUserDto {
  email: string;
  password: string;
  googleId?: string;
  refreshToken: string;
}
