import {
  getAllExpensesQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/api/expenses";
import { ExpenseDeleteButton } from "@/components/expense-delete-button";
import { LoadingExpenses } from "@/components/loading-expenses";
import { expensesColumns } from "@/lib/tableColumns";
import { formatCurrency } from "@/lib/utils";
import { Icon } from "@iconify/react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/expenses")({
  component: Expenses,
});

function Expenses() {
  const { data, isPending } = useQuery(getAllExpensesQueryOptions);
  const { data: loadingCreateExpense } = useQuery(
    loadingCreateExpenseQueryOptions,
  );

  let expenses = data?.expenses ?? [];

  if (loadingCreateExpense?.expense) {
    const optimisticExpense = {
      ...loadingCreateExpense.expense,
      id: 999999,
      createdAt: new Date().toISOString(),
    };

    expenses = [optimisticExpense, ...expenses];
  }

  if (isPending) {
    return <LoadingExpenses />;
  }

  return (
    <div className="p-6">
      <Table color="primary" aria-label="Expenses table">
        <TableHeader columns={expensesColumns}>
          {(column) => (
            <TableColumn key={column.key} className="uppercase">
              {column.label}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          emptyContent={
            expenses.length === 0 && "No expenses found. Create one!"
          }
        >
          {expenses.map((expense, index) => {
            if (index === 0 && loadingCreateExpense?.expense) {
              return (
                <TableRow key="optimisticExpense" className="animate-pulse">
                  <TableCell className="w-1/4">{expense.title}</TableCell>
                  <TableCell className="w-1/4">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell className="w-1/4">{expense.date}</TableCell>
                  <TableCell className="w-1/4">
                    <div className="relative flex justify-start items-center gap-2">
                      <Button size="sm" isIconOnly isLoading />
                      <Button size="sm" color="danger" isIconOnly isLoading />
                    </div>
                  </TableCell>
                </TableRow>
              );
            }

            return (
              <TableRow key={expense.id}>
                <TableCell className="w-1/4">{expense.title}</TableCell>
                <TableCell className="w-1/4">
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell className="w-1/4">{expense.date}</TableCell>
                <TableCell className="w-1/4">
                  <div className="relative flex justify-start items-center gap-2">
                    <Button
                      startContent={
                        <Icon
                          icon="solar:pen-2-linear"
                          height={18}
                          width={18}
                        />
                      }
                      size="sm"
                      variant="flat"
                      isIconOnly
                    />
                    <ExpenseDeleteButton id={expense?.id?.toString() ?? ""} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
