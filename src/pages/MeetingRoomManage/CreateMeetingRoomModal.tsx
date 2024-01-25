import { Form, Input, InputNumber, Modal, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { HttpStatusCode } from 'axios';
import { useCallback } from 'react';

import { meetingRoomApiInterface } from '@/api';
import { CreateMeetingRoomDto } from '@/api/autogen';

interface CreateMeetingRoomModalProps {
  isOpen: boolean;
  handleClose: Function;
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export interface CreateMeetingRoom {
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
}

const CreateMeetingRoomModal = (props: CreateMeetingRoomModalProps) => {
  const [form] = useForm<CreateMeetingRoomDto>();

  const handleOk = useCallback(async () => {
    const values = form.getFieldsValue();

    values.description = values.description || '';
    values.equipment = values.equipment || '';

    const res = await meetingRoomApiInterface.meetingRoomControllerCreate(values);

    if (res.status === HttpStatusCode.Ok) {
      message.success('创建成功');
      form.resetFields();
      props.handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal title="创建会议室" open={props.isOpen} onOk={handleOk} onCancel={() => props.handleClose()} okText={'创建'}>
      <Form form={form} colon={false} {...layout}>
        <Form.Item label="会议室名称" name="name" rules={[{ required: true, message: '请输入会议室名称!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="位置" name="location" rules={[{ required: true, message: '请输入会议室位置!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="容纳人数" name="capacity" rules={[{ required: true, message: '请输入会议室容量!' }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="设备" name="equipment">
          <Input />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateMeetingRoomModal;
