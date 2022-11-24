import { Row, Typography, Card, Col, Avatar, Tabs } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import moment from "moment";

const { Title } = Typography;
const { Meta } = Card;

function MySubscriptionListpage() {
    const [Channel, setChannel] = useState([]);

    const param =  {userFrom : localStorage.getItem('userId') }
    useEffect(() => {
      Axios.post('/api/video/getSubscriptionVideoList', param)
        .then(res => {
            if(!res.data.success) {
                return console.log("failed to load videos")
            }
            
            setChannel(res.data.channels);
        })
    }, [])

    return (
        <div style={{width: '85%', margin: '1rem'}}>
            <Title level={2}>
                My subscribing Channel
            </Title>
            <hr/>
            
                <Tabs
                    defaultActiveKey="1"
                    tabPosition="left"
                    style={{ height: "75vh" }}
                    items={
                        Channel.map((channel, index) => {
                            const writerCard = 
                                <div style={{display: 'flex'}}>
                                    <Meta avatar={<Avatar src={channel.userTo.image}/>} />
                                    <span>{channel.userTo.name}</span>
                                </div>;

                            const videoCards = channel.videos.map((video, index) => {
                                var minute = Math.floor(video.duration / 60);
                                var seconds = Math.floor(video.duration - minute * 60)

                                return (
                                    <Col lg={6} md={8} xs={24}>
                                        <div style={{position: 'relative'}}>
                                            <a href={`/video/${video._id}`}>
                                                <img style={{width: '100%'}} src={`http://localhost:3001/${video.thumbnail}`} />
                                                <div className='duration'>
                                                    <span>{minute} : {seconds}</span>
                                                </div>
                                            </a>
                                        </div>
                                        <br/>
                                        <Meta avatar={<Avatar src={channel.userTo.image}/>} title={video.title} description=""/>
                                        <span>{channel.userTo.name}</span>
                                        <span style={{ marginLeft: '3rem'}}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM do YY")}</span>
                                    </Col>
                                );
                            })
                            return {
                                // label: video.writer.name,
                                label: writerCard,
                                key: channel.userTo.name,
                                children : <Row gutter={[32, 16]}>{videoCards}</Row>
                            };
                    }) 
                
                    }
                />
        </div>
    )
}

export default MySubscriptionListpage