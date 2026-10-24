import { Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '@app_core/auth/user/entities/user.entity';

@Injectable()
export class Auth {
    private readonly userRepository: Repository<User>;
    constructor(private readonly dataSource: DataSource) {
        this.userRepository = this.dataSource.getRepository(User);
    }
    async user(@Req() request: Request, relation: any): Promise<User | null> {
        const user = request['user'] as User;
        if (!user || !user.id) {
            throw new NotFoundException('User not found in request');
        }
        const foundUser = await this.userRepository.findOne({
            where: { id: user.id },
            relations: relation
        });
        if (!foundUser) {
            throw new NotFoundException('User not found in database');
        }
        return foundUser;
    }
}
