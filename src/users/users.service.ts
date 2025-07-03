import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>
  ){
    this.repo = repo
  }

  create(email: string, password: string){
    const user = this.repo.create({email, password})
    return this.repo.save(user)
  }

  async findOneById(id: number){

    const user = await this.repo.findOneBy({id})
    if (!user) {
      throw new NotFoundException('user not found')
    }
    return user
  }

  async find(email: string ){
    const user = await this.repo.find({where: {email}})
    if (!user) {
      throw new NotFoundException('user not found')
    }
    return user
  }  

  async update(id: number, attributes: Partial<User>){
    const user = await this.repo.findOneBy({id})
    if (!user) {
      throw new NotFoundException('user not found')
    }
    Object.assign(user, attributes)
    return this.repo.save(user)
  }

  async remove(id: number){
    const user = await this.repo.findOneBy({id})
    if (!user) {
      throw new NotFoundException('user not found')
    }
    return this.repo.remove(user)
  }

}
