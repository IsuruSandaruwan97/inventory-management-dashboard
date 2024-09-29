import { PlusOutlined } from '@ant-design/icons';
import FilterItems from '@components/FilterItems';
import { DEFAULT_FILTERS } from '@configs/constants';
import { DEFAULT_ERROR_MESSAGE } from '@configs/constants/api.constants.ts';
import { TABLE_STATUS } from '@configs/index';
import { StyleSheet } from '@configs/stylesheet';
import { TListType } from '@configs/types';
import { TCommonFilters } from '@configs/types/api.types.ts';
import ItemContent from '@features/stock/components/ItemContent';
import { fetchItemRequests } from '@features/stock/services';
import { getTagColor } from '@features/stock/utils';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { useQuery } from '@tanstack/react-query';
import { Card, Collapse, Empty, Flex, Pagination, Space, Tag } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const maxCount: number = 6;
const Stock = () => {
  const isMobile = useMediaQuery({ maxWidth: 769 });
  const toastApi = useToastApi();
  const [listType, setListType] = useState<TListType>(TABLE_STATUS[0].value as TListType);
  const [filters, setFilters] = useState<TCommonFilters>({ ...DEFAULT_FILTERS, limit: maxCount });

  const {
    data: requestData,
    isLoading: requestLoading,
    error: requestError,
    refetch: requestRefetch,
  } = useQuery({
    queryKey: ['requests', filters.page, filters.search, listType],
    queryFn: () => fetchItemRequests({ ...filters, status: listType }),
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

  return (
    <Space direction="vertical" style={styles.space}>
      <Card style={{ padding: 0 }}>
        <FilterItems
          items={TABLE_STATUS}
          value={listType}
          onChangeValue={(value) => setListType(value.toString() as TListType)}
        />
      </Card>

      <Card loading={requestLoading} style={{ minHeight: '50vh' }}>
        {!isEmpty(requestData?.records) ? (
          <Space direction="vertical" style={styles.space}>
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
                        {item?.status?.toLowerCase() !== 'pending' && (
                          <Tag color={getTagColor(item.status)}>{item.status}</Tag>
                        )}
                      </Space>
                    </div>
                  ),
                  children: (
                    <ItemContent
                      styles={styles}
                      isMobile={isMobile}
                      item={item}
                      listType={listType}
                      refetchData={() => requestRefetch()}
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
          </Space>
        ) : (
          <Flex justify="center" align="center" style={{ marginTop: '4%' }}>
            <Empty />
          </Flex>
        )}
      </Card>
    </Space>
  );
};

export default Stock;

const styles = StyleSheet.create({
  space: {
    width: '100%',
  },
  stockFilters: {
    display: 'flex',
    justifyContent: 'flex-end',
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
  description: {
    display: 'flex',
    marginTop: -5,
    marginBottom: 10,
    fontSize: 12,
    alignContent: 'center',
  },
  mobileActionButtons: {
    marginLeft: '40%',
    marginTop: 15,
  },
  boldText: {
    fontWeight: 500,
  },
});
