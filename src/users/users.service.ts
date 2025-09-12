import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {
    this.repo = repo;
  }

  async create(email: string, password: string, admin: boolean) {
    const user = this.repo.create({ email, password, admin });
    const savedUser = await this.repo.save(user);
    return savedUser;
  }

  async findOneById(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException('id is required');
    }

    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async find(email: string) {
    const user = await this.repo.find({ where: { email } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async findAll() {
    return this.repo.find();
  }

  async update(id: number, attributes: Partial<User>) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attributes);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['reports'],
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (user.reports.length > 0) {
      throw new BadRequestException(
        'User has reports associated with their account. Please delete all reports before deleting the user.',
      );
    }

    return await this.repo.remove(user);
  }
}
