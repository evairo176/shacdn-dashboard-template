import useChangeUrl from "@/hooks/use-change-url";
import { useMounted } from "@/hooks/use-mounted";
import eventServices from "@/services/event.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const useEvent = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();
  const isReady = useMounted();

  const getEvents = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }
    const res = await eventServices.getEvents(params);

    const { data } = res;

    return data;
  };

  const {
    data: dataEvent,
    isLoading: isLoadingEvent,
    isRefetching: isRefetchingEvent,
    refetch: refetchEvent,
  } = useQuery({
    queryKey: ["events", currentPage, currentLimit, currentSearch],
    queryFn: getEvents,
    enabled: isReady && !!currentLimit && !!currentPage,
  });

  return {
    dataEvent,
    isLoadingEvent,
    isRefetchingEvent,
    refetchEvent,
    selectedId,
    setSelectedId,
  };
};

export default useEvent;
