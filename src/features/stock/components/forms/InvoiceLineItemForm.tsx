import { DEFAULT_CURRENCY } from '@configs/index';
import { StyleSheet } from '@configs/stylesheet';
import { PRODUCTION_DATA } from '@data/production';
import { invoice_line_items } from '@data/stock/invoice_line_items';
import { formatCurrency } from '@utils/index';
import { Button, Card, Flex, Form, Input, Select, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';

type InvoiceLineItemFormProps = {
  editItem?: any;
};

const InvoiceLineItemForm = ({ editItem }: InvoiceLineItemFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [, setSelectedItem] = useState<any>(null);
  const [unitPrice, setUnitPrice] = useState<number>(0);

  const [form] = useForm();

  const getOptions = () => {
    return PRODUCTION_DATA.map((item) => {
      return { label: item.name, value: item.id, unitPrice: item.unitPrice };
    });
  };

  useEffect(() => {
    if (editItem) {
      editItem.amount = parseFloat(formatCurrency(editItem.quantity * editItem.unitPrice));
      form.setFieldsValue(editItem);
    }
  }, [editItem]);

  const onSubmit = () => {
    form
      .validateFields()
      .then(() => {
        if (editItem) {
          invoice_line_items[editItem.id] = form.getFieldsValue();
          form.resetFields();
          return;
        }
        invoice_line_items.push(form.getFieldsValue());
        setLoading(true);
        setTimeout(() => {
          form.resetFields();
          setLoading(false);
        });
      })

      .catch(() => {});
  };

  const onCancel = () => {};

  const onValueChange = (changeValues: any) => {
    if (Object.prototype.hasOwnProperty.call(changeValues, 'quantity')) {
      form.setFieldsValue({ amount: changeValues.quantity * unitPrice });
    }
    if (Object.prototype.hasOwnProperty.call(changeValues, 'itemName')) {
      form.setFieldsValue({
        unitPrice: formatCurrency(PRODUCTION_DATA.find((item) => item.id === changeValues.itemName)?.unitPrice || 0),
      });
    }
  };
  return (
    <Card>
      <Typography.Title level={5} style={{ margin: 0 }}>
        Add Item(s)
      </Typography.Title>
      <Form style={styles.form} onFinish={onSubmit} form={form} onValuesChange={onValueChange} layout="vertical">
        <Form.Item label="Item Name" name="itemName" rules={[{ required: true, message: 'Please select an Item!' }]}>
          <Select
            options={getOptions()}
            onSelect={(_, option) => {
              setSelectedItem(option);
              setUnitPrice(option.unitPrice);
            }}
          />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea placeholder="Enter Description" maxLength={100} />
        </Form.Item>
        <Flex gap={8}>
          <Form.Item label="Unit Price" name="unitPrice">
            <Input
              prefix={DEFAULT_CURRENCY}
              disabled={isEmpty(form.getFieldValue('itemName'))}
              value={formatCurrency(unitPrice || 0)?.toString() || '0'}
            />
          </Form.Item>
          <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: 'Please enter quantity!' }]}>
            <Input placeholder="Enter Quantity" type="number" />
          </Form.Item>
        </Flex>

        <Form.Item label="Amount" name="amount">
          <Input prefix={DEFAULT_CURRENCY} disabled type="number" style={styles.fullWidth} />
        </Form.Item>
        <Flex justify="end" gap={8}>
          <Form.Item>
            <Button type="default" onClick={onCancel} loading={loading} htmlType="reset">
              Cancel
            </Button>
          </Form.Item>

          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </Card>
  );
};
export default InvoiceLineItemForm;
const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  form: {
    width: '100%',
    marginTop: 16,
  },
  formButton: {
    marginBottom: '4px',
  },
});
