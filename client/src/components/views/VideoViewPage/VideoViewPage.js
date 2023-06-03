import React, {useEffect, useState} from 'react'
import { Row, Col, List, Avatar } from "antd";
import Axios from 'axios';
import SideVideo from './sections/SideVideo';
import Subscribe from './sections/Subscribe';
import Comment from './sections/Comment';
import LikeDislikes from './sections/LikeDislikes';
import {useSelector} from 'react-redux'

function VideoViewPage(props) {
    const user = useSelector(state => state.user );
    
    const [Video, setVideo] = useState([])
    const [CommentList, setCommentList] = useState([])

    const video = {
        videoId: props.match.params.videoId
    }

    useEffect(() => {
        // getting video info
        Axios.post('/api/video/getVideo', video)
            .then(res => {
                if(!res.data.success) {
                    return alert("failed to find video");
                }
                setVideo(res.data.video)
            })

        // getting commentList
        Axios.post('/api/comment/commentList', video)
            .then((res) => {
                if(!res.data.success) {
                    return alert("failed to get a comment List");
                }
    
                setCommentList(res.data.commentList)
            })

        // add record
        if (user.userData) {
            let id = user.userData._id;
            if (id) {
                const record = {
                    viewerId : id,
                    video : props.match.params.videoId
                }
                Axios.post('/api/record/saveRecord', record)
                    .then((res) => {
                        if(!res.data.success) {
                            console.log("res.data : ", res);
                            alert(res);
                            return alert("failed to save a record");
                        }
        
                        alert("record saved!")
            
                    })
            }
        }
        
    }, [user])

    // renew commentList when a new comment is submited. 
    const renewComments = (newComment) => {
        setCommentList(CommentList.concat(newComment))
    }
    
    if(Video.writer) {
        const subscribeButton =
            Video.writer._id !== localStorage.getItem('userId') && <Subscribe props={props} userTo={Video.writer._id} userFrom={localStorage.getItem('userId')} />

        return (
                <Row gutter={[16, 16]}>
                    <Col lg={18} xs={24}>
                        <div style={{ width: '100%', padding: '3rem 4rem'}}>
                            <video style={{ width: '100%', height: '50vh'}} src={`http://18.117.21.81:8000/${Video.filePath}`} controls/>
                            {/* <video style={{ width: '100%', height: '50vh'}} src={`http://localhost:5001/${Video.filePath}`} controls/> */}
                            <List.Item
                                actions={[ <LikeDislikes videoId={video.videoId} />, subscribeButton]}>
                                    <List.Item.Meta 
                                        avatar={<Avatar src={Video.writer.image}/>}
                                        title={Video.writer.name}
                                        description={Video.description}
                                        />
                            </List.Item>
                            <Comment commentList={CommentList} videoId={video.videoId} renewComments={renewComments} />
                        </div>
                    </Col>
                    <Col lg={6} xs={24}>
                        <SideVideo videoId={video.videoId}/>
                    </Col>
                </Row>

            )
    }
    else {
        return(<div>... Loading</div>)
    }
}

export default VideoViewPage