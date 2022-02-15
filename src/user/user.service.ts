import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ){

    }

    async all(): Promise<User[]> { // bikin function ini asynchronous, karena itu pada return harus dikasih await karena function tersebut bersifat synchronous
        return this.userRepository.find(); // find user 
    }

    async paginate(page: number = 1): Promise<any> {
        // take -> mau berapa data per-page 
        const take = 3;

        // total -> total jumlah user
        const [users, total] = await this.userRepository.findAndCount({
            take,
            // skip -> offset, jika kita ada di page 1, return zero. kalau lagi di page 2, kita add sebanyakan user yang ada 
            skip: (page - 1) * take // belum paham
        });

        return {
            //buat ngilangin password-nya saat nampilin
            data: users.map(user => {
                const {password, ...data} = user;

                return data;
            }),
            // meta -> untuk passing beberapa data
            meta: {
                total,
                page,
                last_page: Math.ceil(total / take)
            }
        }
    }

    async create(data): Promise<User> {
        return this.userRepository.save(data);
    }

    async findOne(condition): Promise<User> {
        return this.userRepository.findOne(condition);
    }

    async update(id: number, data): Promise<any> {
        return this.userRepository.update(id, data);
    } 

    async delete(id: number): Promise<any> {
        return this.userRepository.delete(id);
    }

}
