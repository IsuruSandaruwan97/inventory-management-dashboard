import { DownloadOutlined } from '@ant-design/icons';
import { DEFAULT_CURRENCY } from '@configs/index';
import { invoice_line_items } from '@data/stock/invoice_line_items';
import InvoiceTable from '@features/stock/components/InvoiceTable';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { formatCurrency } from '@utils/index';
import { Button, Card, Col, Flex, Form, Input, Modal, ModalProps, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import InvoiceLineItemForm from './forms/InvoiceLineItemForm';
import InvoicePdf from './pdf/invoicePdf';

type TInvoiceModalProps = {} & ModalProps;

const InvoiceModal = (props: TInvoiceModalProps) => {
  const [editItem, setEditItem] = useState<any>(null);
  const [form] = useForm();
  const dataSource = invoice_line_items;
  useEffect(() => {
    let subTotal = 0;
    dataSource.forEach((item) => {
      subTotal += item.unitPrice * item.quantity;
    });
    subTotal = parseFloat(formatCurrency(subTotal));
    form.setFieldsValue({
      subTotal,
      total: subTotal,
    });
  }, [dataSource, form]);

  const onValuesChange = (changeValues: any) => {
    if (Object.prototype.hasOwnProperty.call(changeValues, 'discount')) {
      const subTotal = form.getFieldValue('subTotal');
      form.setFieldsValue({ total: parseFloat(formatCurrency(subTotal - (subTotal * changeValues.discount) / 100)) });
    }
  };
  return (
    <Modal
      closeIcon
      title={'Invoice'}
      open={props.open}
      onClose={props.onClose}
      onCancel={props.onClose}
      style={{ minWidth: '80%' }}
      styles={{ content: { backgroundColor: '#f5f4f7' }, header: { backgroundColor: '#f5f4f7' } }}
      footer={false}
    >
      <Row gutter={8}>
        <Col xs={24} md={24} lg={18}>
          <Card>
            <InvoiceTable setEditItem={(value) => setEditItem(value)} dataSource={dataSource} />
            <Flex justify="flex-end" style={{ marginTop: 32 }}>
              <Form
                onValuesChange={onValuesChange}
                form={form}
                labelCol={{ md: 8 }}
                wrapperCol={{ md: 16 }}
                labelAlign="left"
              >
                <Form.Item label="Subtotal" name="subTotal">
                  <Input prefix={DEFAULT_CURRENCY} disabled type="number" style={{ textAlign: 'right' }} />
                </Form.Item>
                <Form.Item label="Discount (%)" name="discount">
                  <Input type="number" max={100} min={0} />
                </Form.Item>
                <Form.Item label="Total" name="total">
                  <Input prefix={DEFAULT_CURRENCY} disabled type="number" />
                </Form.Item>
              </Form>
            </Flex>

            <Flex justify="flex-end">
              <Button type="primary" icon={<DownloadOutlined />}>
                <PDFDownloadLink document={<InvoicePdf invoice={dataSource} />} fileName={'PDF_REPORT.pdf'}>
                  Save Invoice
                </PDFDownloadLink>
              </Button>
            </Flex>
          </Card>
        </Col>
        <Col lg={6}>
          <InvoiceLineItemForm editItem={editItem} />
        </Col>
      </Row>
    </Modal>
  );
};
export default InvoiceModal;
