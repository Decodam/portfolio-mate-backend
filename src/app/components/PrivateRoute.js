import React, {  } from 'react';
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/AuthContext';



const PrivateRoute = (props) => {
    const navigate = useNavigate();
    const {user} = useUser();

    if(user && user.loggedin === true) {
        return(
            <>{props.children}</>
        );
    } else if (user && user.loggedin === false) {
        navigate("/")
    } else {
        return(
            <div className='loading_screen'><div className='loader'/></div>
        )
    }
}


export default PrivateRoute;