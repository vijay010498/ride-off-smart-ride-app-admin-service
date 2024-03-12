import { Test, TestingModule } from '@nestjs/testing';
import { AdminuserController } from './adminuser.controller';

describe('AdminuserController', () => {
  let controller: AdminuserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminuserController],
    }).compile();

    controller = module.get<AdminuserController>(AdminuserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
