import { DEFAULT_FILTERS } from '@configs/constants';
import { DEFAULT_ERROR_MESSAGE, DEFAULT_SUCCESS_MESSAGE } from '@configs/constants/api.constants.ts';
import { queryClient } from '@configs/react-query.config.ts';
import { StyleSheet } from '@configs/stylesheet';
import { TCompleteItems } from '@configs/types/api.types.ts';
import { fetchCategories } from '@features/configurations/categories/services';
import { completeItems } from '@features/production/services';
import { TStockData } from '@features/stock/Inventory.tsx';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { fetchStockItems } from '@services';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Flex, Form, InputNumber, Modal, Row, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ModalProps } from 'antd/es/modal/interface';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useMemo, useState } from 'react';

type FormSubmitTypes = 'more' | 'submit';
type TCompleteItemsModal = {
  onCancel: () => void;
} & ModalProps;

const getItemObject = (records: TStockData[] | undefined) => {
  const data: any = {
    bottle: [],
    lid: [],
    label: [],
    maxQuantity: records && records[0]?.quantity,
  };
  records?.forEach((record) => {
    if (record.type) {
      if (data.maxQuantity > record.quantity) data.maxQuantity = record.quantity;
      data[record.type]?.push({
        label: record.name,
        value: record.id,
        type: record.type,
        quantity: record.quantity,
      });
    }
  });

  return data;
};

