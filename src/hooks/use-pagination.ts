import { useEffect, useState } from 'react';

export type PaginationController = {
  setTotal: (total: number) => void;
  page: number;
  perPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  nextPage: () => void;
  prevPage: () => void;
};

export function usePagination(totalItems = 0, _perPage = 15): PaginationController {
  const [total, setTotal] = useState(totalItems);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(_perPage);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setTotalPages(Math.ceil(total / perPage));
  }, [total]);

  return {
    setTotal,
    page,
    perPage,
    totalPages,
    setPage,
    setPerPage,
    nextPage: () => setPage(page + 1),
    prevPage: () => setPage(page - 1)
  };
}
