import { Badge, Button, Form, Input, Popconfirm, Table, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useForm } from 'antd/es/form/Form';
import { HttpStatusCode } from 'axios';

import { meetingRoomApiInterface } from '@/api';
import { MeetingRoom } from '@/api/autogen';
import CreateMeetingRoomModal from './CreateMeetingRoomModal';
import UpdateMeetingRoomModal from './UpdateMeetingRoomModal';

interface SearchMeetingRoom {
  name: string;
  capacity: number;
  equipment: string;
}

const MeetingRoomManage = () => {
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [meetingRoomResult, setMeetingRoomResult] = useState<Array<MeetingRoom>>([]);
  const [num, setNum] = useState<number>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState<number>();

  const columns: ColumnsType<MeetingRoom> = useMemo(
    () => [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '容纳人数',
        dataIndex: 'capacity',
      },
      {
        title: '位置',
        dataIndex: 'location',
      },
      {
        title: '设备',
        dataIndex: 'equipment',
      },
      {
        title: '描述',
        dataIndex: 'description',
      },
      {
        title: '添加时间',
        dataIndex: 'createTime',
      },
      {
        title: '上次更新时间',
        dataIndex: 'updateTime',
      },
      {
        title: '预定状态',
        dataIndex: 'isBooked',
        render: (_, record) =>
          record.isBooked ? <Badge status="error">已被预订</Badge> : <Badge status="success">可预定</Badge>,
      },
      {
        title: '操作',
        render: (_, record) => (
          <div>
            <Popconfirm
              title="会议室删除"
              description="确认删除吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <button>删除</button>
            </Popconfirm>
            <br />
            <button
              onClick={() => {
                setUpdateId(record.id);
                setIsUpdateModalOpen(true);
              }}
            >
              更新
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleDelete = useCallback(async (id: number) => {
    try {
      await meetingRoomApiInterface.meetingRoomControllerDelete(id);
      message.success('删除成功');
      setNum(Math.random());
    } catch (e) {
      message.error('删除失败');
    }
  }, []);

  const searchMeetingRoom = useCallback(
    async (values: SearchMeetingRoom) => {
      const { name, capacity, equipment } = values;
      const res = await meetingRoomApiInterface.meetingRoomControllerList(
        pageNo,
        pageSize,
        name || undefined,
        capacity || undefined,
        equipment || undefined
      );

      const { data } = res.data;
      if (res.status === HttpStatusCode.Ok && data) {
        const { meetingRooms, totalCount } = data;
        setMeetingRoomResult(
          meetingRooms.map(item => {
            return {
              key: item.id,
              ...item,
            };
          })
        );
        setTotalCount(totalCount);
      }
    },
    [pageNo, pageSize]
  );

  const [form] = useForm();

  useEffect(() => {
    searchMeetingRoom({
      name: form.getFieldValue('name'),
      capacity: form.getFieldValue('capacity'),
      equipment: form.getFieldValue('equipment'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, pageSize, num]);

  const changePage = useCallback((pageNo: number, pageSize: number) => {
    setPageNo(pageNo);
    setPageSize(pageSize);
  }, []);

  return (
    <div id="meetingRoomManage-container" className="p-5">
      <div className="mb-10">
        <Form form={form} onFinish={searchMeetingRoom} name="search" layout="inline" colon={false}>
          <Form.Item label="会议室名称" name="name">
            <Input />
          </Form.Item>

          <Form.Item label="容纳人数" name="capacity">
            <Input />
          </Form.Item>

          <Form.Item label="设备" name="equipment">
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索会议室
            </Button>
            <Button type="primary" style={{ background: 'green' }} onClick={() => setIsCreateModalOpen(true)}>
              添加会议室
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="meetingRoomManage-table">
        <Table
          columns={columns}
          dataSource={meetingRoomResult}
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

      <CreateMeetingRoomModal
        isOpen={isCreateModalOpen}
        handleClose={() => {
          setIsCreateModalOpen(false);
          setNum(Math.random());
        }}
      ></CreateMeetingRoomModal>

      <UpdateMeetingRoomModal
        id={updateId!}
        isOpen={isUpdateModalOpen}
        handleClose={() => {
          setIsUpdateModalOpen(false);
          setNum(Math.random());
        }}
      ></UpdateMeetingRoomModal>
    </div>
  );
};

export default MeetingRoomManage;
