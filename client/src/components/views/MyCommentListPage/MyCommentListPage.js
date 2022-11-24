import { Row, Typography, Card, Col, Avatar } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import moment from "moment";

const { Title } = Typography;
const { Meta } = Card;

function MyCommentListPage() {
    const [Video, setVideo] = useState([]);

    
    const param =  {userFrom : localStorage.getItem('userId') }
    console.log(" userFrom : ", param);
    useEffect(() => {
      Axios.post('/api/video/getSubscriptionVideoList', param)
        .then(res => {
            if(!res.data.success) {
                return alert("failed to load videos")
            }
            
            console.log("get Subscription Video List!", res.data);
            setVideo(res.data.videos);
        })
    }, [])

    const renderCards = Video.map((video, index) => {
        var minute = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minute * 60)

        return (
            <Col lg={6} md={8} xs={24}>
                <div style={{position: 'relative'}}>
                    <a href={`/video/${video._id}`}>
                        <img style={{width: '100%'}} src={`http://localhost:5000/${video.thumbnail}`} />
                        <div className='duration'>
                            <span>{minute} : {seconds}</span>
                        </div>
                    </a>
                </div>
                <br/>
                <Meta avatar={<Avatar src={video.writer.image}/>} title={video.title} description=""/>
                <span>{video.writer.name}</span>
                <span style={{ marginLeft: '3rem'}}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM do YY")}</span>
            </Col>
        );
    }) 

    return (
        <div style={{width: '85%', margin: '1rem'}}>
            <Title level={2}>
                My Comments
            </Title>
            <hr/>
            <Row gutter={[32, 16]}>
                
                {renderCards}
                

            </Row>
        </div>
    )
}

export default MyCommentListPage