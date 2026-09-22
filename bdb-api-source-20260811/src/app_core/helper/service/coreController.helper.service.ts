import { Controller, SetMetadata, UseGuards, UseInterceptors, UsePipes, applyDecorators } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CustomValidationPipe } from '@app_core/helper/service/pipe.helper.service';
import { Action, ControllerTag, Group, Menu, Parent, RouteName } from '@app_core/auth/route/route-name.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUserInterceptor } from '../interceptor/current-user.interceptor';

export function CoreController(tag: string, path: string) {
    return applyDecorators(
        ApiTags(tag),
        ControllerTag(tag), // Assuming ControllerTag is a valid decorator
        ApiBearerAuth('access-token'),
        UseGuards(AuthGuard),
        UsePipes(new CustomValidationPipe()),
        Controller(path),
        // UseInterceptors(FileInterceptor('file'))
    );
}

interface AuthRouteData {
  name: string;
  parent: string;
}

// 10 MB -- sebelumnya FileInterceptor('file') di bawah TANPA limits (unlimited), risiko resource
// exhaustion krn decorator ini otomatis kepasang di SETIAP route yg pakai @Route (bukan cuma yg
// benar2 terima file). Nilai sama dgn IMPORT_FILE_LIMITS yg dipakai terpisah di beberapa controller.
const DEFAULT_FILE_LIMITS = { limits: { fileSize: 10 * 1024 * 1024 } };

export function Route(data: AuthRouteData): MethodDecorator {
  const name = data.name.split('.');
  return applyDecorators(
    Group(name[0]),
    Menu(name[1]),
    Action(name[2]),
    RouteName(data.name),
    Parent(data.parent),
    // PENTING: JANGAN tambah @UseInterceptors(FileInterceptor('file', ...)) lagi di method yg
    // pakai @Route ini -- decorator NestJS bertumpuk (tak saling override), jadi 2 FileInterceptor
    // akan sama2 coba baca stream request multipart yg SAMA. Stream cuma bisa dibaca sekali; yg
    // kedua akan lihat body terpotong & gagal dgn "Multipart: Unexpected end of form" (bug nyata
    // yg ditemukan di bulkImportPreview user & jenis-kejahatan -- FileInterceptor eksplisit di
    // method-nya dobel sama yg di sini, sudah dihapus dari kedua tempat itu).
    UseInterceptors(FileInterceptor('file', DEFAULT_FILE_LIMITS)),
    ApiOperation({ summary: data.name}),
    UseInterceptors(CurrentUserInterceptor),
  );
}
