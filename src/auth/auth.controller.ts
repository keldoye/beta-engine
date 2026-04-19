import { Body, Controller, Post, Get, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthConstants as Constants } from './auth.constants';
import { SignInDTO } from './auth.dtos';
import { Public } from './auth.decorator';

@ApiBearerAuth(Constants.ACCESS_TOKEN_TYPE)
@Controller(Constants.AUTH_PREFIX)
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@Post()
	signIn(@Body() signInDto: SignInDTO) {
		return this.authService.signIn(signInDto);
	}

	@Get(Constants.PROFILE)
	getProfile(@Request() request) {
		return request.user;
	}
}
