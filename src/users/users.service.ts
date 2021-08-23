import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDTO: CreateUserDto) {
    const checkUserExists = await this.usersRepository.findOne({
      email: createUserDTO.email,
    });

    if (checkUserExists) {
      throw new Error('Email já cadastrado!');
    }

    const user = this.usersRepository.create(createUserDTO);

    await this.usersRepository.save(user);

    return user;
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    return this.usersRepository.findOne(id);
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.find({
      email: Equal(email),
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByName(name: string) {
    const user = await this.usersRepository.find({
      name: Equal(name),
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
