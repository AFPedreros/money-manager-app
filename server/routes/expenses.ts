import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, sum } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "../db";
import {
  expenses as expensesTable,
  insertExpensesSchema,
} from "../db/schema/expenses";
import { createExpenseSchema } from "../sharedTypes";

const userIdSchema = z.object({
  userId: z.string(),
});

export const expensesRoute = new Hono()
  .get("/", zValidator("query", userIdSchema), async (c) => {
    const data = await c.req.valid("query");
    const { userId } = data;

    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, userId))
      .orderBy(desc(expensesTable.createdAt))
      .limit(100);

    return c.json({ expenses });
  })
  .post("/", zValidator("json", createExpenseSchema), async (c) => {
    const expense = await c.req.valid("json");
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
  .get("/:id{[0-9]+}", zValidator("query", userIdSchema), async (c) => {
    const data = await c.req.valid("query");
    const { userId } = data;

    const id = Number.parseInt(c.req.param("id"));

    const expense = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.userId, userId), eq(expensesTable.id, id)))
      .then((res) => res[0]);

    if (!expense) {
      return c.notFound();
    }

    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", zValidator("query", userIdSchema), async (c) => {
    const data = await c.req.valid("query");
    const { userId } = data;

    const id = Number.parseInt(c.req.param("id"));

    const expense = await db
      .delete(expensesTable)
      .where(and(eq(expensesTable.userId, userId), eq(expensesTable.id, id)))
      .returning()
      .then((res) => res[0]);

    if (!expense) {
      return c.notFound();
    }

    return c.json({ expense });
  })
  .get("/total-spent", zValidator("query", userIdSchema), async (c) => {
    const data = await c.req.valid("query");
    const { userId } = data;

    const result = await db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.userId, userId))
      .limit(1)
      .then((res) => res[0]);

    return c.json(result);
  });
