
import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/types';
import { calculatorConfig } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { CreateCalculatorConfigDto, UpdateCalculatorConfigDto } from './dto/create-calculator-config.dto';

@Injectable()
export class CalculatorService {
    constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

    async create(createDto: CreateCalculatorConfigDto) {
        try {
            const result = await this.db
                .insert(calculatorConfig)
                .values({
                    ...createDto,
                    efficiencyPanel: createDto.efficiencyPanel?.toString() || '0.18',
                    co2SavingsPerUnit: createDto.co2SavingsPerUnit?.toString() || '0.71',
                    costPerKw: createDto.costPerKw.toString(),
                    electricityRate: createDto.electricityRate.toString(),
                    avgSunlightHours: createDto.avgSunlightHours.toString(),
                })
                .returning();
            return result[0];
        } catch (error: any) {
            if (error.code === '23505') { // Unique constraint violation
                throw new ConflictException('Configuration for this state already exists');
            }
            throw error;
        }
    }

    async findAll() {
        return this.db
            .select()
            .from(calculatorConfig)
            .orderBy(desc(calculatorConfig.updatedAt));
    }

    async findOne(id: number) {
        const result = await this.db
            .select()
            .from(calculatorConfig)
            .where(eq(calculatorConfig.id, id));

        if (!result.length) {
            throw new NotFoundException(`Config with ID ${id} not found`);
        }

        return result[0];
    }

    async update(id: number, updateDto: UpdateCalculatorConfigDto) {
        await this.findOne(id);

        // Convert numbers to strings for decimal fields if present
        const updateData: any = { ...updateDto };
        if (updateDto.costPerKw) updateData.costPerKw = updateDto.costPerKw.toString();
        if (updateDto.electricityRate) updateData.electricityRate = updateDto.electricityRate.toString();
        if (updateDto.avgSunlightHours) updateData.avgSunlightHours = updateDto.avgSunlightHours.toString();
        if (updateDto.efficiencyPanel) updateData.efficiencyPanel = updateDto.efficiencyPanel.toString();
        if (updateDto.co2SavingsPerUnit) updateData.co2SavingsPerUnit = updateDto.co2SavingsPerUnit.toString();

        return this.db
            .update(calculatorConfig)
            .set({
                ...updateData,
                updatedAt: new Date(),
            })
            .where(eq(calculatorConfig.id, id))
            .returning();
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.db
            .delete(calculatorConfig)
            .where(eq(calculatorConfig.id, id))
            .returning();
    }
}
