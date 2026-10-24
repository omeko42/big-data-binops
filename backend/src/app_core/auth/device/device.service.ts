import { Injectable, Query, Req } from '@nestjs/common';
import { CreateDeviceDto } from '@app_core/auth/device/dto/create-device.dto';
import { UpdateDeviceDto } from '@app_core/auth/device/dto/update-device.dto';
import { DataSource, Repository } from 'typeorm';
import { Device } from '@app_core/auth/device/entities/device.entity';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DeviceService {
    private readonly deviceRepository: Repository<Device>;
    private readonly response: any;
    private readonly tableHelper: any;
    constructor(private readonly dataSource: DataSource) {
        this.deviceRepository = this.dataSource.getRepository(Device);
        this.tableHelper = new TableHelperService();
    }

    async create(userId: number, deviceName: string, deviceVendor: string, deviceOs: string, browser: string): Promise<Device> {
        const deviceToken = uuidv4();
        const requestToken = uuidv4();
        const device = this.deviceRepository.create({
            device_name: deviceName,
            device_os: deviceOs, // Generate or fetch the device token as needed
            device_browser: browser, // Generate or fetch the device token as needed
            device_vendor: deviceVendor,
            device_token: deviceToken,
            request_token: requestToken,
            refresh_token: requestToken,
            last_token_change: new Date(Date.now()),
            refresh_token_expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            user: { id: userId } // Ensure User entity exists
        });
        return this.deviceRepository.save(device);
    }

    async findAll(request: any) {
        try {
            const queryBuilder = this.deviceRepository.createQueryBuilder('device');
            queryBuilder.leftJoinAndSelect('device.user', 'user');
            const user = request['user'];
            queryBuilder.where('user.id = :userId', { userId: user.id });
            const result = await this.tableHelper.applyFilters(queryBuilder, request, {
                coreTable: 'device',
                searchingAll: ['device_name', 'device_token'],
                searching: ['device_name', 'device_token'],
                searchingOption: ['device_name', 'device_token'],
                searchingOrWhere: ['device_name', 'device_token'],
                searchingBeetween: ['created_at'],
                yearMonthFilter: ['created_at'],
                sorting: ['id', 'user.id']
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    findOne(id: number) {
        return `This action returns a #${id} device`;
    }

    async ReNewRefreshToken(refresh_token: string) {
        const data = await this.deviceRepository.findOneOrFail({
            where: { refresh_token: refresh_token },
            relations: ['user'] // join dengan relasi user
        });
        const { password, ...userWithoutPassword } = data.user;
        const payload = {
            id: data.user.id,
            username: data.user.name,
            device_id: data.id,
            device_token: data.device_token,
            user: userWithoutPassword
        };
        if (data.refresh_token_expired_at <= new Date()) {
            throw new Error('Refresh token has expired');
        }

        const newRefreshToken = uuidv4();
        const newExpiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +7 hari

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.update(
                this.deviceRepository.target, // Entity target (bisa DeviceEntity)
                { id: data.id }, // Kondisi WHERE
                {
                    refresh_token: newRefreshToken,
                    refresh_token_expired_at: newExpiryDate
                } // Data yang diupdate
            );
            await queryRunner.commitTransaction();
            data.refresh_token = newRefreshToken;
            data.refresh_token_expired_at = newExpiryDate;
            return { data, payload };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    update(id: number, updateDeviceDto: UpdateDeviceDto) {
        return `This action updates a #${id} device`;
    }

    async remove(id: number) {
        const data = await this.deviceRepository.findOneBy({
            id: id
        });
        return await this.deviceRepository.remove(data);
    }
}
