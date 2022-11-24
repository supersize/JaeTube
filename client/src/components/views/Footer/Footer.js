import React from 'react'
import { YoutubeFilled } from '@ant-design/icons';

function Footer() {
    return (
        <div style={{
            height: '80px', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', fontSize:'1rem'
        }}>
           <p> Welcome to JaeTube  <YoutubeFilled /></p>
        </div>
    )
}

export default Footer
