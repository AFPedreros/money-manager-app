import { api } from "@/lib/api";
import { formatCurrency, getOrCreateUUID } from "@/lib/utils";
import {
  Skeleton,
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

function Expenses() {
  const { data, isPending } = useQuery({
    queryKey: ["get-all-expenses"],
    queryFn: getAllExpenses,
  });

  return (
    <div className="p-6">
      <Table color="primary" selectionMode="single" aria-label="Expenses table">
        <TableHeader>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>AMOUNT</TableColumn>
          <TableColumn>DATE</TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={
            data?.expenses?.length ? undefined : "No rows to display."
          }
        >
          {isPending
            ? Array(3)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="rounded-md">
                        <div className="h-4 rounded-md bg-default-300" />
                      </Skeleton>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="rounded-md">
                        <div className="h-4 rounded-md bg-default-300" />
                      </Skeleton>
                    </TableCell>
                  </TableRow>
                ))
            : (data?.expenses || []).map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
