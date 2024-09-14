import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.model';
import { AuthResponse } from './auth-response.model';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => User)
  async register(@Args('email') email: string, @Args('password') password: string): Promise<User> {
    return this.userService.register(email, password);
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<AuthResponse> {
    return this.userService.login(email, password);
  }

  @Mutation(() => AuthResponse)
  async biometricLogin(@Args('biometricKey') biometricKey: string): Promise<AuthResponse> {
    return this.userService.biometricLogin(biometricKey);
  }

  @Mutation(() => User)
  async setBiometricKey(
    @Args('userId') userId: number,
    @Args('biometricKey') biometricKey: string
  ): Promise<User> {
    return this.userService.setBiometricKey(userId, biometricKey);
  }

  @Query(() => String)
  hello(): string {
    return 'Hello, GraphQL!';
  }
}
