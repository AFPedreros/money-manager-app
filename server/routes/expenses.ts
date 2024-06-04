import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

import { db } from '../db';
import {
	expenses as expensesTable,
	insertExpensesSchema,
} from '../db/schema/expenses';
import { eq } from 'drizzle-orm';

import { createExpenseSchema } from '../sharedTypes';

const userIdSchema = z.object({
	userId: z.string(),
});

export const expensesRoute = new Hono()
	.get('/', zValidator('query', userIdSchema), async (c) => {
		const data = await c.req.valid('query');
		const { userId } = data;

		const expenses = await db
			.select()
			.from(expensesTable)
			.where(eq(expensesTable.userId, userId));

		return c.json({ expenses });
	})
	.post('/', zValidator('json', createExpenseSchema), async (c) => {
		const expense = await c.req.valid('json');
		const validatedExpense = insertExpensesSchema.parse({
			...expense,
		});

		const result = await db
			.insert(expensesTable)
			.values(validatedExpense)
			.returning()
			.then((res) => res[0]);

		c.status(201);
		return c.json(result);
	})
	.delete('/:id{[0-9]+}', (c) => {
		const id = Number.parseInt(c.req.param('id'));

		c.status(201);
		return c.json({ id });
	})
	.get('/total-spent', (c) => {
		const total = 1000;

		return c.json({ total });
	});
