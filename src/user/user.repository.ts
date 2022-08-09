import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';

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

  async findOne(
    id: string,
    transactionalEntityManager: EntityManager,
  ): Promise<User> {
    const userRepository = transactionalEntityManager.getRepository(User);
    const user = await userRepository.findOne({ where: { id: id } });
    return user;
  }

  async findUseremail(
    email: string,
    transactionalEntityManager: EntityManager,
  ): Promise<User> {
    const userRepository = transactionalEntityManager.getRepository(User);
    const userEmail = await userRepository.findOne({ where: { email: email } });
    return userEmail;
  }

  async updateUser(
    param,
    updateUserDto: UpdateUserDto,
    transactionalEntityManager: EntityManager,
  ): Promise<User> {
    const userRepository = transactionalEntityManager.getRepository(User);
    const userUpdate = await userRepository.findOne({
      where: { id: param.userId },
    });

    if (
      !updateUserDto.username &&
      !updateUserDto.email &&
      !updateUserDto.password
    ) {
      throw new HttpException(
        '최소 하나의 값이 필요합니다',
        HttpStatus.FORBIDDEN,
      );
    }

    userUpdate.username = updateUserDto.username;
    userUpdate.email = updateUserDto.email;
    userUpdate.password = updateUserDto.password;

    return userRepository.save(userUpdate);
  }

  async deleteUser(
    userId: string,
    transactionalEntityManager: EntityManager,
  ): Promise<void> {
    const userRepository = transactionalEntityManager.getRepository(User);
    await userRepository.delete(userId);
  }
}
