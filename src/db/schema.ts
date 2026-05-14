import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['farmasi', 'logistik', 'manajemen'] }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const requests = pgTable('requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  location: text('location').notNull(),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).notNull(),
  photoUrl: text('photo_url'),
  status: text('status', { enum: ['pending', 'diproses', 'dikirim', 'selesai'] }).default('pending').notNull(),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  assignedTo: uuid('assigned_to').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
