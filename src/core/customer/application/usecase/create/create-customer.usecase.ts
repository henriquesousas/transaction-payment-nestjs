import { UseCase } from '@app/common/core/application/usecase/usecase';
import { CreateCustomerDto } from './create-customer.dto';
import { Either } from '@app/common/core/types/either';
import { CustomerRepository } from 'src/core/customer/domain/customer.repository';
import { CustomerAlreadyExistException } from 'src/core/customer/domain/exception/customer-already-exist.exception';
import { Customer } from '../../../domain/entity/customer';
import { CustomerBuilder } from '../../../domain/customer.builder';

import { EntityValidationException } from '../../../../../../libs/common/src/core/domain/exception/entity-validation.exception';
import { ApplicationService } from '../../../../../../libs/common/src/core/application/application.service';

export type CustomerOutputDto = Either<Customer>;

export class CreateCustomerUseCase
  implements UseCase<CreateCustomerDto, CustomerOutputDto>
{
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(dto: CreateCustomerDto): Promise<CustomerOutputDto> {
    let customer = new CustomerBuilder(dto).withBalance(dto.balance).build();

    if (customer.notification.hasErrors()) {
      const error = new EntityValidationException(
        customer.notification.toArray(),
      );
      return Either.fail(error);
    }

    const customerFromDb = await this.customerRepository.findByEmail(dto.email);
    if (customerFromDb) {
      return Either.fail(new CustomerAlreadyExistException());
    }

    await this.applicationService.run(async () => {
      return this.customerRepository.insert(customer);
    });

    return Either.ok(customer);
  }
}
