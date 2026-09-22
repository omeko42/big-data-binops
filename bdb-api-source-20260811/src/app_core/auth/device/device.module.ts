import { Module } from '@nestjs/common';
import { DeviceService } from '@app_core/auth/device/device.service';

@Module({
    controllers: [],
    providers: [DeviceService],
    exports: [DeviceService]
})
export class DeviceModule {}
