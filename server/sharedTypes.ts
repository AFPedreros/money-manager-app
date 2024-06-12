import { z } from "zod";

import { insertExpensesSchema } from "./db/schema/expenses";

export const createExpenseSchema = insertExpensesSchema.omit({
  createdAt: true,
  id: true,
});

export type Expense = z.infer<typeof insertExpensesSchema>;

export type CreateExpense = z.infer<typeof createExpenseSchema>;
