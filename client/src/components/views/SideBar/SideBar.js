import React from 'react';
import { Menu } from 'antd';
import { FolderOpenOutlined, DatabaseOutlined, PlaySquareOutlined, 
          CommentOutlined, UploadOutlined } from '@ant-design/icons';



function SideBar() {
  const items2 = 
    [
      {icon: FolderOpenOutlined, title: (<a href='/mySubscription/list'>Subscription</a>)}, 
      {icon: DatabaseOutlined, title: (<a href='/record/list'>Record</a>)},
      {icon: PlaySquareOutlined, title: (<a href='/myVideo/list'>My Videos</a>)},
      // {icon: CommentOutlined, title: (<a href='/comment/list'>My Comments</a>)},
      {icon: UploadOutlined, title: (<a href="/video/upload">Upload a video</a>)}
    ].map(
      (value, index) => {
        return {
          key: index + 1,
          icon: React.createElement(value.icon),
          label: value.title
        };
    },
  );
  

  return (
    <Menu
          mode="inline"
          style={{ height: '100%', borderRight: 0 }}
          items={items2}
        />
  )
}

export default SideBar