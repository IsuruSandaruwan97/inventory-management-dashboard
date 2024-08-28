/** @format */

import Table from "@components/Table";
import { StyleSheet } from "@stylesheet";
import { TableProps, Tag } from "antd";
import { useState } from "react";
import findIndex from "lodash/findIndex";
import UserForm from "./components/UserForm";
import { PAGE_SIZES } from "@configs/index";
import { userData } from "@data/users";

export type TUsers = {
  empId: string;
  name: string;
  mobile: string;
  role: string;
  status: boolean;
};

const columns: TableProps<any>["columns"] = [
  {
    title: "Emp ID",
    dataIndex: "empId",
    key: "empId",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
    key: "mobile",
    responsive: ["md"],
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    responsive: ["md"],
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (_, { status, empId }) => (
      <div key={`user_status_${empId}`}>
        <Tag color={status ? "green" : "red"}>
          {status ? "Active" : "InActive"}
        </Tag>
      </div>
    ),
  },
];

const Users = () => {
  const [isLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<TUsers[]>(userData);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<TUsers | null>(null);
  return (
    <>
      <Table
        columns={columns}
        loading={isLoading}
        pagination={{
          pageSize: PAGE_SIZES.USERS,
        }}
        onRow={(record) => ({
          onClick: () => {
            setShowUserModal(true);
            setSelectedUser(record as TUsers);
          },
        })}
        rowKey={"empId"}
        dataSource={users}
      />
      {showUserModal && (
        <UserForm
          user={selectedUser}
          visible={showUserModal}
          onCancel={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          onInsertUser={(user) => {
            setUsers([user, ...users]);
          }}
          onUpdateUser={(user) => {
            const userIndex = findIndex(
              users,
              (item) => item.empId === user.empId
            );

            if (userIndex !== -1) {
              const updatedUsers = [
                ...users.slice(0, userIndex),
                user,
                ...users.slice(userIndex + 1),
              ];
              setUsers(updatedUsers);
            }
          }}
        />
      )}
    </>
  );
};

export default Users;

const styles = StyleSheet.create({
  searchRow: {
    float: "right",
    marginTop: 8,
    marginBottom: 8,
  },
});
