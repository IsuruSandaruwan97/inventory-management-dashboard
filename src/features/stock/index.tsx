/** @format */

import { STOCK_FILTER_TYPES, TABLE_STATUS } from "@configs/index";
import { Card, Flex, Space } from "antd";
import { CSSProperties, useState } from "react";
import StockRequest from "@features/stock/components/StockRequest";
import FilterItems from "@components/FilterItems";
import { TListType } from "@configs/types";

export type TFilter = "requests" | "all" | "return" | "damaged";

type TRenderContent = {
  type: TFilter;
  listType: TListType;
};

const renderContent = ({ type, listType }: TRenderContent) => {
  switch (type) {
    case "all":
      return <>All</>;
    case "return":
      return <>Return</>;
    case "damaged":
      return <>Damaged</>;
    default:
      return <StockRequest listType={listType} />;
  }
};

const Stock = () => {
  const styles = useStyles();
  const [listType, setListType] = useState<TListType>(
    TABLE_STATUS[0].value as TListType
  );
  const [filter, setFilter] = useState<TFilter>(
    STOCK_FILTER_TYPES[0].value as TFilter
  );

  return (
    <Space direction="vertical" style={styles.space}>
      <Card>
        <Flex justify="space-between">
          {filter === "requests" ? (
            <FilterItems
              items={TABLE_STATUS}
              value={listType}
              onChangeValue={(value) =>
                setListType(value.toString() as TListType)
              }
            />
          ) : (
            <span />
          )}
          <FilterItems
            customStyles={styles.stockFilters}
            items={STOCK_FILTER_TYPES}
            value={filter}
            onChangeValue={(value) => setFilter(value as TFilter)}
          />
        </Flex>
      </Card>
      <Card style={{ padding: 0 }}>
        {renderContent({
          type: filter,
          listType: listType,
        })}
      </Card>
    </Space>
  );
};

export default Stock;

const useStyles = () => ({
  space: {
    width: "100%",
  } as CSSProperties,
  stockFilters: {
    display: "flex",
    justifyContent: "flex-end",
  } as CSSProperties,
});
