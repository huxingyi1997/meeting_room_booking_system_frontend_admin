import { Button, Form, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect } from 'react';
import { HttpStatusCode } from 'axios';

import { userApiInterface } from '@/api';
import { UpdateUserDto } from '@/api/autogen';

import HeadPicUpload from './HeadPicUpload';

const layout1 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const InfoModify = () => {
  const [form] = useForm();

  const onFinish = useCallback(async (values: UpdateUserDto) => {
    const res = await userApiInterface.userControllerUpdate_2(values);
    if (res.status === HttpStatusCode.Ok) {
      message.success('用户信息更新成功');
    }
  }, []);

  const sendCaptcha = useCallback(async function () {
    const res = await userApiInterface.userControllerUpdateCaptcha();
    if (res.status === HttpStatusCode.Ok) {
      message.success(res.data.data);
    }
  }, []);

  useEffect(() => {
    async function query() {
      const res = await userApiInterface.userControllerInfo();

      const { data } = res.data;

      if (res.status === HttpStatusCode.Ok && data) {
        form.setFieldValue('headPic', data.headPic);
        form.setFieldValue('nickName', data.nickName);
        form.setFieldValue('email', data.email);
      }
    }
    query();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="updateInfo-container" className="w-400 mx-auto mt-50 text-center">
      <Form form={form} {...layout1} onFinish={onFinish} colon={false} autoComplete="off">
        <Form.Item label="头像" name="headPic" rules={[{ required: true, message: '请输入头像!' }]} shouldUpdate>
          <HeadPicUpload></HeadPicUpload>
        </Form.Item>

        <Form.Item label="昵称" name="nickName" rules={[{ required: true, message: '请输入昵称!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: '请输入邮箱!' },
            { type: 'email', message: '请输入合法邮箱地址!' },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <div className="flex justify-end">
          <Form.Item label="验证码" name="captcha" rules={[{ required: true, message: '请输入验证码!' }]}>
            <Input />
          </Form.Item>
          <Button type="primary" onClick={sendCaptcha}>
            发送验证码
          </Button>
        </div>

        <Form.Item {...layout1} label=" ">
          <Button className="w-full" type="primary" htmlType="submit">
            修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InfoModify;
