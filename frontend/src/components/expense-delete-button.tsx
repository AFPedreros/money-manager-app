import { deleteExpense, getAllExpensesQueryOptions } from "@/api/expenses";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function ExpenseDeleteButton({ id }: { id: string }) {
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
