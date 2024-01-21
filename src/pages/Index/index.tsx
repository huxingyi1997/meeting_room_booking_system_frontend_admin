import { UserOutlined } from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';

const Index = () => {
  return (
    <div id="index-container" className="h-screen flex flex-col">
      <div className="h-20 border-b border-solid border-gray-300 flex items-center justify-between px-5">
        <Link to="/" className="no-underline text-black">
          <h1 className="m-0 text-4xl">会议室预定系统-后台管理</h1>
        </Link>
        <Link to="/user/info_modify">
          <UserOutlined className="text-4xl" />
        </Link>
      </div>
      <div className="flex-grow border-b border-solid border-gray-300">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Index;
