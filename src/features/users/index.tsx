import Table from '@components/Table';
import { DEFAULT_FILTERS } from '@configs/constants';
import { DEFAULT_ERROR_MESSAGE } from '@configs/constants/api.constants.ts';
import { PAGE_SIZES } from '@configs/index';
import { StyleSheet } from '@configs/stylesheet';
import { TCommonFilters } from '@configs/types/api.types.ts';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Flex, Input, Row, Space, TableProps, Tag } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import UserForm from './components/UserForm';
import { fetchUsers } from './services';

const { Search } = Input;
export type TUsers = {
  empId: string;
  name: string;
  mobile: string;
  role: string;
  status: boolean;
};

const columns: TableProps<any>['columns'] = [
  {
    title: 'Emp ID',
    dataIndex: 'empId',
    key: 'empId',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Mobile',
    dataIndex: 'mobile',
    key: 'mobile',
    responsive: ['md'],
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    responsive: ['md'],
    render: (_, { role }) => (
      <Flex style={styles.tagContainer}>
        {role?.map((type: any, i: number) => (
          <Tag className={'first-letter'} key={i}>
            {type}
          </Tag>
        ))}
      </Flex>
    ),
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: (_, { status, empId }) => (
      <div key={`user_status_${empId}`}>
        <Tag color={status ? 'green' : 'red'}>{status ? 'Active' : 'InActive'}</Tag>
      </div>
    ),
  },
];

const Users = () => {
  const [isLoading] = useState<boolean>(false);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<TUsers | null>(null);
  const [filters, setFilter] = useState<TCommonFilters>({ ...DEFAULT_FILTERS, limit: PAGE_SIZES.USERS });
  const toastApi = useToastApi();
  const {
    data: users,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ['users', filters.search, filters.page],
    queryFn: () => fetchUsers(filters),
  });
  useEffect(() => {
    if (userError) {
      toastApi.open({
        content: userError?.message || DEFAULT_ERROR_MESSAGE,
        type: 'error',
        duration: 4,
      });
    }
  }, [userError]);

  return (
    <Card>
      <Space style={styles.space} size={'middle'} direction="vertical">
        <Row style={styles.headerRow}>
          <Col>
            <Button onClick={() => setShowUserModal(true)}>New User</Button>
          </Col>
          <Col style={styles.search}>
            <Search
              placeholder="Search..."
              onSearch={(search) => setFilter((prev) => ({ ...prev, search }))}
              onChange={(e) => {
                if (isEmpty(e.target.value)) setFilter((prev) => ({ ...prev, search: null }));
              }}
              enterKeyHint="search"
              allowClear
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          loading={isLoading || userLoading}
          pagination={{
            pageSize: PAGE_SIZES.USERS,
          }}
          onRow={(record) => ({
            onClick: () => {
              setShowUserModal(true);
              setSelectedUser(record as TUsers);
            },
          })}
          rowKey={'empId'}
          dataSource={users?.records}
        />
        {showUserModal && (
          <UserForm
            user={selectedUser}
            visible={showUserModal}
            onCancel={() => {
              setShowUserModal(false);
              setSelectedUser(null);
            }}
            onInsertUser={() => {
              // setUsers([user, ...users]);
            }}
            onUpdateUser={() => {
              // const userIndex = findIndex(users, (item) => item.empId === user.empId);
              //
              // if (userIndex !== -1) {
              //   const updatedUsers = [...users.slice(0, userIndex), user, ...users.slice(userIndex + 1)];
              //   setUsers(updatedUsers);
              // }
            }}
          />
        )}
      </Space>
    </Card>
  );
};

export default Users;

const styles = StyleSheet.create({
  tagContainer: {
    flexWrap: 'wrap',
    gap: '8px',
  },
  search: {
    float: 'right',
  },
  space: { width: '100%' },
  headerRow: { justifyContent: 'space-between' },
});
