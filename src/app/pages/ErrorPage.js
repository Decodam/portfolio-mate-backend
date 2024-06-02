import React, {  } from 'react';


const ErrorPage = (props) => {
    return(
        <div className='loading_screen'>
            <h1>Opps! Page not Found</h1> <br />
            <p>
            <a href="/">Go back to Home</a>
            </p>
        </div>
    );
}


export default ErrorPage;