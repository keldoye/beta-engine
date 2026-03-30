import { Body, Controller, Post, Get, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthConstants as C } from './auth.constants';
import { SignInDTO } from './auth.dtos';
import { Public } from './auth.decorator';

@ApiBearerAuth(C.ACCESS_TOKEN_TYPE)
@Controller(C.AUTH_PREFIX)
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@Post()
	signIn(@Body() signInDto: SignInDTO) {
		return this.authService.signIn(signInDto);
	}

	@Get(C.PROFILE)
	getProfile(@Request() request) {
		return request.user;
	}
}
