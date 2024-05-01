import { Button } from "@nextui-org/button";

type CounterProps = {
  count: number;
  setCount: (count: number) => void;
};

export default function Counter({ count, setCount }: CounterProps) {
  return (
    <div className="flex gap-x-2">
      <Button color="primary" onClick={() => setCount(count + 1)}>
        up
      </Button>
      <Button onClick={() => setCount(count - 1)}>down</Button>
    </div>
  );
}
