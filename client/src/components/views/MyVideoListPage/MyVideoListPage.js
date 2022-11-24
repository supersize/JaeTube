import { Row, Typography, Card, Col, Avatar } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import moment from "moment";
import { DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Meta } = Card;

function MyVideoListPage() {
    const [Video, setVideo] = useState([]);

    const param =  {userId : localStorage.getItem('userId') }
    console.log(" MyVideo ");
    useEffect(() => {
      Axios.post('/api/video/getMyVideos', param)
        .then(res => {
            if(!res.data.success) {
                return alert("failed to load videos")
            }
            
            console.log("get my Video List!", res.data);
            setVideo(res.data.videos);
        })
    }, [])

    const deleteVideo = (videoId, title) => {
        if (!window.confirm('Are you sure to remove this video?')) {
            return false;
        }
        const param = {_id : videoId}
        Axios.post('/api/video/remove', param)
            .then(res => {
                if(!res.data.success) {
                    return alert("failed to remove the video")
                }
                
                alert('"'+ title +'"is successfully removed!s');
                window.location.reload();
            })
    }

    const renderCards = Video.map((video, index) => {
        var minute = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minute * 60)

        return (
            <Col lg={6} md={8} xs={24}>
                <div style={{position: 'relative'}}>
                    <div className='delete-btn'><DeleteOutlined onClick={() => deleteVideo(video._id, video.title)}/></div>
                    <a href={`/video/${video._id}`}>
                        <img style={{width: '100%'}} src={`http://localhost:3001/${video.thumbnail}`} />
                        <div className='duration'>
                            <span>{minute} : {seconds}</span>
                        </div>
                    </a>
                </div>
                <br/>
                <Meta avatar={<Avatar src={video.writer.image}/>} title={video.title} description=""/>
                <span>{video.writer.name}</span>
                <span style={{ marginLeft: '3rem'}}>{video.views} views</span> - <span>{moment(video.updatedAt).format("MMM do YY")}</span>
            </Col>
        );
    }) 

    return (
        <div style={{width: '85%', margin: '1rem'}}>
            <Title level={2}>
                My Vdieo Page
            </Title>
            <hr/>
            <Row gutter={[32, 16]}>
                {renderCards}
            </Row>
        </div>
    )
}

export default MyVideoListPage