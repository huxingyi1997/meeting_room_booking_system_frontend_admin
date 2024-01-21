import { Button, Form, Input, message } from 'antd';
import { HttpStatusCode } from 'axios';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { userApiInterface } from '@/api';
import { LoginUserDto } from '@/api/autogen';

const layout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const Login = () => {
  const navigate = useNavigate();

  const onFinish = useCallback(async (user: LoginUserDto) => {
    const res = await userApiInterface.userControllerAdminLogin(user);

    const { data } = res.data;
    if (res.status === HttpStatusCode.Ok) {
      message.success('登录成功');
      const { accessToken, refreshToken, userInfo } = data!;
      localStorage.setItem('access_token', accessToken!);
      localStorage.setItem('refresh_token', refreshToken!);
      localStorage.setItem('user_info', JSON.stringify(userInfo));

      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="login-container" className="w-400 mt-100 mx-auto text-center">
      <h1>会议室预订系统</h1>
      <Form {...layout1} onFinish={onFinish} colon={false} autoComplete="off">
        <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码!' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item label=" ">
          <Button className="w-full" type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
