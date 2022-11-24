import Axios from 'axios'
import React, {useState, useEffect} from 'react'

function Subscribe(props) {
    const [SubsribeNumber, setSubsribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    let userTo = {
        userTo : props.userTo
    }

    useEffect(() => {
        Axios.post('/api/subscribe/subscribeNumber', userTo )
            .then(res => {
                if(!res.data.success) {
                    alert("failed to get the number of subscribers");
                    return false;
                }

                setSubsribeNumber(res.data.subscribeNumber);
            })

        let subscriber = {
            userTo: props.userTo, userFrom: props.userFrom
        }

        Axios.post('/api/subscribe/subscribed', subscriber)
            .then(res => {
                if (!res.data.success) {
                    alert("failed to get info that you subscried this or not ")
                    return false; 
                }

                setSubscribed(res.data.subscribed);
            })
    }, [])
    
    const onSubscribe = () => {
        let subscription = {
            userTo: props.userTo, userFrom: props.userFrom
        }

        // subscribing
        if (Subscribed) {
            Axios.post('/api/subscribe/unsubscribe', subscription)
                .then((res) => {
                    if (!res.data.success) {
                        alert("failed to unsubscribe ")
                        return false; 
                    }

                    setSubsribeNumber(SubsribeNumber - 1);
                    setSubscribed(!Subscribed);
                });
            }
            else {
                Axios.post('/api/subscribe/subscribe', subscription)
                    .then((res) => {
                        if (!res.data.success) {
                            alert("failed to unsubscribe ")
                            return false; 
                        }   

                        setSubsribeNumber(SubsribeNumber + 1);
                        setSubscribed(!Subscribed);
                    });
        }
    }

  return (
    <div>
        <a href="#" style={{ backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px', color: 'white',
            padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase' }} 
            onClick={onSubscribe}
        >
            {SubsribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
        </a>
    </div>
  )
}

export default Subscribe