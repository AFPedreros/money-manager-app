import { api } from "@/lib/api";
import { getOrCreateUUID } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseDate } from "@internationalized/date";
import { Button, DatePicker, Input } from "@nextui-org/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createExpenseSchema } from "@server/sharedTypes";

export const Route = createFileRoute("/create-expense")({
  component: Expenses,
});

const formSchema = createExpenseSchema.omit({ userId: true });

function Expenses() {
  const userId = getOrCreateUUID();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const {
    formState: { isValid, isSubmitting, dirtyFields, errors },
    control,
    setValue,
    reset,
    handleSubmit,
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
    const response = await api.expenses.$post({
      json: { ...values, userId },
    });

    if (!response.ok) {
      toast.error("Error creating expense");
      return;
    }

    reset();
    toast.success("Expense created!");
    navigate({ to: "/expenses" });
  };

  return (
    <div className="w-full p-6">
      <div className="flex flex-col gap-4 ">
        <form
          className="flex flex-col w-full gap-4"
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
                isClearable
                onClear={() => setValue("title", "")}
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
