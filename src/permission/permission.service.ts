import { Get, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission) private readonly permisionRepository: Repository<Permission>
    ) {

    }

    async all(): Promise<Permission[]> {
        return this.permisionRepository.find();
    }
}
