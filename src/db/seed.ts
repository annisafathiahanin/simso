import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Seeding users...');
  
  const seedUsers = [
    {
      email: 'farmasi@test.com',
      password: 'password123',
      name: 'Petugas Farmasi',
      role: 'farmasi' as const,
    },
    {
      email: 'logistik@test.com',
      password: 'password123',
      name: 'Staf Logistik',
      role: 'logistik' as const,
    },
    {
      email: 'manajemen@test.com',
      password: 'password123',
      name: 'Kepala Manajemen',
      role: 'manajemen' as const,
    },
  ];

  for (const user of seedUsers) {
    await db.insert(schema.users).values(user).onConflictDoNothing();
    console.log(`User ${user.email} seeded.`);
  }

  console.log('Seed completed.');
}

seed().catch(console.error);