const CompleteItemsModal = ({ onCancel, ...others }: TCompleteItemsModal) => {
  const [form] = useForm();
  const toastApi = useToastApi();
  const [category, setCategory] = useState<number | null>(null);

  const { data: stockItems, isLoading: stockItemLoading } = useQuery({
    queryKey: ['production-items', category],
    queryFn: () => fetchStockItems({ ...DEFAULT_FILTERS, category }, 'production'),
    enabled: !!category,
  });
  const {
    data: categories,
    isLoading: categoriesIsLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  });

  const mutation = useMutation({
    mutationFn: (payload: TCompleteItems) => completeItems(payload),
    onSuccess: async (response: any, variables: any) => {
      const { type } = variables;
      toastApi.open({
        type: 'success',
        content: response?.message || DEFAULT_SUCCESS_MESSAGE,
        duration: 4,
      });
      if (type === 'submit') onCancelForm();
      else {
        form.resetFields();
        setCategory(null);
      }
      await queryClient.invalidateQueries({ queryKey: ['production-items'] });
    },
    onError: (error) => {
      toastApi.open({
        type: 'error',
        content: error.message || DEFAULT_ERROR_MESSAGE,
        duration: 4,
      });
    },
  });

  useEffect(() => {
    if (categoriesError) {
      toastApi.open({
        content: categoriesError?.message || DEFAULT_ERROR_MESSAGE,
        type: 'error',
        duration: 4,
      });
    }
  }, [categoriesError]);

  useEffect(() => {
    if (category && isEmpty(stockItems?.records)) {
      toastApi.open({
        content: 'No items for selected category in production!!',
        type: 'warning',
        duration: 4,
      });
    }
  }, [category, stockItems]);

  const onCancelForm = () => {
    form.resetFields();
    setCategory(null);
    onCancel();
  };

  const itemList = useMemo(() => {
    const data = getItemObject(stockItems?.records);
    if (!category) {
      form.resetFields();
      return data;
    }
    if (data?.bottle?.length === 1) form.setFieldValue('bottle', data.bottle[0].value);
    if (data?.lid?.length === 1) form.setFieldValue('lid', data.lid[0].value);
    if (data?.label?.length === 1) form.setFieldValue('label', data.label[0].value);
    return data;
  }, [stockItems?.records, form, category]);

  const onChangeFields = (values: any) => {
    if (Object.prototype.hasOwnProperty.call(values, 'item')) {
      form.resetFields(['lid', 'label', 'bottle']);
    }
  };

  const onSubmitForm = (type: FormSubmitTypes) => {
    const values = form.getFieldsValue();
    mutation.mutate({ ...values, type });
  };

  return (
    <>
      <Modal
        loading={categoriesIsLoading || stockItemLoading}
        footer={null}
        title={'Complete Item(s)'}
        onCancel={() => onCancelForm()}
        onClose={() => onCancelForm()}
        style={styles.modal}
        {...others}
      >
        <Row gutter={8}>
          <Col xs={24} md={24} lg={24}>
            <Card style={styles.cardContainer}>
              <Form
                layout={'vertical'}
                form={form}
                style={styles.form}
                onFinish={() => {}}
                onValuesChange={onChangeFields}
              >
                <Form.Item label="Item" name="item" rules={[{ required: true, message: 'Please select an Item!' }]}>
                  <Select
                    placeholder="Select Item"
                    onChange={(value) => setCategory(value)}
                    style={styles.fullWidth}
                    options={categories?.map((item) => ({ label: item.name, value: item.id }))}
                  />
                </Form.Item>
                <Form.Item label="Bottle" name="bottle" rules={[{ required: true, message: 'Please select an Item!' }]}>
                  <Select
                    disabled={!category || isEmpty(stockItems?.records) || isEmpty(itemList?.bottle)}
                    placeholder="Select Bottle"
                    style={styles.fullWidth}
                    options={itemList?.bottle || []}
                  />
                </Form.Item>
                <Form.Item label="Label" name="label" rules={[{ required: true, message: 'Please select an Item!' }]}>
                  <Select
                    placeholder="Select Label"
                    style={styles.fullWidth}
                    disabled={!category || isEmpty(stockItems?.records) || isEmpty(itemList?.label)}
                    options={itemList.label || []}
                  />
                </Form.Item>
                <Form.Item label="Lid" name="lid" rules={[{ required: true, message: 'Please select an Item!' }]}>
                  <Select
                    placeholder="Select Lid"
                    style={styles.fullWidth}
                    disabled={!category || isEmpty(stockItems?.records) || isEmpty(itemList?.lid)}
                    options={itemList.lid || []}
                  />
                </Form.Item>
                <Form.Item
                  label="Quantity"
                  name="quantity"
                  rules={[
                    { required: true, message: 'Please select Quantity!' },
                    {
                      ...(category && {
                        type: 'number',
                        min: 0,
                        max: itemList.maxQuantity,
                        transform: (value) => Number(value),
                        message: `Maximum amount is ${itemList.maxQuantity}`,
                      }),
                    },
                  ]}
                >
                  <InputNumber
                    disabled={!category || isEmpty(stockItems?.records)}
                    placeholder="Quantity"
                    type="number"
                    style={styles.fullWidth}
                  />
                </Form.Item>
                <Flex justify="end" gap={8}>
                  <Form.Item style={styles.formButton}>
                    <Button type="default" onClick={onCancel} loading={mutation.isPending}>
                      Cancel
                    </Button>
                  </Form.Item>

                  <Form.Item style={styles.formButton}>
                    <Button
                      loading={mutation.isPending}
                      type="primary"
                      htmlType="submit"
                      onClick={() => {
                        form
                          .validateFields()
                          .then(() => {
                            onSubmitForm('more');
                          })
                          .catch(() => {});
                      }}
                    >
                      Add more
                    </Button>
                  </Form.Item>
                  <Form.Item style={styles.formButton}>
                    <Button
                      loading={mutation.isPending}
                      type="primary"
                      htmlType="submit"
                      onClick={() => {
                        form
                          .validateFields()
                          .then(() => {
                            onSubmitForm('submit');
                          })
                          .catch(() => {});
                      }}
                    >
                      Submit
                    </Button>
                  </Form.Item>
                </Flex>
              </Form>
            </Card>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default CompleteItemsModal;

const styles = StyleSheet.create({
  modal: {},
  actionButtonContainer: {
    justifyContent: 'center',
    display: 'flex',
  },
  fullWidth: {
    width: '100%',
  },
  form: {
    width: '100%',
  },
  formButton: {
    marginBottom: '4px',
  },
  cardContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  formTitle: {
    marginTop: 0,
    marginBottom: '10px',
  },
});
