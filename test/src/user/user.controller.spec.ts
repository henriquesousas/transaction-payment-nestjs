import { BadRequestException } from '@nestjs/common';
import { CreateUserUseCaseStub } from './mocks/create-user-usecase.stub';
import { CreateUserDto } from '../../../src/user/domain/dtos/create-user.dto';
import { DocumentType } from '../../../src/customer/domain/enum/DocumentType';
import { CustomerController } from '../../../src/user/controllers/CustomerController';

const makeDto = (
  documentType: DocumentType = DocumentType.CPF,
): CreateUserDto => {
  return {
    firstName: 'any_name',
    secondName: 'any_second_name',
    amount: 1,
    document: 'any_document',
    documentType,
    email: 'any_email',
    password: 'any_password',
  };
};

describe('UserController', () => {
  it('should create a new user', async () => {
    const useCase = new CreateUserUseCaseStub();
    const sut = new CustomerController(useCase);
    const userModel = await sut.create(makeDto());
    expect(userModel).toBeTruthy();
    expect(userModel.firstName).toEqual(userModel.firstName);
    expect(userModel.secondName).toEqual(userModel.secondName);
    expect(userModel.email).toEqual(userModel.email);
    expect(userModel.amount).toEqual(userModel.amount);
  });

  it('should retutn an error if usecase fails', async () => {
    const useCase = new CreateUserUseCaseStub();
    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => {
      return Promise.resolve(new BadRequestException('any_error'));
    });
    const sut = new CustomerController(useCase);
    const data = sut.create(makeDto());
    expect(data).rejects.toThrow(BadRequestException);
  });

  it('should call usecase with correct values', async () => {
    const useCase = new CreateUserUseCaseStub();
    const usecaseSpy = jest.spyOn(useCase, 'execute');
    const sut = new CustomerController(useCase);
    const dto = makeDto();
    await sut.create(dto);
    expect(usecaseSpy).toHaveBeenCalledWith(dto);
  });
});
