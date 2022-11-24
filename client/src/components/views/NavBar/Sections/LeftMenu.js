import React from 'react';
import { Typography, Input } from 'antd';
import { YoutubeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link } from 'react-router-dom'

const qs = require('qs');
const { Search } = Input;
const { Title } = Typography; 

function LeftMenu(props) {
  const onSearch = (values) => {
    axios.get('/api/video/search', {
        params : {keywords: values}})
      .then(res => {
        if(!res.data.success) {
            return alert("failed to load videos")
        }
  
        window.localStorage.setItem('searchKeyword', values);
        window.localStorage.setItem('searchedVideos', JSON.stringify(res.data));
        window.location.href="/searchVideo";
        
      })
  }

  return (
    <div style={{display : 'inline-block', width: '80%'}}>
      <div style={{ minWidth: '200px', float : 'left', fontSize: '20px', padding: '19px 20px' }}>
        <a href="/">
          <Title level={2} type={"danger"}>
            <YoutubeOutlined />
            <span style={{ color: 'black', paddingLeft: '4px'}}>JaeTube</span>
          </Title>
        </a>
      </div> 
      <div style={{padding: '20px 0px 0px 15px', display: 'inline-block', width: '50%'}}>
        <Search
          placeholder="input search text"
          allowClear
          onSearch={onSearch}
        />
      </div>   
    </div>
  )
}

export default LeftMenu