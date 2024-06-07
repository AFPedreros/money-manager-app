import {
  deleteExpense,
  getAllExpensesQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/api/expenses";
import { formatCurrency } from "@/lib/utils";
import { Icon } from "@iconify/react";
import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/expenses")({
  component: Expenses,
});

function Expenses() {
  const { data, isPending } = useQuery(getAllExpensesQueryOptions);
  const { data: loadingCreateExpense } = useQuery(
    loadingCreateExpenseQueryOptions,
  );

  return (
    <div className="p-6">
      <Table color="primary" aria-label="Expenses table">
        <TableHeader>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>AMOUNT</TableColumn>
          <TableColumn>DATE</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={
            data?.expenses?.length ? undefined : "No rows to display."
          }
        >
          {loadingCreateExpense?.expense && (
            <TableRow className="animate-pulse">
              <TableCell className="w-1/3">
                {loadingCreateExpense.expense.title}
              </TableCell>
              <TableCell className="w-1/3">
                {formatCurrency(loadingCreateExpense.expense.amount)}
              </TableCell>
              <TableCell className="w-1/3">
                {loadingCreateExpense.expense.date}
              </TableCell>

              <TableCell className="w-1/4">
                <Button size="sm" isIconOnly isLoading />
              </TableCell>
            </TableRow>
          )}

          {isPending
            ? Array(3)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="w-1/4">
                      <Skeleton className="rounded-md">
                        <div className="h-4 rounded-md bg-default-300" />
                      </Skeleton>
                    </TableCell>
                    <TableCell className="w-1/4">
                      <Skeleton className="rounded-md">
                        <div className="h-4 rounded-md bg-default-300" />
                      </Skeleton>
                    </TableCell>
                    <TableCell className="w-1/4">
                      <Skeleton className="rounded-md">
                        <div className="h-4 rounded-md bg-default-300" />
                      </Skeleton>
                    </TableCell>
                    <TableCell className="w-1/4">
                      <Button size="sm" isIconOnly isLoading />
                    </TableCell>
                  </TableRow>
                ))
            : (data?.expenses || []).map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="w-1/4">{expense.title}</TableCell>
                  <TableCell className="w-1/4">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell className="w-1/4">{expense.date}</TableCell>
                  <TableCell className="w-1/4">
                    <Button
                      className="mr-2"
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
                    <ExpenseDeleteButton id={expense.id} />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ExpenseDeleteButton({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteExpense,
    onError: () => {
      toast.error("Error deleting expense");
    },
    onSuccess: () => {
      toast.success("Expense deleted!");

      queryClient.setQueryData(
        getAllExpensesQueryOptions.queryKey,
        (existingExpenses) => ({
          ...existingExpenses,
          expenses: existingExpenses!.expenses.filter(
            (e) => e.id !== Number(id),
          ),
        }),
      );
    },
  });

  return (
    <Button
      onClick={() => mutation.mutate({ id: Number(id) })}
      startContent={
        !mutation.isPending && (
          <Icon icon="solar:trash-bin-2-linear" height={18} width={18} />
        )
      }
      size="sm"
      color="danger"
      variant="flat"
      isIconOnly
      isLoading={mutation.isPending}
      disabled={mutation.isPending}
    />
  );
}
