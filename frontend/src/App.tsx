import { Card, CardHeader, CardBody } from "@nextui-org/card";

export default function App() {
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
          <p className="">$0.00</p>
        </CardBody>
      </Card>
    </div>
  );
}
