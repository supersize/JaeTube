import React, { useEffect, useState } from 'react'
import { Tooltip } from "antd";
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import Axios from 'axios';
import { auth } from "../../../../_actions/user_actions";
import { useDispatch } from "react-redux";

function LikeDislikes(props) {
    const [Likes, setLikes] = useState(0);
    const [LikeAction, setLikeAction] = useState(null);
    const [Dislikes, setDislikes] = useState(0)
    const [DislikeAction, setDislikeAction] = useState(null);
    const dispatch = useDispatch();

    let likeDislike = {
        userId: localStorage.getItem('userId')
    }
    
    if (props.videoId) {
        likeDislike.videoId = props.videoId;
    }
    else if (props.commentId) {
        likeDislike.commentId = props.commentId;
    }

    useEffect(() => {

        Axios.post('/api/like/likes', likeDislike)
            .then(res => {
                if(!res.data.success) {
                    alert("failed to get likes");
                    return false;
                }

                // counting likes
                const likesCnt = res.data.likes.length;
                setLikes(likesCnt);

                // already liked or not
                res.data.likes.map(like => {
                    if (like.userId === likeDislike.userId) {
                        setLikeAction('liked')
                    }
                })
            });

        Axios.post('/api/like/dislikes', likeDislike)
            .then(res => {
                if(!res.data.success) {
                    alert("failed to get dislikes");
                    return false;
                }

                // counting likes
                const dislikesCnt = res.data.dislikes.length;
                setDislikes(dislikesCnt);

                // already disliked or not
                res.data.dislikes.map(dislike => {
                    if (dislike.userId === likeDislike.userId) {
                        setDislikeAction('disliked')
                    }
                })
            });
    }, [])

    const doLike = (e) => {
        
        dispatch(auth())
            .then(response => {
                if(!response.payload.isAuth){
                    alert("login is needed.");
                    return false;
                }
                if (!LikeAction) {
                    Axios.post('/api/like/upLike', likeDislike)
                        .then(res => {
                            if(!res.data.success) {
                                alert("failed to do a like");
                                return false;
                            }
        
                            setLikes(Likes + 1);
                            setLikeAction('liked');
        
                            if (DislikeAction) {
                                setDislikeAction(null);
                                setDislikes(Dislikes - 1);
                            }
                        })
                }
                else {
                    Axios.post('/api/like/unlike', likeDislike)
                        .then(res => {
                            if(!res.data.success) {
                                alert("failed to unlike");
                                return false;
                            }
        
                            setLikes(Likes - 1);
                            setLikeAction(null);
                        })
                }
            });
    }

    const doDislike = (e) => {
        dispatch(auth())
            .then(response => {
                if(!response.payload.isAuth){
                    alert("login is needed.");
                    return false;
                }
                if (!DislikeAction) {
                    Axios.post('/api/like/upDislike', likeDislike)
                        .then(res => {
                            if(!res.data.success) {
                                alert("failed to do a like");
                                return false;
                            }
        
                            setDislikes(Dislikes + 1);
                            setDislikeAction('disliked');
        
                            if (LikeAction) {
                                setLikeAction(null);
                                setLikes(Likes - 1);
                            }
                        })
                }
                else {
                    Axios.post('/api/like/unDislike', likeDislike)
                        .then(res => {
                            if(!res.data.success) {
                                alert("failed to unDislike");
                                return false;
                            }
        
                            setDislikes(Dislikes - 1);
                            setDislikeAction(null);
                        })
                }
            });
    }

  return (
    <div>
        <span key="comment-basic-like" style={{ paddingRight: '8px' }}>
            <Tooltip title="Like">
                <LikeOutlined theme={LikeAction === 'liked' ? 'filled' : 'outlined' }
                    onClick={doLike}  />
            </Tooltip>
            <span style={{ paddingLeft: "8px", cursor: 'auto'}}>{Likes}</span>
        </span>
        <span key="comment-basic-dislike" style={{ paddingRight: '8px' }}>
            <Tooltip title="Dislike">
                <DislikeOutlined theme={DislikeAction === 'disliked' ? 'filled' : 'outlined' }
                    onClick={doDislike}  />
            </Tooltip>
            <span style={{ paddingLeft: "8px", cursor: 'auto'}}>{Dislikes}</span>
        </span>

    </div>
  )
}

export default LikeDislikes