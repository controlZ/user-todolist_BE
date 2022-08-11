import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const salt = await bcrypt.genSalt(10);
        createUserDto.password = await bcrypt.hash(
          createUserDto.password,
          salt,
        );
        await this.userRepository.createUser(
          createUserDto,
          transactionalEntityManager,
        );
      },
    );
  }

  async findAllUser(): Promise<User[]> {
    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        return await this.userRepository.findAllUser(
          transactionalEntityManager,
        );
      },
    );
  }

  async findOne(id: string): Promise<User> {
    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        return await this.userRepository.findOne(
          id,
          transactionalEntityManager,
        );
      },
    );
  }

  async findUseremail(email: string): Promise<User> {
    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        return await this.userRepository.findUseremail(
          email,
          transactionalEntityManager,
        );
      },
    );
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const salt = await bcrypt.genSalt(10);
        updateUserDto.password = await bcrypt.hash(
          updateUserDto.password,
          salt,
        );
        return await this.userRepository.updateUser(
          userId,
          updateUserDto,
          transactionalEntityManager,
        );
      },
    );
  }

  async deleteUser(userId: string): Promise<void> {
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        await this.userRepository.deleteUser(
          userId,
          transactionalEntityManager,
        );
      },
    );
  }

  async setCurrentRefreshToken(refreshToken: string, id: string) {
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        await this.userRepository.setCurrentRefreshToken(
          refreshToken,
          id,
          transactionalEntityManager,
        );
      },
    );
  }

  async removeRefreshToken(id: string) {
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        await this.userRepository.removeRefreshToken(
          id,
          transactionalEntityManager,
        );
      },
    );
  }
}
