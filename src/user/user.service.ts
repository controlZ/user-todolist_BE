import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
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
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
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

  async findUserWithId(id: string): Promise<User> {
    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        return await this.userRepository.findUserWithId(
          id,
          transactionalEntityManager,
        );
      },
    );
  }

  async findUserWithEmail(email: string): Promise<User> {
    return await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        return await this.userRepository.findUserWithEmail(
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
  async getUserIfRefreshTokenMatches(refreshToken: string, id: string) {
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        await this.userRepository.getUserIfRefreshTokenMatches(
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
