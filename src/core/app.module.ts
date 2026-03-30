import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from 'src/modules/address/address.module';
import { CustomerModule } from 'src/modules/persons/customer/customer.module';
import { AppContextDataSource } from '../data/data-source';
import { DatabaseEntities } from '../data/db.entities';
import { AuthModule } from '../modules/auth/auth.module';
import { UserModule } from '../modules/persons/user/user.module';
import { TaskModule } from 'src/modules/task/task.module';
import { ProductModule } from "../modules/product/product.module";

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot(AppContextDataSource.options),
		TypeOrmModule.forFeature(Object.values(DatabaseEntities)),
		AuthModule,
		UserModule,
		CustomerModule,
		forwardRef(() => AddressModule),
		TaskModule,
    ProductModule
	]
})
export class AppModule {}
