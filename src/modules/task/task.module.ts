import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { TaskController } from "./task.controller";
import { CustomerModule } from "../persons/customer/customer.module";

@Module({
  providers: [TaskService],
  exports: [TaskService],
  imports: [TypeOrmModule.forFeature([Task]), CustomerModule],
  controllers: [TaskController],
})
export class TaskModule {}
