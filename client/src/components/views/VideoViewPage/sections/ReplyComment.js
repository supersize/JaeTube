import React, { useState, useEffect } from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {
    const commentList = props.commentList;
    const parentCmtId = props.parentCmtId;
    const [CommentCnt, setCommentCnt] = useState(0)
    const [OpenReplyComment, setOpenReplyComment] = useState(false)

    let commentCnt = 0;

    useEffect(() => {
      commentList.map(comment => {
        if (comment.responseTo === props.parentCmtId) {
            commentCnt++;
        }
      })

      setCommentCnt(commentCnt);
    }, [commentList]) // "commentList" in the last parameter means useEffect should be restarted when "commentList" has got changed.
    
    
    const renderReplyComment = (parentCmtId) => 
        commentList.map((comment, index) => {
            return (
                <React.Fragment>
                    {comment.responseTo === parentCmtId && 
                        <div key={index} style={{ width: '80%', marginLeft: '40px' }} >
                            <SingleComment renewComments={props.renewComments} comment={comment} />
                        </div>
                    }
                </React.Fragment>
            )
        })
    

    const onHandleChange = (e) => {
        e.preventDefault();
        setOpenReplyComment(!OpenReplyComment)
    }

  return (
    <div>  
        {CommentCnt > 0 &&
            <a onClick={onHandleChange} style={{ fontSize: '14px', margin: 0, color: 'gray' }} >
                View {CommentCnt} more comments
            </a>
        }
        
        {OpenReplyComment && 
            renderReplyComment(parentCmtId)
        }
    </div>
  )
}

export default ReplyComment