import React, { useState } from "react";
// rfce 입력시 자동 생성됨.
import {Typography, Button, Form, message, Input, Upload} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Dropzone from 'react-dropzone';
import Axios from "axios";
import {useSelector} from 'react-redux'

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    {value: 0, label: "Private"},
    {value: 1, label: "Public"}
]

const CategoryOptions = [
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Autos & Vehicles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets & Animals"},
    {value: 4, label: "Sports"},
    {value: "etc", label: "ETC"}
]


function VideoUploadPage(props) {
    const user = useSelector(state => state.user);

    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Animation")
    const [ThumbnailPath, setThumbnailPath] = useState("")
    
    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value);
    }
    
    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value);
    }
    
    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value);
    }
    
    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value);
    }
    
    let form = document.uploadVideoForm;

    const clickFileDiv = () => {
        form.file.click();
    }

    const changeFile = async (event) => {
        let file = event.target.files[0];

        function getVideoCover(file, seekTo = 0.0) {
            // file validation
            if (file.type !== 'video/mp4') {
                alert('only mp4 is allowed');        
                return false;    
            }

            // console.log("getting video cover for file: ", file);
            return new Promise((resolve, reject) => {
                // load the file to a video player
                const videoPlayer = document.createElement('video');
                videoPlayer.setAttribute('src', URL.createObjectURL(file));
                videoPlayer.load();
                videoPlayer.addEventListener('error', (ex) => {
                    reject("error when loading video file", ex);
                });
                // load metadata of the video to get video duration and dimensions
                videoPlayer.addEventListener('loadedmetadata', () => {
                    // seek to user defined timestamp (in seconds) if possible
                    if (videoPlayer.duration < seekTo) {
                        reject("video is too short.");
                        return;
                    }
                    // delay seeking or else 'seeked' event won't fire on Safari
                    setTimeout(() => {
                      videoPlayer.currentTime = seekTo;
                    }, 200);
                    // extract video thumbnail once seeking is complete
                    videoPlayer.addEventListener('seeked', () => {
                        console.log('video is now paused at %ss.', seekTo);
                        // define a canvas to have the same dimension as the video
                        const canvas = document.createElement("canvas");
                        canvas.width = videoPlayer.videoWidth;
                        canvas.height = videoPlayer.videoHeight;
                        // draw the video frame to canvas
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
                        // return the canvas image as a blob
                        ctx.canvas.toBlob(
                            blob => {
                                resolve(blob);
                            },
                            "image/png",
                            0.75 /* quality */
                        );
                    });
                });
            });
        }

        try {
            // get the frame at 1.5 seconds of the video file
            const cover = await getVideoCover(file, 2.5);
            let thumbnailImg = document.getElementsByTagName("img")[0]
            thumbnailImg.src = URL.createObjectURL(cover);
            thumbnailImg.style.display ='inline';
            
        } catch (ex) {
            console.log("ERROR: ", ex);
        }
    }
    
    const onSubmit = (e) => {
        e.preventDefault();

        alert('sorry, "video submit" is not available on production mode. Server cannot handle it.');
        return false;

        if (!form.file) {
            alert("Please upload a video.");
            return false;
        }

        let file = form.file;
        const maxSize = 5 * 1024 * 1024;
        const fileSize = file.size;
        if (fileSize > maxSize) {
            alert("Please upload file under 5MB");
            return false;
        }

        if (!form.title.value.trim()) {
            alert("Please write title of your video.");
            return false;
        }

        if (!form.description.value.trim()) {
            alert("Please write the description of your video.");
            return false;
        }

        if (!form.category.value) {
            alert("Please select the category of your video.");
            return false;
        }

        // return false;

        let formData = new FormData;
        const config = {
            header : {'Content-Type' : 'multipart/form-data'}
        }
        formData.append("file", form.file.files[0])

        Axios.post('/api/video/uploadfiles', formData, config)
            .then((res) => {
                if (res.data.success) {
                    let variable = {
                        url : res.data.url,
                        fileName: res.data.fileName
                    }

                    Axios.post('/api/video/thumbnail', variable )
                        .then(res => {
                            if(res.data.success) {
                                const video = {
                                    writer : user.userData._id,
                                    title: VideoTitle,
                                    description: Description,
                                    privacy: form.privacy.value,
                                    filePath: variable.url,
                                    category: Category,
                                    duration: res.data.fileDuration,
                                    thumbnail: res.data.url
                                }
                        
                                Axios.post('/api/video/uploadVideo', video)
                                    .then(res => {
                                        if(res.data.success) {
                                            message.success("uploaded successfully.");
                        
                                            setTimeout(() => {
                                                props.history.push('/');
                                            }, 1500);
                                        }
                                        else {
                                            alert("failed to upload video");
                                        }
                                    })
                            }
                            else {
                                alert("filed uploading thumbnail.")
                            }
                        })
                } 
                else {
                    alert("failed to upload the video")
                }
            })
    }
    
    return (
        <div style={{maxWidth: '700px', margin: '1rem'}}>
            <div style={{textAlign: 'center ', marginBottom: '1rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>

            <form name="uploadVideoForm" onSubmit={onSubmit} encType="multipart/form-data" >
                <div style={{ display:'flex', justifyContent:'space-between', height: '240px'}} >
                    <div style={{width: '300px', height:'100%', border: '1px solid lightgray', display:'flex', 
                        alignItems:'center', justifyContent:'center'}} onClick={clickFileDiv}>
                            <input name="file" type="file" style={{display:'none'}}
                                onChange={changeFile}/>
                            <PlusOutlined style={{fontSize:'3rem'}} />
                    </div>
                    {/* 
                    <Dropzone onDrop={onDrop} multiple={false} maxSize={1000000000}> 
                        {({getRootProps, getInputProps}) => (
                            <div style={{width: '300px', height:'100%', border: '1px solid lightgray', display:'flex', 
                                alignItems:'center', justifyContent:'center'}} {...getRootProps()}>
                                    <input name="file" {...getInputProps()}/>
                                    <PlusOutlined style={{fontSize:'3rem'}} />
                            </div>
                        )}
                    </Dropzone>
                    */}
                    <div>
                        <img style={{width: '300px', height: '100%', display: "none"}} 
                            src={`http://18.117.21.81:3001/${ThumbnailPath}`} alt="thumbnail"/>
                    </div>
                    {
                    /*ThumbnailPath && // {ThumbnailPath && ~~} : ThumbnailPath이 있을때만 ~~ 실행해라. 
                        <div>
                            <img style={{width: '300px', height: '100%'}} 
                                src={`http://localhost:3001/${ThumbnailPath}`} alt="thumbnail"/>
                        </div>
                    */
                    }
                </div>
                <br/><br/>
                <label>Title  </label>
                <input name="title" onChange={onTitleChange} value={VideoTitle}/>
                <br/><br/>
                <label>Description</label>
                <TextArea name="description" maxLength={800} rows={7}
                    onChange={onDescriptionChange} value={Description}></TextArea>
                <br/><br/>
                <select name="privacy" value="1" onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br/><br/>
                <select name="category" onChange={onCategoryChange}>
                    <option value="">Please select category...</option>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} 
                            value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br/><br/>
                <Button type="primary" size="large"  onClick={onSubmit}>Submit</Button>
            </form>
        </div>
    )
}

export default VideoUploadPage