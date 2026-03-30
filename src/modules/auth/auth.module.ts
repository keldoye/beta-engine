import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../persons/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthConstants as C } from './auth.constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
	imports: [
		UserModule,
		JwtModule.register({
			global: true,
			secret: C.JWT_SECRET,
			signOptions: { expiresIn: C.TOKEN_TIMEOUT }
		})
	],
	controllers: [AuthController],
	providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
	exports: [AuthService]
})
export class AuthModule {}
