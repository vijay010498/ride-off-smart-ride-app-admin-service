import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { TokenService } from './token.service';
import { CurrentUserInterceptor } from 'src/common/interceptors/current-user.interceptor';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { IsBlockedGuard } from 'src/common/guards/isBlocked.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserTokens } from 'src/common/decorators/user-token.decorator';
import { UserTokensDto } from 'src/common/dtos/User-tokens.dto';

@Controller('token')
@UseInterceptors(CurrentUserInterceptor)
@UseGuards(RefreshTokenGuard, IsBlockedGuard)
export class TokenController {
    constructor(private readonly tokenService : TokenService){}

    refreshToken(
        @CurrentUser() user:any,
        @UserTokens() tokens: Partial<UserTokensDto>)
    {
        return this.tokenService.refreshTokens(user, tokens.requestRefreshToken)
    }
}
