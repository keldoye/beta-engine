import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from './address.service';
import { Address } from './address.entity';
import { AddressController } from './address.controller';
import { CustomerModule } from '../persons/customer/customer.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Address]),
		forwardRef(() => CustomerModule)
	],
	controllers: [AddressController],
	providers: [AddressService],
	exports: [AddressService]
})
export class AddressModule {}
