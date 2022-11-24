import Axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'

function Comment(props) {
    const commentList = props.commentList;
    const user = useSelector(state => state.user )
    const [CommentValue, setCommentValue] = useState("")
    console.log("comment user :", user);
    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        
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
    }


  return (
    <div>
        <br/>
        <p>Replies</p>
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