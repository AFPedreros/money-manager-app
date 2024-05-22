import { createFileRoute } from "@tanstack/react-router";
import { Button, Input } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/create-expense")({
  component: Expenses,
});

const formSchema = z.object({
  title: z.string().min(3, "Se necesita un título con más de 3 caracteres"),
  amount: z.number().positive("El monto debe ser positivo"),
});

function Expenses() {
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
      amount: 0,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("VALUES", { values });
    reset();
    toast.success("Expense created!");
  };

  return (
    <div className="w-full p-2">
      <div className="flex max-w-sm flex-col items-center justify-center gap-4">
        <h2 className="w-fit"> Hello Create Expense!</h2>

        <form
          className="flex w-full flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                labelPlacement="outside"
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
                labelPlacement="outside"
                startContent={<p className="text-default-400">$</p>}
                fullWidth
                label="Amount"
                isRequired
                isInvalid={!!errors.amount && dirtyFields.amount}
                errorMessage={errors.amount?.message}
                isDisabled={isSubmitting}
                {...field}
                value={field.value !== 0 ? field.value.toString() : ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
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
