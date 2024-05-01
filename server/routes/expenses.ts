import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

const createExpenseSchema = expenseSchema.omit({ id: true });

export type Expense = z.infer<typeof expenseSchema>;

export const expensesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: [] });
  })
  .post("/", zValidator("json", createExpenseSchema), async (c) => {
    const data = await c.req.valid("json");
    const expense = createExpenseSchema.parse(data);

    console.log({ expense });
    return c.json(expense);
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));

    return c.json({ id });
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));

    return c.json({ id });
  });
