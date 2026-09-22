import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class DateService {
    async parseDate(dmyDate: string): Promise<string> {
        if (typeof dmyDate !== 'string' || !dmyDate.trim()) {
            // throw new BadRequestException('Date input must be a non-empty string.');
            return null;
        }

        // Split the input date string
        const parts = dmyDate.split('-');
        if (parts.length !== 3) {
            return null;

            // throw new BadRequestException('Invalid date format. Expected format is d-m-Y.');
        }

        const [dayStr, monthStr, yearStr] = parts.map(part => part.trim());
        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10) - 1; // JavaScript months are zero-based
        const year = parseInt(yearStr, 10);

        // Check if any of the parsed parts are NaN or invalid
        if (isNaN(day) || isNaN(month) || isNaN(year) || month < 0 || month > 11 || day < 1 || day > this.getDaysInMonth(month + 1, year)) {
            return null;

            // throw new BadRequestException('Invalid date values.');
        }

        // Create a Date object
        const parsedTanggal = new Date(year, month, day);

        // Validate the Date object
        if (parsedTanggal.getDate() !== day || parsedTanggal.getMonth() !== month || parsedTanggal.getFullYear() !== year) {
            return null;

            // throw new BadRequestException('Invalid date.');
        }

        const formattedTanggal = parsedTanggal.toISOString().split('T')[0];

        return formattedTanggal;
    }

    async parseDate2(isoDate: string): Promise<string> {
        if (typeof isoDate !== 'string' || !isoDate.trim()) {
            return null;
        }

        const parsedDate = new Date(isoDate);

        // Cek apakah Date valid
        if (isNaN(parsedDate.getTime())) {
            return null;
        }

        // Format menjadi YYYY-MM-DD
        const formattedDate = parsedDate.toISOString().split('T')[0];

        return formattedDate;
    }

    private getDaysInMonth(month: number, year: number): number {
        // Using month as 1-based (1 for January, 2 for February, etc.)
        return new Date(year, month, 0).getDate();
    }
}
