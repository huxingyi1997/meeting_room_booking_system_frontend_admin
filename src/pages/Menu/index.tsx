import { useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu as AntdMenu, MenuProps } from 'antd';

import { router } from '../../App';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: '会议室管理',
  },
  {
    key: '2',
    label: '预定管理',
  },
  {
    key: '3',
    label: '用户管理',
  },
  {
    key: '4',
    label: '统计',
  },
];

const handleMenuItemClick: MenuProps['onClick'] = info => {
  let path = '';
  switch (info.key) {
    case '1':
      path = '/meeting_room_manage';
      break;
    case '2':
      path = '/booking_manage';
      break;
    case '3':
      path = '/user_manage';
      break;
    case '4':
      path = '/statistics';
      break;
  }
  router.navigate(path);
};

const Menu = () => {
  const location = useLocation();

  const getSelectedKeys = useCallback(() => {
    if (location.pathname === '/user_manage') {
      return ['3'];
    } else if (location.pathname === '/booking_manage') {
      return ['2'];
    } else if (location.pathname === '/meeting_room_manage') {
      return ['1'];
    } else if (location.pathname === '/statistics') {
      return ['4'];
    } else {
      return ['1'];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="menu-container" className="flex flex-row h-full">
      <div className="w-200">
        <AntdMenu
          defaultSelectedKeys={getSelectedKeys()}
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

export default Menu;
