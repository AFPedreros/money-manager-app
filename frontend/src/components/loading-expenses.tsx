import { expensesColumns } from "@/lib/tableColumns";
import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

export function LoadingExpenses() {
  return (
    <div className="p-6">
      <Table color="primary" aria-label="Expenses table">
        <TableHeader columns={expensesColumns}>
          {(column) => (
            <TableColumn key={column.key} className="uppercase">
              {column.label}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody>
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <TableRow key={index}>
                <TableCell className="w-1/4">
                  <Skeleton className="rounded-md">
                    <div className="h-4 rounded-md bg-default-300" />
                  </Skeleton>
                </TableCell>
                <TableCell className="w-1/4">
                  <Skeleton className="rounded-md">
                    <div className="h-4 rounded-md bg-default-300" />
                  </Skeleton>
                </TableCell>
                <TableCell className="w-1/4">
                  <Skeleton className="rounded-md">
                    <div className="h-4 rounded-md bg-default-300" />
                  </Skeleton>
                </TableCell>
                <TableCell className=" w-1/4">
                  <div className="relative flex justify-start items-center gap-2">
                    <Button size="sm" isIconOnly isLoading />
                    <Button size="sm" color="danger" isIconOnly isLoading />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
