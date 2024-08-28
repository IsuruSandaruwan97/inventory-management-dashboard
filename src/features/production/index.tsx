/** @format */

import { StyleSheet } from "@configs/stylesheet";
import { Button, Card, Row, Segmented, Space } from "antd";
import ProdutionItems from "@features/production/components/ProductionItems";
import { useState } from "react";
import PendingItems from "@features/production/components/PendingItems";
import RequestItemsModal from "@features/production/components/forms/RequestItemsModal";
import DamageItemsModal from "@features/production/components/forms/DamageItemsModal";
import CompleteItemsModal from "@features/production/components/forms/CompleteItemsModal";

const options = ["Production", "Pending"];

const Production = () => {
  const [option, setOption] = useState<string>("Production");
  const [completeItemsModal, setCompleteItemsModal] = useState<boolean>(false);
  const [requestModal, setRequestModal] = useState<boolean>(false);
  const [showDamageModal, setShowDamageModal] = useState<boolean>(false);
  return (
    <>
      <Space direction="vertical" style={styles.space}>
        <Card>
          <Row style={styles.actionBar}>
            <Space>
              <Button onClick={() => setCompleteItemsModal(true)}>
                Complete Items
              </Button>
              <Button onClick={() => setRequestModal(true)}>
                Request Items
              </Button>
              <Button onClick={() => setShowDamageModal(true)}>
                Damage Items
              </Button>
            </Space>

            <Segmented
              value={option}
              onChange={(value) => setOption(value)}
              options={options}
            />
          </Row>
        </Card>

        {option === "Production" ? <ProdutionItems /> : <PendingItems />}
      </Space>
      {completeItemsModal && (
        <CompleteItemsModal
          open={completeItemsModal}
          onCancel={() => setCompleteItemsModal(false)}
        />
      )}
      {showDamageModal && (
        <DamageItemsModal
          open={showDamageModal}
          onCancel={() => setShowDamageModal(false)}
        />
      )}
      {requestModal && (
        <RequestItemsModal
          open={requestModal}
          onCancel={() => setRequestModal(false)}
        />
      )}
    </>
  );
};

export default Production;

const styles = StyleSheet.create({
  space: {
    width: "100%",
  },
  actionBar: {
    justifyContent: "space-between",
  },
});
