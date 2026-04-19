import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../modules/contact/person/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthConstants as Constants } from './auth.constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
	imports: [
		UserModule,
		JwtModule.register({
			global: true,
			secret: Constants.JWT_SECRET,
			signOptions: { expiresIn: Constants.TOKEN_TIMEOUT }
		})
	],
	controllers: [AuthController],
	providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
	exports: [AuthService]
})
export class AuthModule {}
