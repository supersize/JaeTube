import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Comment, Button, Input, Avatar } from "antd";
import Axios from 'axios';
import LikeDislikes from './LikeDislikes';
import { auth } from "../../../../_actions/user_actions";
import { useDispatch } from "react-redux";

const { TextArea } = Input;

function SingleComment(props) {
    const [OpenReply, setOpenReply] = useState(false)
    const user = useSelector(state => state.user )
    const [CommentValue, setCommentValue] = useState("")
    const dispatch = useDispatch();

    const onClickReplyOpen = (e) => {
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (e) => {
        e.preventDefault();

        setCommentValue(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        dispatch(auth())
            .then(res => {
                if(!res.payload.isAuth){
                    alert("login is needed.");
                    return false;
                }
                
                let comment = {
                    content: CommentValue,
                    writer: user.userData._id,
                    videoId: props.comment.videoId,
                    responseTo: props.comment._id
                }
        
                Axios.post('/api/comment/saveComment', comment)
                    .then((res) => {
                        if (!res.data.success) {
                            alert("failed to save your comment.")
                            return false;
                        }
        
                        props.renewComments(res.data.result);
                        setCommentValue("")
                        setOpenReply(false)
                    });
            })

    }

    const actions = [
        <LikeDislikes commentId={props.comment._id} />,
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]

  return (
    <div>
        <Comment 
            actions={actions}
            author={props.comment.writer.name}
            avatar={<Avatar src={props.comment.writer.image} alt=''/>}
            content ={<p>{props.comment.content}</p>}
        />

        {OpenReply &&
            <form style={{ display: 'flex', padding: '0 0 20px 20px'}} onSubmit={onSubmit}>
                <textarea style={{ width: '100%', borderRadius: '5px' }}
                    onChange={onHandleChange}
                    value={CommentValue}
                    placeholder={`reply to @${props.comment.writer.name}.`}
                />
                <br/>
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>
        }
    </div>
  )
}

export default SingleComment