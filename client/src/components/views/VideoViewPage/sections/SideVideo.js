import React, {useEffect, useState} from 'react'
import Axios from 'axios';

function SideVideo(props) {
    const [SideVideos, setSideVideos] = useState([])

    useEffect(() => {
        let targetVideo = {
            videoId : props.videoId
        }
        Axios.get('/api/video/getVideos', {params : {videoId : props.videoId}})
          .then(res => {
              if(!res.data.success) {
                  return alert("failed to load videos")
              }
              
              setSideVideos(res.data.videos);
          })
      }, [])
    
      const renderSideVideo = SideVideos.map((SideVideo, index) => {
        var minute = Math.floor(SideVideo.duration / 60);
        var seconds = Math.floor(SideVideo.duration - minute * 60)
        
        return (
            <a href={`/video/${SideVideo._id}`} key={index}> {/* key는 에러나서 index 값줌. */}
                <div key={index} style={{ display: 'flex', marginBottom: "1rem", padding: '0.2rem' }}>
                    <div style={{ width: '40%', marginRight: "1rem"}}>
                            <img style={{ width: '100%', height: '100%'}} src={`http://18.117.21.81:3001/${SideVideo.thumbnail}`} />
                            {/* <img style={{ width: '100%', height: '100%'}} src={`http://localhost:5001/${SideVideo.thumbnail}`} /> */}
                    </div>

                    <div style={{ width: "50%" }}>
                        {/* <a href="#" style={{color: 'gray'}}> */}
                            <span style={{ fontSize: '1rem', color: 'black'}}>
                                {SideVideo.title}
                            </span><br/>
                            <span style={{color: 'gray'}}>{SideVideo.writer.name}</span><br/>
                            <span style={{color: 'gray'}}>{SideVideo.views} views</span><br/>
                            <span style={{color: 'gray'}}>{minute} : {seconds}</span>
                        {/* </a> */}
                    </div>
                </div>
            </a>
        )
      });

  return (
    <React.Fragment>
        <div style={{ marginTop: '3rem'}}/>

        {renderSideVideo}
    </React.Fragment>
  )
}

export default SideVideo