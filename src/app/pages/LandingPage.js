import React, { useState } from 'react';
import { useUser } from '../context/AuthContext';
import "../styles/LandingPage.css"
import { Link } from 'react-router-dom';
import { Pivot as Hamburger } from 'hamburger-react'
import ContactForm from '../components/ContactForm';
import { useNavigate } from "react-router-dom";
import {auth, provider,db} from "../context/FirebaseConfig"
import { signInWithRedirect } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 


const LandingPage = (props) => {
    const [ToggleNav, setToggleNav] = useState(false);
    const {user, updateUser} = useUser();
    const navigate = useNavigate();


    const SignInWithGoogleRedirect = async() => {
        signInWithRedirect(auth, provider).then((userdata) => {
            updateUser({
                loggedin: true,
                data: userdata
            });
        }).catch((error) => {
            console.log("error: ", error.message);
        })
    }

    const handleToogleNav = () => {
        if(ToggleNav === true){
            setToggleNav(false);
        } else {
            setToggleNav(true);
        }
    }


    if(!user) {
        return(
            <div className='loading_screen'><div className='loader'/></div>
        )
    } else if (user && user.loggedin === true) {
        return navigate("/dashboard");
    } else {
        return(
            <>
                <header>
                    <nav>
                        <Link onClick={() => {window.scrollTo(0, 0)}} to='/' className="nav_logo">Portfolio-Mate.</Link>
    
                        <div onClick={handleToogleNav} className={ToggleNav === true ? "nav_list open" : "nav_list"}>
                            <a href="#features" className="nav_list__item">Features.</a>
                            <a href="#pricing" className="nav_list__item">Pricing.</a>
                            <a href="#contact" className="nav_list__item">Contact.</a>
                            {user && user.loggedin === true ? (
                                <Link to="/dashboard"><div style={{margin: "0 20px"}} className="btn">Dashboard.</div></Link>
                            ) : (
                                <div onClick={SignInWithGoogleRedirect} style={{margin: "0 20px"}} className="btn">Sign in.</div>
                            )}
                        </div>
    
                        <div className="nav_btn"><Hamburger  toggled={ToggleNav} toggle={setToggleNav} size={20}  /></div>
                    </nav>
                </header>
    
                <main>
                    <section id='hero'>
                        <p className="hero_lead">
                            Need a portfolio? <br />Create a new one withing minutes!
                        </p>
    
                        <div className="hero_links link_list">
                            {user && user.loggedin === true ? (
                                <Link to="/dashboard"><div style={{color: "#fff", padding: "14px 36px", fontSize: "18px"}} className="btn">Dashboard.</div></Link>
                            ) : (
                                <div onClick={SignInWithGoogleRedirect} style={{color: "#fff", padding: "14px 36px", fontSize: "18px"}} className="btn">Get Started.</div>
                            )}
                            
                        </div>
                    </section>
                    
                    <div  id='features' style={{margin: "120px 0"}} className="skills">
                        <div className="skills__image"><img src="https://illustrations.popsy.co/white/web-design.svg" alt="" /></div>
                    
                        <div className="skills__content">
                            <div className='skills_content_title'>Our Features.</div>
                            <ul className="roles_wrap_content__text">
                                <li className='skill_list'><span>Responsive Design : </span><br /> Fully functional design adaptable to both mobile and desktop devices</li>
                                <li className='skill_list'><span>Multiple Sections: </span><br /> Professional Experience, Education, Skills, Contact, Project Details, and many more</li>
                                <li className='skill_list'><span>Projects Showcase : </span><br /> Create visually appealing galleries to display your projects, allowing visitors to view your work in detail and gain a deeper understanding of your skills.</li>
                                <li className='skill_list'><span>Dashboard Screen : </span><br /> A free dashboard with site analytics and messages from potential clients and recruiters.</li>
                            </ul>
                        </div>
                    </div>
                    
                    {/*
    
                    #Later Pricing
                    
                    <div  id='pricing' style={{margin: "120px 0"}} className="skills">
                    
                        <div className="skills__content">
                            <div className='skills_content_title'>Our Pricing.</div>
                            <p style={{margin: "10px 0"}}>
                                We provide our services at the lowest cost possible, charging only ₹10 per month. 
                                Your first 3 months are free for everyone, and no credit card is required to get started. 
                                See our pricing section for more details.
                            </p>
                            <ul className="roles_wrap_content__text">
                                <li className='skill_list'><span>Free Tier: </span><br /> First 3 months are free for everyone, no credit card required.</li>
                                <li className='skill_list'><span>6 Months Subscription: </span><br /> Only ₹50 for 6 months.</li>
                                <li className='skill_list'><span>1 Year Subscription: </span><br /> Only ₹100 for 1 year of subscription.</li>
                            </ul>
                        </div>
                        <div className="skills__image remove_img"><img src="https://illustrations.popsy.co/white/keynote-presentation.svg" alt="" /></div>
                    </div>
                    
                    */}

    
    
                <div id="pricing"className="cta_page">
                    <div className="cta_content">
                        <div className='cta_title'>Limited Time Offer: Free Portfolios!</div>
                        <p className="cta_body">As a startup, we understand the importance of getting started on the right foot. That's why, we're offering free portfolios to help kickstart your professional journey. Take advantage of this opportunity to showcase your work and establish your online presence without any cost. Don't miss out – sign up now and create your free portfolio today!</p>
                        

                        <section className='priceing_cards_landing'>
                            <div className="current_plan">
                                <div style={{textAlign: "center"}} className="price_tag">Start Now For Free!</div>
                                <p style={{marginTop: "12px", color: "#666", fontWeight: "500", textAlign: "center"}}>
                                    Under Free Tier Plan, you get 3 months of free portfolio hosting. After that your site not be visible (Your data will still be saved) to users untill you choose a package.
                                </p>
                                                                
                                <div className='cta_btn_grp'>
                                    <div onClick={SignInWithGoogleRedirect} style={{color: "#fff", padding: "14px 36px", fontSize: "18px"}} className="btn">Get Started.</div>
                                </div>
                            </div>
                            <div className="price_tag_cards">
                                <div className="pricing_card">
                                    <div className="price_tag">₹50</div>
                                    <div className="price_time">6 Months</div>
                                    <p style={{marginTop: "12px", color: "#666", fontWeight: "500"}}>(5 Mon +1 Mon Free)</p>
                                    <div className="btn price_btn">Buy Plan</div>
                                </div>
                                <div className="pricing_card">
                                    <div className="price_tag">₹100</div>
                                    <div className="price_time">12 Months</div>
                                    <p style={{marginTop: "12px", color: "#666", fontWeight: "500"}}>(10 Mon +2 Mon Free)</p>
                                    <div className="btn price_btn">Buy Plan</div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
    
    
                    <ContactForm />
                </main>
    
                <footer>
                    <p>© <a href="#hero">portfolio-mate.com</a> 2024 | All rights reserved.</p>
                </footer>
            </>
        );
    }
    

}


export default LandingPage;