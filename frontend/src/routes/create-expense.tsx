import {
  createExpense,
  getAllExpensesQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/api/expenses";
import { getOrCreateUUID } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseDate } from "@internationalized/date";
import { Button, DatePicker, Input } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createExpenseSchema } from "@server/sharedTypes";

export const Route = createFileRoute("/create-expense")({
  component: Expenses,
});

const formSchema = createExpenseSchema.omit({ userId: true });

function Expenses() {
  const queryClient = useQueryClient();

  const userId = getOrCreateUUID();
  const today = new Date().toISOString().split("T")[0];

  const {
    formState: { isValid, isSubmitting, dirtyFields, errors },
    control,
    setValue,
    handleSubmit,
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "",
      date: today,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const existingExpenses = await queryClient.ensureQueryData(
      getAllExpensesQueryOptions,
    );

    const data = {
      ...values,
      userId,
    };

    queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {
      expense: data,
    });

    try {
      const newExpense = await createExpense({ values: data });

      queryClient.setQueryData(getAllExpensesQueryOptions.queryKey, {
        ...existingExpenses,
        expenses: [newExpense, ...existingExpenses.expenses],
      });
      toast.success("Expense created!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage);
    } finally {
      queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {});
      reset();
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex flex-col gap-4 ">
        <form
          className="flex flex-col w-full gap-4 p-4 rounded-large shadow-small bg-content1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Cat food"
                fullWidth
                label="Title"
                isRequired
                isInvalid={!!errors.title && dirtyFields.title}
                errorMessage={errors.title?.message}
                isDisabled={isSubmitting}
                {...field}
              />
            )}
          />
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                startContent={<p className="text-default-400">$</p>}
                fullWidth
                label="Amount"
                isRequired
                isInvalid={!!errors.amount && dirtyFields.amount}
                errorMessage={errors.amount?.message}
                isDisabled={isSubmitting}
                {...field}
              />
            )}
          />
          <Controller
            name="date"
            control={control}
            render={() => (
              <DatePicker
                label="Date"
                isRequired
                defaultValue={parseDate(today)}
                isInvalid={!!errors.date && dirtyFields.date}
                errorMessage={errors.date?.message}
                isDisabled={isSubmitting}
                onChange={(date) => setValue("date", date.toString())}
              />
            )}
          />
          <Button
            color="primary"
            type="submit"
            isDisabled={!isValid || isSubmitting}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
