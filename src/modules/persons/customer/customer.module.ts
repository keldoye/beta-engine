import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from 'src/modules/address/address.module';
import { ResourceOwnerGuard } from '../../../common/guards/resource/resource-owner.guard';
import { RolesGuard } from '../../../common/guards/roles/roles.guard';
import { CustomerController } from './customer.controller';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Customer]),
		forwardRef(() => AddressModule)
	],
	controllers: [CustomerController],
	providers: [CustomerService, RolesGuard, ResourceOwnerGuard],
	exports: [CustomerService]
})
export class CustomerModule {}
