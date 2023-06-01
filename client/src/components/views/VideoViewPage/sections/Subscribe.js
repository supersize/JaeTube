import Axios from 'axios'
import React, {useState, useEffect} from 'react'
import { auth } from "../../../../_actions/user_actions";
import { useDispatch } from "react-redux";

function Subscribe(props) {
    const dispatch = useDispatch();

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

        dispatch(auth())
            .then(response => {
                if (!response.payload.isAuth) {
                    return false;
                }

                let subscriber = {
                    userTo: props.userTo, userFrom: props.userFrom
                }
        
                Axios.post('/api/subscribe/subscribed', subscriber)
                    .then(res => {
                        if (!res.data.success) {
                            alert("failed to get info that you subscried this or not ")
                            return false; 
                        }
        
                        console.log("Subscribed : ", res.data.subscribed);
                        setSubscribed(res.data.subscribed);
                    })
                });
            }, [])
    
    const onSubscribe = () => {
        dispatch(auth())
            .then(response => {
                if (!response.payload.isAuth) {
                    alert("login is needed.")
                    return false;
                }

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
        
                            console.log("!Subscribed 1");
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
        
                            console.log("!Subscribed 2");
                            setSubsribeNumber(SubsribeNumber + 1);
                            setSubscribed(!Subscribed);
                        });
                }
            });

        
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