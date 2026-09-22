import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder, Brackets, Between } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class TableHelperService {
    async applyFilters(queryBuilder: any, request: Request, filtering: any) {
        const coreTable = filtering.coreTable ?? null;
        const searchingAll = filtering.searchingAll ?? [];
        const searching = filtering.searching ?? [];
        const searchingOption = filtering.searchingOption ?? [];
        const searchingOrWhere = filtering.searchingOrWhere ?? [];
        const searchingBeetween = filtering.searchingBeetween ?? [];
        const yearMonthFilter = filtering.yearMonthFilter ?? [];
        const sorting = filtering.sorting ?? [];
        const joins = filtering.joins ?? [];
        const defaultSorting = filtering.defaultSorting ?? null;
        const result = filtering.result ?? null;

        const filters = {
            join: joins,
            searchAll: request.query.searchAll as string,
            searchBeetwen: this.toArray(request.query.searchBeetwen) || [],
            searchBeetwenStart: this.toArray(request.query.searchBeetwenStart) || [],
            searchBeetwenEnd: this.toArray(request.query.searchBeetwenEnd) || [],
            searchOrWhereBy: this.toArray(request.query.searchOrWhereBy) || [],
            searchOrwhere: this.toArray(request.query.searchOrwhere) || [],
            searchOptionBy: this.toArray(request.query.searchOptionBy) || [],
            searchOption: this.toArray(request.query.searchOption) || [],
            searchBy: this.toArray(request.query.searchBy) || [],
            search: this.toArray(request.query.search) || [],
            sortBy: this.toArray(request.query.sortBy) || [],
            sort: this.toArray(request.query.sort) || [],
            row: parseInt(request.query.row as string, 10) || 10,
            page: parseInt(request.query.page as string, 10) || 1,
            year: this.toArray(request.query.year) || [],
            month: this.toArray(request.query.month) || [],
            yearMonthFilter: this.toArray(request.query.yearMonthFilter) || [],
            pagination: this.convertToBoolean(request.query.pagination as string) ?? true
        };

        // if (filters.join.length > 0) {
        // }

        // Apply Search All
        if (filters.searchAll) {
            queryBuilder.andWhere(
                new Brackets(qb => {
                    searchingAll.forEach((field: string, index: number) => {
                        const paramName = `searchAllValue${index}`;
                        if (field.includes('.')) {
                            qb.orWhere(`${field} LIKE :${paramName}`, {
                                [paramName]: `%${filters.searchAll}%`
                            });
                        } else {
                            qb.orWhere(`${coreTable}.${field} LIKE :${paramName}`, {
                                [paramName]: `%${filters.searchAll}%`
                            });
                        }
                    });
                })
            );
        }

        // Apply Search By
        if (filters.searchBy.length > 0) {
            queryBuilder.andWhere(
                new Brackets(qb => {
                    filters.searchBy.forEach((field, index) => {
                        const value = filters.search[index];
                        if (value && searching.includes(field)) {
                            const paramName = `searchValue${index}`;
                            const searchTerm = `%${value.toLowerCase()}%`;

                            if (field.includes('.')) {
                                qb.andWhere(`LOWER(${field}) LIKE :${paramName}`, {
                                    [paramName]: searchTerm
                                });
                            } else {
                                qb.andWhere(`LOWER(${coreTable}.${field}) LIKE :${paramName}`, {
                                    [paramName]: searchTerm
                                });
                            }
                        }
                    });
                })
            );
        }

        // Apply Search Option By
        if (filters.searchOptionBy.length > 0) {
            queryBuilder.andWhere(
                new Brackets(qb => {
                    filters.searchOptionBy.forEach((field, index) => {
                        if (filters.searchOption[index] && searchingOption.includes(field)) {
                            const paramKey = `searchOptionValue${index}`;
                            if (field.includes('.')) {
                                qb.andWhere(`${field} = :${paramKey}`, {
                                    [paramKey]: filters.searchOption[index]
                                });
                            } else {
                                qb.andWhere(`${coreTable}.${field} = :${paramKey}`, {
                                    [paramKey]: filters.searchOption[index]
                                });
                            }
                        }
                    });
                })
            );
        }

        if (filters.searchOrWhereBy.length > 0) {
            queryBuilder.andWhere(
                new Brackets(qb => {
                    filters.searchOrWhereBy.forEach((field: string, index: number) => {
                        const value = filters.searchOrwhere[index];
                        if (value && searchingOrWhere.includes(field)) {
                            const paramName = `searchOrWhereValue${index}`;
                            const searchTerm = `%${value.toLowerCase()}%`;
                            if (field.includes('.')) {
                                qb.orWhere(`LOWER(${field}) LIKE :${paramName}`, {
                                    [paramName]: searchTerm
                                });
                            } else {
                                qb.orWhere(`LOWER(${coreTable}.${field}) LIKE :${paramName}`, {
                                    [paramName]: searchTerm
                                });
                            }
                        }
                    });
                })
            );
        }

        // Apply Search Between
        if (filters.searchBeetwen) {
            queryBuilder.andWhere(
                new Brackets(qb => {
                    filters.searchBeetwen.forEach((field: string, index: number) => {
                        if (filters.searchBeetwenStart[index] && filters.searchBeetwenEnd[index] && searchingBeetween.includes(field)) {
                            if (coreTable != null) {
                                const startParam = `start${index}`;
                                const endParam = `end${index}`;
                                if (field.includes('.')) {
                                    qb.andWhere(`${field} BETWEEN :${startParam} AND :${endParam}`, {
                                        [startParam]: filters.searchBeetwenStart[index],
                                        [endParam]: filters.searchBeetwenEnd[index]
                                    });
                                } else {
                                    qb.andWhere(`${coreTable}.${field} BETWEEN :${startParam} AND :${endParam}`, {
                                        [startParam]: filters.searchBeetwenStart[index],
                                        [endParam]: filters.searchBeetwenEnd[index]
                                    });
                                }
                            }
                        }
                    });
                })
            );
        }

        if (filters.yearMonthFilter) {
            queryBuilder.andWhere(
                new Brackets(qb => {
                    filters.yearMonthFilter.forEach((field: string, index: number) => {
                        if (filters.year[index] && filters.month[index] && yearMonthFilter.includes(field)) {
                            const startParam = `startYM${index}`;
                            const endParam = `endYM${index}`;

                            // Format tanggal (simple, pakai 31)
                            const startDate = `${filters.year[index]}-${filters.month[index]}-01`;
                            const endDate = `${filters.year[index]}-${filters.month[index]}-31`;

                            if (field.includes('.')) {
                                qb.andWhere(`${field} BETWEEN :${startParam} AND :${endParam}`, {
                                    [startParam]: startDate,
                                    [endParam]: endDate
                                });
                            } else {
                                qb.andWhere(`${coreTable}.${field} BETWEEN :${startParam} AND :${endParam}`, {
                                    [startParam]: startDate,
                                    [endParam]: endDate
                                });
                            }
                        }
                    });
                })
            );
        }

        // Apply Sorting
        if (filters.sortBy.length > 0) {
            filters.sortBy.forEach((field: string, index: number) => {
                if (filters.sort[index] && sorting.includes(field)) {
                    if (coreTable != null) {
                        if (field.includes('.')) {
                            queryBuilder.addOrderBy(field, filters.sort[index].toUpperCase());
                        } else {
                            queryBuilder.addOrderBy(`${coreTable}.${field}`, filters.sort[index].toUpperCase());
                        }
                    }
                }
            });
        } else {
            if (defaultSorting) {
                queryBuilder.addOrderBy(defaultSorting, 'DESC');
            }
        }
        // queryBuilder.addOrderBy('user.id', 'DESC');

        // Apply Pagination
        if (filters.pagination) {
            const take = filters.row;
            const skip = (filters.page - 1) * filters.row;
            return queryBuilder
                .skip(skip)
                .take(take)
                .getManyAndCount()
                .then(([data, total]) => ({
                    data,
                    paginationInfo: {
                        total_data: total,
                        total_page: Math.ceil(total / filters.row),
                        current_page: filters.page,
                        per_page: filters.row
                    }
                }));
        }

        let data: any;
        if (result === 'raw') {
            data = await queryBuilder.getRawMany();
        } else if (result === 'count') {
            data = await queryBuilder.getCount();
        } else if (result === 'rawOne') {
            data = await queryBuilder.getRawOne();
        } else if (result === 'one') {
            data = await queryBuilder.getOne();
        } else {
            data = await queryBuilder.getMany();
        }
        return { data: data };
    }

    private convertToBoolean(value: string): boolean | undefined {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return undefined;
    }
    private toArray(value: any): any[] {
        if (Array.isArray(value)) {
            return value;
        }
        return value ? [value] : [];
    }
}
