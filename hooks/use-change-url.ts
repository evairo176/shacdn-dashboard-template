"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ChangeEvent, useEffect } from "react";
import useDebounce from "./use-debounce";
import { DELAY, LIMIT_DEFAULT, PAGE_DEFAULT } from "@/config/list.constant";

const useChangeUrl = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounce = useDebounce();

  // baca "current*" dari query (App Router: string | null)
  const currentLimit = searchParams.get("limit");
  const currentPage = searchParams.get("page");
  const currentSearch = searchParams.get("search");
  const currentCategory = searchParams.get("category");
  const currentIsOnline = searchParams.get("isOnline");
  const currentIsFeatured = searchParams.get("isFeatured");

  // helper bikin QS baru dari QS sekarang
  const createQueryString = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined) return;
      if (value === "") params.delete(key);
      else params.set(key, value);
    });
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  // set default saat param hilang (pengganti router.isReady & shallow)
  useEffect(() => {
    const ExplorePathName =
      pathname === "/event"
        ? {
            category: currentCategory || "",
            isOnline: currentIsOnline || "",
            isFeatured: currentIsFeatured || "",
          }
        : {};

    const nextUrl = createQueryString({
      ...Object.fromEntries(searchParams),
      limit: currentLimit || String(LIMIT_DEFAULT),
      page: currentPage || String(PAGE_DEFAULT),
      search: currentSearch || "",
      ...ExplorePathName,
    });

    // hindari loop: hanya replace jika berbeda
    const now = `${pathname}${
      searchParams.toString() ? "?" + searchParams.toString() : ""
    }`;
    if (nextUrl !== now) {
      router.replace(nextUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // cukup bergantung pathname agar tidak looping

  const handleChangePage = (page: number) => {
    const url = createQueryString({
      ...Object.fromEntries(searchParams),
      page: String(page),
    });
    router.push(url);
  };

  const handleChangeLimit = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedLimit = e.target.value;
    const url = createQueryString({
      ...Object.fromEntries(searchParams),
      limit: selectedLimit,
      page: String(PAGE_DEFAULT),
    });
    router.push(url);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    debounce(() => {
      const search = e.target.value;
      const url = createQueryString({
        ...Object.fromEntries(searchParams),
        search,
        page: String(PAGE_DEFAULT),
      });
      router.push(url);
    }, DELAY);
  };

  const handleClearSearch = () => {
    const url = createQueryString({
      ...Object.fromEntries(searchParams),
      search: "",
      page: String(PAGE_DEFAULT),
    });
    router.push(url);
  };

  const handleChangeCategory = (category: string) => {
    const url = createQueryString({
      ...Object.fromEntries(searchParams),
      category,
      page: String(PAGE_DEFAULT),
    });
    router.push(url);
  };

  const handleChangeIsOnline = (isOnline: string) => {
    const url = createQueryString({
      ...Object.fromEntries(searchParams),
      isOnline,
      page: String(PAGE_DEFAULT),
    });
    router.push(url);
  };

  const handleChangeIsFeatured = (isFeatured: string) => {
    const url = createQueryString({
      ...Object.fromEntries(searchParams),
      isFeatured,
      page: String(PAGE_DEFAULT),
    });
    router.push(url);
  };

  const resetFilterExplore = () => {
    const params = new URLSearchParams();
    params.set("limit", String(LIMIT_DEFAULT));
    params.set("page", String(PAGE_DEFAULT));
    const url = `${pathname}?${params.toString()}`;
    router.push(url);
  };

  return {
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleClearSearch,
    handleChangeCategory,
    handleChangeIsOnline,
    handleChangeIsFeatured,
    currentLimit,
    currentPage,
    currentSearch,
    currentCategory,
    currentIsOnline,
    currentIsFeatured,
    resetFilterExplore,
  };
};

export default useChangeUrl;
