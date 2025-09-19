"use client";
import React from "react";
import useEvent from "./useEvent";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/table/data-table";
import { columns } from "./columns";

type Props = {};

const Event = (props: Props) => {
  const {
    dataEvent,
    isLoadingEvent,
    isRefetchingEvent,
    refetchEvent,
    selectedId,
    setSelectedId,
  } = useEvent();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Event</h3>
          <Button size="sm" className="mt-2">
            Add New Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="min-h-screen">
          <DataTable
            totalPages={Number(dataEvent?.pagination?.totalPages)}
            totalData={Number(dataEvent?.pagination?.total)}
            columns={columns}
            data={dataEvent?.data || []}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Event;
