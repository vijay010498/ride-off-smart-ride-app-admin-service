import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserTokens = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return {
      accessToken: request.user?.accessToken,
      requestRefreshToken: request.user?.refreshToken,
    };
  },
);
