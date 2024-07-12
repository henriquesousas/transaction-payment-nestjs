import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerModel } from '../../core/customer/infrastructure/db/sequelize/customer.model';
import { WalletModel } from '../../core/customer/infrastructure/db/sequelize/wallet.model';
import { CUSTOMER_PROVIDERS } from './customer.provider';
import { DatabaseModule } from '../../../libs/common/src/nestjs/database/sequelize/database.module';
import { MyRabbitMQModule } from '../../../libs/common/src/nestjs/message-broker/my-rabbitmq.module';
import { CustomerCreatedInQueueHandler } from '../../core/customer/application/handler/customer-created-in-queue.handler';
import { IMessageBroker } from '../../../libs/common/src/core/message-broker/message-broker.interface';

@Module({
  imports: [
    DatabaseModule.forFeature([CustomerModel, WalletModel]),
    MyRabbitMQModule.forFeature(),
  ],
  controllers: [CustomerController],
  providers: [
    ...Object.values(CUSTOMER_PROVIDERS.REPOSITORIES),
    ...Object.values(CUSTOMER_PROVIDERS.USECASES),
    ...Object.values(CUSTOMER_PROVIDERS.HANDLERS),
    // {
    //   provide: CustomerCreatedInQueueHandler,
    //   useFactory: (messageBroker: IMessageBroker) => {
    //     return new CustomerCreatedInQueueHandler(messageBroker);
    //   },
    //   inject: ['IMessageBroker'],
    // },
  ],
})
export class CustomerModule {}
