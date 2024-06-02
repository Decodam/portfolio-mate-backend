import React, { useState, useEffect } from 'react';
import "../styles/DashboardPage.css"
import { useUser } from '../context/AuthContext';
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import {auth, db} from "../context/FirebaseConfig";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore"; 
import { Avatar } from '@mui/material';
import Chip from '@mui/material/Chip';
import LanguageIcon from '@mui/icons-material/Language';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Pivot as Hamburger } from 'hamburger-react'
import ConstructionIcon from '@mui/icons-material/Construction';
import LaunchIcon from '@mui/icons-material/Launch';


const Dashbaord = (props) => {
    const {user} = useUser();
    const navigate = useNavigate();
    const [ToggleNav, setToggleNav] = useState(false);
    const [SiteData, setSiteData] = useState({
        meta: {
            tier: 0,
            init: serverTimestamp(),
            status: 0,
            uid: user.data.uid,
            name: user.data.displayName,
            email: user.data.email,
            photo: user.data.photoURL,
        },
        about: {}, 
        education: [], 
        experience: [], 
        socialLinks: [{title: "Resume", link: ""}], 
        projects: [], 
    });

    const SignOutUser = () => {
        signOut(auth).then(() => {
            navigate("/dashboard");
        }).catch((error) => {
            console.log("error: ", error.message)
        });
    }
    
    const handleToogleNav = () => {
        if(ToggleNav === true){
            setToggleNav(false);
        } else {
            setToggleNav(true);
        }
    }

    const getFormData = async() => {
        const docRef = doc(db, "portfolios",  user.data.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setSiteData(docSnap.data())
        } else {
            setDoc(doc(db, "portfolios",  user.data.uid), {
                meta: {
                    tier: 0,
                    init: serverTimestamp(),
                    status: 0,
                    uid: user.data.uid,
                    name: user.data.displayName,
                    email: user.data.email,
                    photo: user.data.photoURL,
                },
                about: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    jobTitle: '',
                    city: '',
                    country: '',
                    descriptions: [""],
                    skills: [{ skillCategory: '', skillDescription: '' }]
                },
                education: [],
                experience: [],
                socialLinks: [{ title: "Resume", link: "" }],
                projects: [],
                contactMessages: [],
            });
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
          alert('Link copied to clipboard');
        }).catch(err => {
          console.error('Failed to copy text: ', err);
        });
    };

    useEffect(() => {
        if(user && user.loggedin === true){
            getFormData()
        }
    }, [])



    return(
        <>
            <header>
                <nav>
                    <Link onClick={() => {window.scrollTo(0, 0)}} to='/dashboard' className="nav_logo">Portfolio-Mate.</Link>

                    <div onClick={handleToogleNav} className={ToggleNav === true ? "nav_list open" : "nav_list"}>
                        <Link to="/dashboard" className="nav_list__item active">Dashboard.</Link>
                        <Link to="/dashboard/build" className="nav_list__item">Build.</Link>
                        <div onClick={SignOutUser} style={{margin: "0 20px"}} className="btn">Logout.</div>
                    </div>

                    <div className="nav_btn"><Hamburger  toggled={ToggleNav} toggle={setToggleNav} size={20}  /></div>
                </nav>
            </header>
    
            <main>
                <div className="section_dashboard">
                    <Avatar sx={{ width: 70, height: 70 }} src={user && user.data.photoURL} alt={user && user.data.displayName} />
                    <div className="section_content">
                        <div className="content_displayname">{user && user.data.displayName}</div>
                        <div className="content_email">{user && user.data.email}</div>
                        <div className='content_status'>
                            <Chip icon={<MonetizationOnIcon />} style={{margin: "5px"}} label={SiteData.meta.tier === 2 ? "12 Months Plan" : SiteData.meta.tier === 1 ? "6 Months Plan" : "Free Plan"} />
                            <Chip icon={<LanguageIcon />} style={{margin: "5px"}} label={SiteData.meta.status === 1 ? "Site Deployed" : "Site not Built"} />
                        </div>

                    </div>
                </div>


                <section id="pricingcards">
                    <div className="current_plan landing_plan">
                        <div className="price_tag">Current Plan: {SiteData.meta.tier === 2 ? "12 Months Plan" : SiteData.meta.tier === 1 ? "6 Months Plan" : "Free Plan"}</div>
                        <p style={{marginTop: "12px", color: "#666", fontWeight: "500"}}>
                            Under Current Plan, you get {SiteData.meta.tier === 2 ? "12 Months of" : SiteData.meta.tier === 1 ? "6 Months of" : "3 Months of free"} portfolio hosting. After that your site not be visible (Your data will still be saved) to users untill you choose a package.
                        </p>                         
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}} className='content_status'>
                            <Link to="/dashboard/build"><Chip icon={<ConstructionIcon />} style={{margin: "5px"}} label="Build Site" /></Link>
                            {SiteData.meta.status === 1 && <Link to="/dashboard/build"><Chip icon={<LaunchIcon />} style={{margin: "5px"}} label="Visit Site" /></Link>}
                            
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
            </main>

                
            <footer>
                <p>© <a href="/">portfolio-mate.com</a> 2024 | All rights reserved.</p>
            </footer>
        </>
    );
}


export default Dashbaord;
