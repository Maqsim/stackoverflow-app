import { PaginationController } from '../../hooks/use-pagination';
import { Button, ButtonGroup, HStack, Select } from '@chakra-ui/react';
import { memo, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { scrollToTop } from '../layout/ScrollToTop';

type Props = {
  controller: PaginationController;
  doScrollToTop?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
};

export const Pagination = memo(({ doScrollToTop = true, size = 'sm', controller }: Props) => {
  const [buttons, setButtons] = useState<number[]>([]);

  useEffect(() => {
    if (doScrollToTop) {
      scrollToTop();
    }

    let _buttons: number[];

    if (controller.totalPages < 5) {
      _buttons = [...Array(controller.totalPages)].map((_, index) => {
        return index + 1;
      });
    } else {
      _buttons = [...Array(5)].map((_, index) => {
        // Is near end
        if (controller.page + 1 >= controller.totalPages) {
          return controller.totalPages - 4 + index;
        }

        // Current page button tries always be on center
        return Math.max(controller.page - 3, 0) + index + 1;
      });
    }

    setButtons(_buttons);
  }, [controller.totalPages, controller.page]);

  return (
    <HStack justify="center">
      <ButtonGroup size={size} isAttached variant="outline">
        {buttons.map((pageIndex) => (
          <Button
            mr="-px"
            isActive={pageIndex === controller.page}
            onClick={() => controller.setPage(pageIndex)}
            key={pageIndex}
          >
            {pageIndex}
          </Button>
        ))}
      </ButtonGroup>

      <Select
        size={size}
        variant="outline"
        width="auto"
        flexGrow={0}
        onChange={(event) => {
          controller.setPage(1);
          controller.setPerPage(parseInt(event.target.value));
        }}
      >
        <option disabled>Per page</option>
        <option value="15">15</option>
        <option value="30">30</option>
        <option value="45">45</option>
      </Select>
    </HStack>
  );
}, isEqual);
