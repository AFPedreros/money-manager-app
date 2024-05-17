import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create-expense")({
  component: Expenses,
});

function Expenses() {
  return <div className="p-2">Hello Create Expense!</div>;
}
