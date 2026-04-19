import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppContextDataSource } from '../data/data-source';
import { DatabaseEntities } from '../data/db.entities';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../modules/contact/person/user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot(AppContextDataSource.options),
		TypeOrmModule.forFeature(Object.values(DatabaseEntities)),
		AuthModule,
		UserModule,
		// forwardRef(() => AddressModule)
	]
})
export class AppModule {}
