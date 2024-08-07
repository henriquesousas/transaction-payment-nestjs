import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';

import { WalletModel } from '../../core/customer/infrastructure/db/sequelize/models/wallet.model';
import { CUSTOMER_PROVIDERS } from './customer.provider';
import { DatabaseModule } from '../../../libs/common/src/nestjs/database/sequelize/database.module';
import { MyRabbitMQModule } from '../../../libs/common/src/nestjs/message-broker/rabbitmq/my-rabbitmq.module';
import { CustomerConsumer } from './customer.consumer';
import { CustomerModel } from '../../core/customer/infrastructure/db/sequelize/models/customer.model';

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
    {
      provide: 'CustomerConsumer',
      useClass: CustomerConsumer,
    },
  ],
})
export class CustomerModule {}
