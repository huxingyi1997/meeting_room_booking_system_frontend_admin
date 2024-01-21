import { Outlet, useLocation } from 'react-router-dom';
import { Menu as AntdMenu, MenuProps } from 'antd';

import { router } from '../../App';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: '信息修改',
  },
  {
    key: '2',
    label: '密码修改',
  },
];

const handleMenuItemClick: MenuProps['onClick'] = info => {
  if (info.key === '1') {
    router.navigate('/user/info_modify');
  } else {
    router.navigate('/user/password_modify');
  }
};

const ModifyMenu = () => {
  const location = useLocation();

  return (
    <div id="menu-container" className="flex flex-row h-full">
      <div className="w-200">
        <AntdMenu
          defaultSelectedKeys={location.pathname === '/user/info_modify' ? ['1'] : ['2']}
          items={items}
          onClick={handleMenuItemClick}
          className="h-full"
        />
      </div>
      <div className="flex-1 p-5">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default ModifyMenu;
