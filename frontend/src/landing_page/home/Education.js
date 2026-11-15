import React from 'react';

function Education(){
    return(
        <div className="container mt-5 mb-5">
            <div className="row mt-5">
                <div className="col-6">
                   <img style={{width:"70%"}} src='media/images/Education.svg'></img>
                </div>

     
                <div className="col-6">
                   <h1 className="fs-2 mb-3 pt-5">Free and open market education</h1>

                   <p>Varsity, the largest online stock market education book in the world covering everything from the basics to advanced trading.</p>

                   <a href=""  style={{textDecoration:"none"}}>Varsity
                        <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
                   </a>
                    <p className="mt-5">TradingQ&A, the most active trading and investment community in India for all your market related queries.</p>


                    <a href="" style={{ textDecoration: "none" }}>TradingQ&A
                        <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
                    </a>
                    
                </div>
            </div>
        </div>
    );
}

export default Education;