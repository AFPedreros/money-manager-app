import { useState } from "react";
import Counter from "@/components/counter";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="mx-auto flex h-screen w-full flex-col items-center justify-center gap-4">
      <Counter count={count} setCount={setCount} />
      <p>{count}</p>
    </div>
  );
}
