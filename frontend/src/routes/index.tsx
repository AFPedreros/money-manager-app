import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: Index,
});

async function getTotalSpent() {
  const response = await api.expenses["total-spent"].$get();
  if (!response.ok) {
    throw new Error("Failed to fetch total spent");
  }

  const data = await response.json();
  return data;
}

export default function Index() {
  const { data } = useQuery({
    queryKey: ["total-spent"],
    queryFn: getTotalSpent,
  });

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card
        isBlurred
        className="min-w-[200px] border-transparent bg-white/5 backdrop-blur-lg backdrop-saturate-[1.8] dark:bg-default-400/10"
      >
        <CardHeader className="">
          <p className="text-xl font-semibold">Total gastos</p>
        </CardHeader>

        <CardBody className="">
          <p className="">${data?.total}</p>
        </CardBody>
      </Card>
    </div>
  );
}
