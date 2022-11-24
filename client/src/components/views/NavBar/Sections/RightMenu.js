import React from 'react';
import { Menu } from 'antd';
import { UserOutlined, SettingOutlined, LikeOutlined, LoginOutlined, LogoutOutlined, AuditOutlined } from '@ant-design/icons';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode='horizontal'>
        <Menu.SubMenu key="SubMenu" 
            icon={<UserOutlined />}>
          <Menu.Item key="login" icon={<LoginOutlined />}>
            <a  href='/login'>login</a>
          </Menu.Item>
          <Menu.Item key="signup" icon={<AuditOutlined/>}>
            <a  href="/register">Signup</a>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    )
  } else {
    return (
      <Menu mode="horizontal">
        <Menu.SubMenu key="SubMenu" 
            icon={<SettingOutlined />}>
          <Menu.ItemGroup title="My Info" 
              icon={<UserOutlined />}>
                <Menu.Item key="info" icon={<UserOutlined />}>
                  <a href='/user/changeInfo'>Change my info</a>
                </Menu.Item>
                {/* <Menu.Item key="like" icon={<LikeOutlined />}>
                  Like or Dislike
                </Menu.Item> */}
            </Menu.ItemGroup>
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            <a onClick={logoutHandler}>Logout</a>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    )
  }
}

export default withRouter(RightMenu);

