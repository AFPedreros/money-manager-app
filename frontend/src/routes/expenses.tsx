import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/expenses")({
  component: Expenses,
});

async function getAllExpenses() {
  const response = await api.expenses.$get();

  if (!response.ok) {
    throw new Error("Server error");
  }

  const data = await response.json();
  return data;
}

function Expenses() {
  const { data } = useQuery({
    queryKey: ["get-all-expenses"],
    queryFn: getAllExpenses,
  });

  console.log("DATA", data);

  return <div className="p-2">Hello Expenses!</div>;
}
