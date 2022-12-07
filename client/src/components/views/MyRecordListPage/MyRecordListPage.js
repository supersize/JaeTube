import { Row, Typography, Card, Col, Avatar } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import moment from "moment";

const { Title } = Typography;
const { Meta } = Card;

function MyRecordListPage() {
    const [Record, setRecord] = useState([]);
    
    const param =  {userId : localStorage.getItem('userId') }
    useEffect(() => {
      Axios.post('/api/record/getMyVideoViewedRecordList', param)
        .then(res => {
            if(!res.data.success) {
                return alert("failed to load records")
            }
            
            setRecord(res.data.recordList);
        })
    }, [])

    /*
    */
    const renderCards = Record.map((record, index) => {
        if (record.video == null) {
            return false;
        }
        var minute = Math.floor(record.video.duration / 60);
        var seconds = Math.floor(record.video.duration - minute * 60)

        return (
            <Col lg={6} md={8} xs={24}>
                <div style={{position: 'relative'}}>
                    <a href={`/video/${record.video._id}`}>
                        <img style={{width: '100%'}} src={`http://18.117.21.81:3001/${record.video.thumbnail}`} />
                        <div className='duration'>
                            <span>{minute} : {seconds}</span>
                        </div>
                    </a>
                </div>
                <br/>
                <Meta avatar={<Avatar src={record.video.writer.image}/>} title={record.video.title} description=""/>
                <span>{record.video.writer.name}</span>
                <span style={{ marginLeft: '3rem'}}>{record.video.views} views</span> - <span>{moment(record.video.updatedAt).format("MMM do YY")}</span>
            </Col>
        );
    }) 

    return (
        <div style={{width: '85%', margin: '1rem'}}>
            <Title level={2}>
                Record
            </Title>
            <hr/>
            <Row gutter={[32, 16]}>
                {renderCards}
            </Row>
        </div>
    )
}

export default MyRecordListPage