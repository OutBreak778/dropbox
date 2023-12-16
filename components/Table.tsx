"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import { FileTypes } from "@/typings";
import { columns } from "./Columns";
import { useAppStore } from "@/store/store";
import { DeleteModel } from "./DeleteModal";
import RenameModal from "./RenameModal";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [setFieldId, setDeleteModal, setRenameModal, setFilename] = useAppStore(
    (state) => [
      state.setFieldId,
      state.setDeleteModal,
      state.setRenameModal,
      state.setFilename,
    ]
  );

  const DeleteToggle = (fieldId: string) => {
    setFieldId(fieldId);
    setDeleteModal(true);
  };

  const RenameToggle = (fieldId: string, filename: string) => {
    setFieldId(fieldId);
    setFilename(filename);
    setRenameModal(true);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                <DeleteModel />
                <RenameModal />
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.id === "timestamp" ? (
                      <div className="flex flex-col">
                        <div className="text-sm">
                          {(cell.getValue() as Date).toLocaleDateString()}
                        </div>
                        <div className="text-xs trxt-gray-600">
                          {(cell.getValue() as Date).toLocaleTimeString()}
                        </div>
                      </div>
                    ) : cell.column.id === "filename" ? (
                      <p
                        onClick={() =>
                          RenameToggle(
                            (row.original as FileTypes).id,
                            (row.original as FileTypes).filename
                          )
                        }
                        className="flex items-center underline text-blue-500 hover:cursor-pointer"
                      >
                        {cell.getValue() as " "}
                        <PencilIcon className="ml-1 w-5 h-5" />
                      </p>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
                <TableCell key={(row.original as FileTypes).id}>
                  <Button variant="outline" onClick={() => DeleteToggle((row.original as FileTypes).id)}>
                    <TrashIcon className="w-5 h-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                You have no Files.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
