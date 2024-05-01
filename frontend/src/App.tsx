export default function App() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="m-0 inline-flex w-[280px] max-w-full cursor-pointer flex-row-reverse items-center justify-between gap-4 rounded-lg !border-medium border-default-200 bg-content1 p-4 hover:bg-content2">
        <span className="inline bg-gradient-to-br from-foreground to-foreground-600 bg-clip-text text-3xl font-semibold leading-7 tracking-tight text-transparent">
          Total gastos
        </span>
      </div>
    </div>
  );
}
