import { Row, Typography, Card, Col, Avatar } from 'antd';
import React, { useEffect, useState } from 'react'
import moment from "moment";

const { Title } = Typography;
const { Meta } = Card;

function SearchingVideoPage() {
    const [Video, setVideo] = useState([]);
    const [PageTitle, setPageTitle] = useState([]);

    // useEffect : dom이 최초 생성시 안에 코드가 실행됨.
    // 두번째 파라미터가 없다면 코드 계속실행됨. 그냥 빈칸이라면 최초 한번만 실행됨. 
    useEffect(() => {
        const searchKeyword = window.localStorage.getItem("searchKeyword");
        const searchedVideos = JSON.parse(window.localStorage.getItem("searchedVideos"));
        if (!searchKeyword && !searchedVideos) {
            setPageTitle("There is no result...")
            return;
        }



        setPageTitle("searched by '"+ searchKeyword +"'")
        setVideo(searchedVideos.videos);
    }, [])
    
    // console.log("ctxPath : ", location);

    const renderCards = Video.map((video, index) => {
        var minute = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minute * 60)
        return (
            <Col lg={6} md={10} xs={24}>
                <div style={{position: 'relative'}}>
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
                <span style={{ marginLeft: '3rem'}}>{video.views} views</span> - <span>{moment(video.updatedAt).format("MMM do YYYY")}</span>
            </Col>
        );
    }) 

    return (
        <div style={{width: '85%', margin: '1rem'}}>
            <Title level={2}>
                {PageTitle}
            </Title>
            <hr/>
            <Row gutter={[32, 16]}>
                {renderCards}
            </Row>
        </div>
    )
}

export default SearchingVideoPage
