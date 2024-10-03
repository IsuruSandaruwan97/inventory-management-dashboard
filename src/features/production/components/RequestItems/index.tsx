import { PlusOutlined } from '@ant-design/icons';
import { DEFAULT_FILTERS } from '@configs/constants';
import { DEFAULT_ERROR_MESSAGE } from '@configs/constants/api.constants.ts';
import { TCommonFilters } from '@configs/types/api.types.ts';
import ItemContent from '@features/stock/components/ItemContent.tsx';
import { fetchItemRequests } from '@features/stock/services';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { StyleSheet } from '@stylesheet';
import { useQuery } from '@tanstack/react-query';
import { Collapse, Empty, Flex, Pagination, Skeleton, Space, Tag } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
const maxCount: number = 6;
const RequestItems = () => {
  const toastApi = useToastApi();
  const isMobile = useMediaQuery({ maxWidth: 769 });
  const [filters, setFilters] = useState<TCommonFilters>({ ...DEFAULT_FILTERS, limit: maxCount });

  const {
    data: requestData,
    isLoading: requestLoading,
    error: requestError,
  } = useQuery({
    queryKey: ['requests', filters.page],
    queryFn: () => fetchItemRequests({ ...filters, status: 'pending' }),
  });

  useEffect(() => {
    if (requestError) {
      toastApi.open({
        content: requestError?.message || DEFAULT_ERROR_MESSAGE,
        type: 'error',
        duration: 4,
      });
    }
  }, [requestError]);

  return requestLoading ? (
    <Skeleton />
  ) : (
    <Space direction="vertical" style={styles.space}>
      {!isEmpty(requestData?.records) ? (
        <>
          <Collapse
            expandIcon={() => null}
            style={styles.collapse}
            accordion
            items={requestData?.records?.map((item, index) => {
              return {
                key: index,
                label: (
                  <div style={styles.label}>
                    <Space>
                      <PlusOutlined />
                      <p style={styles.boldText}>{item.request_id}</p>-{item.description}
                      <Tag color={'red'}>Pending</Tag>
                    </Space>
                  </div>
                ),
                children: (
                  <ItemContent
                    styles={styles}
                    isMobile={isMobile}
                    item={item}
                    listType={'pending'}
                    refetchData={() => {}}
                    isProduction={true}
                  />
                ),
              };
            })}
          />
          <Pagination
            style={styles.pagination}
            defaultCurrent={1}
            current={filters.page}
            pageSize={maxCount}
            total={requestData?.count}
            onChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        </>
      ) : (
        <Flex justify="center" align="center" style={{ marginTop: '4%' }}>
          <Empty />
        </Flex>
      )}
    </Space>
  );
};

export default RequestItems;

const styles = StyleSheet.create({
  space: {
    width: '100%',
  },
  collapse: { width: '100%' },
  pagination: { justifyContent: 'center' },
  label: {
    width: '100%',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boldText: {
    fontWeight: 500,
  },
});
