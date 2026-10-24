import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class ApplyFiltersDto {
    @ApiPropertyOptional({
        type: [String],
        description: 'Tables to join in the query.'
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    join?: string[];

    // --------------
    @ApiPropertyOptional({
        type: String,
        description: 'General search term to be applied across multiple fields.'
    })
    @IsOptional()
    @IsString()
    searchAll?: string;

    // --------------
    @ApiPropertyOptional({
        type: [String],
        description: 'Fields and search terms for partial matches.'
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    searchBy?: string[];

    @ApiPropertyOptional({
        type: [String],
        description: 'Search terms for partial matches.'
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    search?: string[];

    // --------------
    @ApiPropertyOptional({
        type: [String],
        description: 'Fields and values for exact matches.'
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    searchOptionBy?: string[];

    @ApiPropertyOptional({
        type: [String],
        description: 'Values for exact matches.'
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    searchOption?: string[];

    // --------------
    @ApiPropertyOptional({
        type: [String],
        description: 'Fields and values for `OR` conditions.'
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    searchOrWhereBy?: string[];

    @ApiPropertyOptional({
        type: [String],
        description: 'Values for `OR` conditions.'
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    searchOrwhere?: string[];

    // --------------
    @ApiPropertyOptional({
        type: [String],
        description: 'Fields to search with a range.'
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    searchBeetwen?: string[];

    @ApiPropertyOptional({
        type: [String],
        description: 'Start values for range searches.'
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    searchBeetwenStart?: string[];

    @ApiPropertyOptional({
        type: [String],
        description: 'End values for range searches.'
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    searchBeetwenEnd?: string[];

    // --------------
    @ApiPropertyOptional({ type: [String], description: 'Year-Month filters.' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    yearMonthFilter?: string[];

    @ApiPropertyOptional({
        type: [String],
        description: 'Years for filtering by year.'
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    year?: string[];

    @ApiPropertyOptional({
        type: [String],
        description: 'Months for filtering by month.'
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    month?: string[];

    @ApiPropertyOptional({
        type: [String],
        description: 'Fields and directions for sorting.'
    })
    @IsOptional()
    sortBy?: string | string[];

    @ApiPropertyOptional({
        type: [String],
        description: 'Sorting directions (e.g., ASC, DESC).'
    })
    @IsOptional()
    sort?: string | string[];

    @ApiPropertyOptional({ description: 'Number of items per page.' })
    @IsOptional()
    // @IsNumber()
    row?: number;

    @ApiPropertyOptional({ description: 'Current page number.' })
    @IsOptional()
    // @IsNumber()
    page?: number;

    @ApiPropertyOptional({ description: 'Whether to apply pagination.' })
    @IsOptional()
    // @IsBoolean()
    pagination?: boolean;

    @ApiPropertyOptional({ description: 'Whether to apply tree.' })
    @IsOptional()
    type?: string;

    @ApiPropertyOptional({ description: 'Whether to apply tree.' })
    @IsOptional()
    root_node?: string;
}
