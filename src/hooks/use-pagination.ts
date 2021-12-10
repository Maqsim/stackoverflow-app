import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getItem, setItem } from '../uitls/local-storage';

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
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamPage = searchParams.get('page');
  const [total, setTotal] = useState(totalItems);
  const [page, setPage] = useState((searchParamPage && parseInt(searchParamPage)) || 1);

  const savedPerPage = getItem('per-page');
  const [perPage, setPerPage] = useState((savedPerPage && savedPerPage[pathname]) || _perPage);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setTotalPages(Math.ceil(total / perPage));
  }, [total, perPage]);

  useEffect(() => {
    setSearchParams({ page: page.toString() });
  }, [page]);

  useEffect(() => {
    const oldValue = getItem('per-page');

    setItem('per-page', { ...oldValue, [pathname]: perPage });
  }, [perPage]);

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
