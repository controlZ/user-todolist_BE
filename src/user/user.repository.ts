import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository {
  async createUser(
    createUserDto: CreateUserDto,
    transactionalEntityManager: EntityManager,
  ): Promise<void> {
    const userRepository = transactionalEntityManager.getRepository(User);
    await userRepository.save(createUserDto);
  }

  async findAllUser(
    transactionalEntityManager: EntityManager,
  ): Promise<User[]> {
    const userRepository = transactionalEntityManager.getRepository(User);
    const Userlist = await userRepository.find();
    return Userlist;
  }

  async findUserWithId(
    id: string,
    transactionalEntityManager: EntityManager,
  ): Promise<User> {
    const userRepository = transactionalEntityManager.getRepository(User);
    const user = await userRepository.findOne({ where: { id: id } });
    return user;
  }

  async findUserWithEmail(
    email: string,
    transactionalEntityManager: EntityManager,
  ): Promise<User> {
    const userRepository = transactionalEntityManager.getRepository(User);
    const userEmail = await userRepository.findOne({ where: { email: email } });
    return userEmail;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
    transactionalEntityManager: EntityManager,
  ): Promise<User> {
    const userRepository = transactionalEntityManager.getRepository(User);
    const userUpdate = await userRepository.findOne({
      where: { id: userId },
    });

    if (
      !updateUserDto.username &&
      !updateUserDto.email &&
      !updateUserDto.password
    ) {
      throw new HttpException(
        '최소 하나의 값이 필요합니다',
        HttpStatus.BAD_REQUEST,
      );
    }

    userUpdate.username = updateUserDto.username;
    userUpdate.email = updateUserDto.email;
    userUpdate.password = await bcrypt.hash(updateUserDto.password, 10);

    return userRepository.save(userUpdate);
  }

  async deleteUser(
    userId: string,
    transactionalEntityManager: EntityManager,
  ): Promise<void> {
    const userRepository = transactionalEntityManager.getRepository(User);
    await userRepository.delete(userId);
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    id: string,
    transactionalEntityManager: EntityManager,
  ) {
    const userRepository = transactionalEntityManager.getRepository(User);
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await userRepository.update(id, { currentHashedRefreshToken });
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    id: string,
    transactionalEntityManager: EntityManager,
  ) {
    const userRepository = transactionalEntityManager.getRepository(User);
    const user = await userRepository.findOne({ where: { id: id } });

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(
    id: string,
    transactionalEntityManager: EntityManager,
  ) {
    const userRepository = transactionalEntityManager.getRepository(User);
    return userRepository.update(id, { currentHashedRefreshToken: null });
  }
}
