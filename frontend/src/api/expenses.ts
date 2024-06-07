import { api } from "@/api";
import { getOrCreateUUID } from "@/lib/utils";
import { queryOptions } from "@tanstack/react-query";

import { CreateExpense } from "@server/sharedTypes";

async function getAllExpenses() {
  const userId = getOrCreateUUID();
  const response = await api.expenses.$get({
    query: { userId },
  });

  if (!response.ok) {
    throw new Error("Server error");
  }

  const data = await response.json();
  return data;
}

export const getAllExpensesQueryOptions = queryOptions({
  queryKey: ["get-all-expenses"],
  queryFn: getAllExpenses,
  staleTime: 1000 * 60 * 5,
});

export async function createExpense({ values }: { values: CreateExpense }) {
  const response = await api.expenses.$post({
    json: { ...values },
  });
  if (!response.ok) {
    throw new Error("Error creating expense");
  }

  const newExpense = await response.json();
  return newExpense;
}

export const loadingCreateExpenseQueryOptions = queryOptions<{
  expense?: CreateExpense;
}>({
  queryKey: ["loading-create-expense"],
  queryFn: async () => {
    return {};
  },
  staleTime: Infinity,
});

export async function deleteExpense({ id }: { id: number }) {
  const userId = getOrCreateUUID();

  const res = await api.expenses[":id{[0-9]+}"].$delete({
    param: { id: id.toString() },
    query: { userId },
  });

  if (!res.ok) {
    throw new Error("server error");
  }
}
