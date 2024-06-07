import { api } from "@/lib/api";
import { formatCurrency, getOrCreateUUID } from "@/lib/utils";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

async function getTotalSpent() {
  const userId = getOrCreateUUID();
  const response = await api.expenses["total-spent"].$get({
    query: { userId },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch total spent");
  }

  const data = await response.json();
  return data;
}

export default function Index() {
  const { data } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  });

  return (
    <div className="w-full p-6">
      {data && (
        <Card
          isBlurred
          className="dark:bg-default-400/10 min-w-[200px] border-transparent bg-white/5 backdrop-blur-lg backdrop-saturate-[1.8]"
        >
          <CardHeader>
            <p className="text-xl font-semibold">Total expended</p>
          </CardHeader>

          <CardBody className="pt-0">
            {!!data.total && (
              <p className="text-danger">{formatCurrency(data.total)}</p>
            )}
            {!data.total && <p>No expenses saved</p>}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
