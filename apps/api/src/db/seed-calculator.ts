import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

async function seedCalculator() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql, { schema });

    console.log('🌱 Seeding calculator config...');

    try {
        const configs = [
            {
                stateName: 'Default',
                avgSunlightHours: '5.00',
                costPerKw: '50000.00',
                electricityRate: '8.00',
                efficiencyPanel: '0.18',
                co2SavingsPerUnit: '0.710',
            },
            {
                stateName: 'Maharashtra',
                avgSunlightHours: '5.50',
                costPerKw: '52000.00',
                electricityRate: '9.50',
                efficiencyPanel: '0.19',
                co2SavingsPerUnit: '0.710',
            },
            {
                stateName: 'Gujarat',
                avgSunlightHours: '6.00',
                costPerKw: '48000.00',
                electricityRate: '7.50',
                efficiencyPanel: '0.19',
                co2SavingsPerUnit: '0.710',
            },
            {
                stateName: 'Rajasthan',
                avgSunlightHours: '6.50',
                costPerKw: '47000.00',
                electricityRate: '7.80',
                efficiencyPanel: '0.20',
                co2SavingsPerUnit: '0.710',
            },
            {
                stateName: 'Karnataka',
                avgSunlightHours: '5.20',
                costPerKw: '51000.00',
                electricityRate: '8.20',
                efficiencyPanel: '0.18',
                co2SavingsPerUnit: '0.710',
            },
            {
                stateName: 'Tamil Nadu',
                avgSunlightHours: '5.40',
                costPerKw: '50000.00',
                electricityRate: '8.00',
                efficiencyPanel: '0.18',
                co2SavingsPerUnit: '0.710',
            }
        ];

        console.log(`Inserting ${configs.length} configurations...`);

        // We use onConflictDoNothing to avoid errors if run multiple times
        await db.insert(schema.calculatorConfig)
            .values(configs)
            .onConflictDoNothing()
            .returning();

        console.log('✅ Calculator config seeded successfully');

    } catch (error) {
        console.error('❌ Error seeding calculator config:', error);
        throw error;
    }
}

seedCalculator()
    .then(() => {
        console.log('\n✅ Seed process completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Seed process failed:', error);
        process.exit(1);
    });
