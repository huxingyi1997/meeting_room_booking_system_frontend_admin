import { Badge, Button, Form, Image, Input, Table, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useForm } from 'antd/es/form/Form';
import { HttpStatusCode } from 'axios';

import { userApiInterface } from '@/api';
import { UserDetailVo } from '@/api/autogen';

interface SearchUser {
  username: string;
  nickName: string;
  email: string;
}

interface UserSearchResult extends UserDetailVo {
  key: string;
}

const UserManage = () => {
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [userResult, setUserResult] = useState<UserSearchResult[]>();
  const [num, setNum] = useState(0);

  const columns: ColumnsType<UserSearchResult> = useMemo(
    () => [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '头像',
        dataIndex: 'headPic',
        render: value => {
          return value ? <Image width={50} src={value} /> : '';
        },
      },
      {
        title: '昵称',
        dataIndex: 'nickName',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '注册时间',
        dataIndex: 'createTime',
      },
      {
        title: '状态',
        dataIndex: 'isFrozen',
        render: (_, record) => (record.isFrozen ? <Badge status="success">已冻结</Badge> : ''),
      },
      {
        title: '操作',
        render: (_, record) => (
          <button
            onClick={() => {
              freezeUser(record.id);
            }}
          >
            冻结
          </button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const freezeUser = useCallback(async (id: number) => {
    const res = await userApiInterface.userControllerFreeze(id);

    if (res.status === HttpStatusCode.Ok) {
      message.success('冻结成功');
      setNum(Math.random());
    }
  }, []);

  const searchUser = useCallback(
    async (searchUser: SearchUser) => {
      const { email, username, nickName } = searchUser;

      const res = await userApiInterface.userControllerList(
        pageNo,
        pageSize,
        email || undefined,
        username || undefined,
        nickName || undefined
      );

      const { data } = res.data;
      if (res.status === HttpStatusCode.Ok && data) {
        const { users, totalCount } = data;
        setUserResult(
          users.map((item: UserDetailVo) => {
            return {
              key: item.username,
              ...item,
            };
          })
        );
        setTotalCount(totalCount);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [pageNo, pageSize]
  );

  const [form] = useForm();

  useEffect(() => {
    searchUser({
      username: form.getFieldValue('username'),
      email: form.getFieldValue('email'),
      nickName: form.getFieldValue('nickName'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, pageSize, num]);

  const changePage = useCallback((pageNo: number, pageSize: number) => {
    setPageNo(pageNo);
    setPageSize(pageSize);
  }, []);

  return (
    <div id="userManage-container" className="p-5">
      <div className="mb-10">
        <Form form={form} onFinish={searchUser} name="search" layout="inline" colon={false}>
          <Form.Item label="用户名" name="username">
            <Input />
          </Form.Item>

          <Form.Item label="昵称" name="nickName">
            <Input />
          </Form.Item>

          <Form.Item label="邮箱" name="email" rules={[{ type: 'email', message: '请输入合法邮箱地址!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索用户
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="userManage-table">
        <Table
          columns={columns}
          dataSource={userResult}
          pagination={{
            showSizeChanger: true,
            current: pageNo,
            pageSize: pageSize,
            onChange: changePage,
            pageSizeOptions: [10, 20, 50],
            total: totalCount,
          }}
        />
      </div>
    </div>
  );
};

export default UserManage;
