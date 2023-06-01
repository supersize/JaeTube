import Axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'
import { auth } from "../../../../_actions/user_actions";
import { useDispatch } from "react-redux";

function Comment(props) {
    const commentList = props.commentList;
    const user = useSelector(state => state.user )
    const [CommentValue, setCommentValue] = useState("")

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        dispatch(auth())
            .then(res => {
                if(!res.payload.isAuth) {
                    alert("login is needed.");
                    return false;
                }
                let comment = {
                    content: CommentValue,
                    writer: user.userData._id,
                    videoId: props.videoId
                }
        
                Axios.post('/api/comment/saveComment', comment)
                    .then((res) => {
                        if (!res.data.success) {
                            alert("failed to save your comment.")
                            return false;
                        }
        
                        console.log("success to comment : ", res.data.result)
                        props.renewComments(res.data.result);
                        setCommentValue("")
                    });
            })
    }


  return (
    <div>
        <br/>
        <p>comments</p>
        <hr/>
                            
        {commentList && commentList.map((comment, index) => {
            return (!comment.responseTo &&
                <React.Fragment key={index}>
                    <SingleComment renewComments={props.renewComments} comment={comment} />
                    <ReplyComment parentCmtId={comment._id} commentList={commentList} />
                </React.Fragment>
            )
        })}
        
        <form style={{ display: 'flex'}} onSubmit={onSubmit}>
            <textarea style={{ width: '100%', borderRadius: '5px' }}
                onChange={handleChange}
                value={CommentValue}
                placeholder="write your comment."
            />
            <br/>
            <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
        </form>

    </div>
  )
}

export default Comment