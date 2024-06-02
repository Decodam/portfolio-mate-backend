import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore"; 
import { signOut } from "firebase/auth";
import { Pivot as Hamburger } from 'hamburger-react';
import { useUser } from '../context/AuthContext';
import { db, auth } from "../context/FirebaseConfig";
import '../styles/SiteBuildPage.css';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';

const SiteBuildPage = () => {
    const { user } = useUser();
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
        about: {
            firstName: '',
            lastName: '',
            email: '',
            photo: '',
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
    });

    const handleToggleNav = () => {
        setToggleNav(prev => !prev);
    };

    const SignOutUser = () => {
        signOut(auth).then(() => {
            navigate("/dashboard");
        }).catch((error) => {
            console.log("error: ", error.message);
        });
    };

    const getFormData = async () => {
        const docRef = doc(db, "portfolios", user.data.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setSiteData(docSnap.data());
        } else {
            await setDoc(doc(db, "portfolios", user.data.uid), {
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
                    photo: '',
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
            });
        }
    };

    useEffect(() => {
        if (user && user.loggedin) {
            getFormData();
        }
    }, [user]);

    const handleAboutChange = (e) => {
        const { name, value } = e.target;
        setSiteData(prevState => ({
            ...prevState,
            about: {
                ...prevState.about,
                [name]: value
            }
        }));
    };
    const handleDescriptionChange = (index, value) => {
        const newDescriptions = [...SiteData.about.descriptions];
        newDescriptions[index] = value;
        setSiteData(prevState => ({
            ...prevState,
            about: {
                ...prevState.about,
                descriptions: newDescriptions
            }
        }));
    };
    
    const addDescription = () => {
        if (SiteData.about.descriptions.length < 4) {
            setSiteData(prevState => ({
                ...prevState,
                about: {
                    ...prevState.about,
                    descriptions: [...prevState.about.descriptions, ""]
                }
            }));
        }
    };
    
    const removeDescription = (index) => {
        if (SiteData.about.descriptions.length > 1) { // Ensure at least one description remains
            const newDescriptions = SiteData.about.descriptions.filter((_, i) => i !== index);
            setSiteData(prevState => ({
                ...prevState,
                about: {
                    ...prevState.about,
                    descriptions: newDescriptions
                }
            }));
        }
    };
    
    const handleSkillChange = (index, field, value) => {
        const newSkills = [...SiteData.about.skills];
        newSkills[index][field] = value;
        setSiteData(prevState => ({
            ...prevState,
            about: {
                ...prevState.about,
                skills: newSkills
            }
        }));
    };
    
    const addSkill = () => {
        if (SiteData.about.skills.length < 4) {
            setSiteData(prevState => ({
                ...prevState,
                about: {
                    ...prevState.about,
                    skills: [...prevState.about.skills, { skillCategory: '', skillDescription: '' }]
                }
            }));
        }
    };
    
    const removeSkill = (index) => {
        if (SiteData.about.skills.length > 1) { // Ensure at least one skill remains
            const newSkills = SiteData.about.skills.filter((_, i) => i !== index);
            setSiteData(prevState => ({
                ...prevState,
                about: {
                    ...prevState.about,
                    skills: newSkills
                }
            }));
        }
    };
    

    const handleSocialLinkChange = (index, field, value) => {
        const newSocialLinks = [...SiteData.socialLinks];
        newSocialLinks[index][field] = value;
        setSiteData(prevState => ({
            ...prevState,
            socialLinks: newSocialLinks
        }));
    };

    const addSocialLink = () => {
        if (SiteData.socialLinks.length < 5) {
            setSiteData(prevState => ({
                ...prevState,
                socialLinks: [...prevState.socialLinks, { title: "", link: "" }]
            }));
        }
    };

    const removeSocialLink = (index) => {
        const newSocialLinks = SiteData.socialLinks.filter((_, i) => i !== index);
        setSiteData(prevState => ({
            ...prevState,
            socialLinks: newSocialLinks
        }));
    };


    //TODO: PROJECT SECTION

    
    const addProject = () => {
        setSiteData(prevState => ({
            ...prevState,
            projects: [...prevState.projects, {
                title: '',
                category: '',
                description: '',
                overview: [{ content: '' }],
                problemAreas: [{ content: '' }],
                solutionAreas: [{ content: '' }]
            }]
        }));
    };

    const handleProjectChange = (index, field, value) => {
        const newProjects = [...SiteData.projects];
        newProjects[index][field] = value;
        setSiteData(prevState => ({
            ...prevState,
            projects: newProjects
        }));
    };

    const addPoint = (projectIndex, area) => {
        const newProjects = [...SiteData.projects];
        const currentPointsCount = newProjects[projectIndex][area].length;
        if (currentPointsCount < 4) {
            newProjects[projectIndex][area].push({ content: '' });
            setSiteData(prevState => ({
                ...prevState,
                projects: newProjects
            }));
        }
    };
    
    const removePoint = (projectIndex, area, pointIndex) => {
        const newProjects = [...SiteData.projects];
        if (newProjects[projectIndex][area].length > 1) { // Ensure at least 1 point remains
            newProjects[projectIndex][area] = newProjects[projectIndex][area].filter((_, i) => i !== pointIndex);
            setSiteData(prevState => ({
                ...prevState,
                projects: newProjects
            }));
        }
    };

    const removeProject = (projectIndex) => {
        const newProjects = [...SiteData.projects];
        newProjects.splice(projectIndex, 1);
        setSiteData(prevState => ({
            ...prevState,
            projects: newProjects
        }));
    };    

    const handlePointChange = (projectIndex, area, pointIndex, value) => {
        const newProjects = [...SiteData.projects];
        newProjects[projectIndex][area][pointIndex].content = value;
        setSiteData(prevState => ({
            ...prevState,
            projects: newProjects
        }));
    };

    const toggleHighlight = (projectIndex) => {
        const newProjects = [...SiteData.projects];
        newProjects[projectIndex].highlight = !newProjects[projectIndex].highlight;
        setSiteData(prevState => ({
            ...prevState,
            projects: newProjects
        }));
    };
    
    
    // TODO: EXPEREINCE SECTION

    const handleExperienceChange = (index, field, value) => {
        const newExperience = [...SiteData.experience];
        newExperience[index][field] = value;
        setSiteData(prevState => ({
            ...prevState,
            experience: newExperience
        }));
    };
    
    const handleExperiencePointChange = (expIndex, pointIndex, value) => {
        const newExperience = [...SiteData.experience];
        newExperience[expIndex].points[pointIndex] = value;
        setSiteData(prevState => ({
            ...prevState,
            experience: newExperience
        }));
    };
    
    const addExperience = () => {
        setSiteData(prevState => ({
            ...prevState,
            experience: [...prevState.experience, {
                companyName: '',
                jobTitle: '',
                startingYear: '',
                endingYear: '',
                points: ['']
            }]
        }));
    };
    
    const removeExperience = (index) => {
        if (SiteData.experience.length > 1) { // Ensure at least one experience remains
            const newExperience = SiteData.experience.filter((_, i) => i !== index);
            setSiteData(prevState => ({
                ...prevState,
                experience: newExperience
            }));
        }
    };
    
    const addExperiencePoint = (index) => {
        const newExperience = [...SiteData.experience];
        if (newExperience[index].points.length < 4) {
            newExperience[index].points.push('');
            setSiteData(prevState => ({
                ...prevState,
                experience: newExperience
            }));
        }
    };
    
    const removeExperiencePoint = (expIndex, pointIndex) => {
        const newExperience = [...SiteData.experience];
        if (newExperience[expIndex].points.length > 1) { // Ensure at least one point remains
            newExperience[expIndex].points = newExperience[expIndex].points.filter((_, i) => i !== pointIndex);
            setSiteData(prevState => ({
                ...prevState,
                experience: newExperience
            }));
        }
    };

    
    // TODO: EDUCATION SECTION

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...SiteData.education];
        newEducation[index][field] = value;
        setSiteData(prevState => ({
            ...prevState,
            education: newEducation
        }));
    };
    
    const handleEducationDescriptionChange = (eduIndex, descIndex, value) => {
        const newEducation = [...SiteData.education];
        newEducation[eduIndex].description[descIndex] = value;
        setSiteData(prevState => ({
            ...prevState,
            education: newEducation
        }));
    };
    
    const addEducation = () => {
        setSiteData(prevState => ({
            ...prevState,
            education: [...prevState.education, {
                instituteName: '',
                courseName: '',
                startingDate: '',
                endingDate: '',
                description: ['']
            }]
        }));
    };
    
    const removeEducation = (index) => {
        if (SiteData.education.length > 1) { // Ensure at least one education remains
            const newEducation = SiteData.education.filter((_, i) => i !== index);
            setSiteData(prevState => ({
                ...prevState,
                education: newEducation
            }));
        }
    };
    
    const addEducationDescription = (index) => {
        const newEducation = [...SiteData.education];
        if (newEducation[index].description.length < 4) {
            newEducation[index].description.push('');
            setSiteData(prevState => ({
                ...prevState,
                education: newEducation
            }));
        }
    };
    
    const removeEducationDescription = (eduIndex, descIndex) => {
        const newEducation = [...SiteData.education];
        if (newEducation[eduIndex].description.length > 1) { // Ensure at least one description remains
            newEducation[eduIndex].description = newEducation[eduIndex].description.filter((_, i) => i !== descIndex);
            setSiteData(prevState => ({
                ...prevState,
                education: newEducation
            }));
        }
    };
    



    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = {
                ...SiteData,
                meta: {
                    ...SiteData.meta,
                    status: 1
                }
            };
            await setDoc(doc(db, "portfolios", user.data.uid), updatedData);
            alert("Successfully updated Your Site!");
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    };
    

    return (
        <>
            <header>
                <nav>
                    <Link onClick={() => window.scrollTo(0, 0)} to='/dashboard' className="nav_logo">Portfolio-Mate.</Link>
                    <div onClick={handleToggleNav} className={ToggleNav ? "nav_list open" : "nav_list"}>
                        <Link to="/dashboard" className="nav_list__item">Dashboard.</Link>
                        <Link to="/dashboard/build" className="nav_list__item active">Build.</Link>
                        <div onClick={SignOutUser} style={{ margin: "0 20px" }} className="btn">Logout.</div>
                    </div>
                    <div className="nav_btn">
                        <Hamburger toggled={ToggleNav} toggle={setToggleNav} size={20} />
                    </div>
                </nav>
            </header>


            <main>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ flexGrow: 1, maxWidth: 800, margin: 'auto', padding: 2 }}>
                        <div className="section_title">
                            <Typography variant="h4" gutterBottom>About Yourself</Typography>
                            <Divider />
                        </div>
                        <Box sx={{ marginTop: 4, marginBottom: 4, padding: "40px 20px", borderRadius: "20px", border: "3px dashed #000"}}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        required
                                        name="firstName"
                                        label="First Name"
                                        fullWidth
                                        value={SiteData.about.firstName}
                                        onChange={handleAboutChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        required
                                        name="lastName"
                                        label="Last Name"
                                        fullWidth
                                        value={SiteData.about.lastName}
                                        onChange={handleAboutChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        name="email"
                                        label="Email"
                                        fullWidth
                                        value={SiteData.about.email}
                                        onChange={handleAboutChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        name="photo"
                                        label="Profile Photo"
                                        fullWidth
                                        value={SiteData.about.photo}
                                        onChange={handleAboutChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="jobTitle"
                                        label="Target Job Title"
                                        fullWidth
                                        required
                                        value={SiteData.about.jobTitle}
                                        onChange={handleAboutChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name="city"
                                        label="City"
                                        fullWidth
                                        value={SiteData.about.city}
                                        onChange={handleAboutChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name="country"
                                        label="Country"
                                        required
                                        fullWidth
                                        value={SiteData.about.country}
                                        onChange={handleAboutChange}
                                    />
                                </Grid>
                            </Grid>

                            <div className="section_title">
                                <Typography variant="h6" gutterBottom>Your Description</Typography>
                            </div>
                            {SiteData.about.descriptions.map((description, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                    <TextField
                                        fullWidth
                                        required
                                        value={description}
                                        placeholder="Write some points about you"
                                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                    />
                                    {SiteData.about.descriptions.length > 1 && (
                                        <IconButton onClick={() => removeDescription(index)}>
                                            <RemoveIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}
                            {SiteData.about.descriptions.length < 4 && (
                                <Button onClick={addDescription} variant="outlined" size="small">Add Description</Button>
                            )}

                            {/* Skills */}
                            <div className="section_title">
                                <Typography variant="h6" gutterBottom>Your Skills</Typography>
                            </div>
                            {SiteData.about.skills.map((skill, index) => (
                                <Grid container spacing={2} sx={{marginBottom: 2}} key={index} alignItems="center">
                                    <Grid item xs={4}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Skill Category"
                                            value={skill.skillCategory}
                                            onChange={(e) => handleSkillChange(index, 'skillCategory', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={7}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Skill Description"
                                            value={skill.skillDescription}
                                            onChange={(e) => handleSkillChange(index, 'skillDescription', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={1} style={{ textAlign: 'right' }}>
                                        {index !== 0 && ( // Prevent removing the first link (Resume)
                                            <IconButton onClick={() => removeSkill(index)} disabled={SiteData.about.skills.length <= 1}>
                                                <RemoveIcon />
                                            </IconButton>
                                        )}
                                    </Grid>
                                </Grid>
                            ))}
                            <Button onClick={addSkill} variant="outlined" size="small" disabled={SiteData.about.skills.length >= 4}>Add Skill</Button>

                            <div className="section_title">
                                <Typography variant="h6" gutterBottom>Social Links</Typography>
                            </div>
                            {SiteData.socialLinks.map((socialLink, index) => (
                                <Grid container spacing={2} sx={{marginBottom: 1}} key={index} alignItems="center">
                                    <Grid item xs={4}>
                                        <TextField
                                            label="Link Title"
                                            required
                                            fullWidth
                                            value={socialLink.title}
                                            disabled={index === 0} // Disable editing for the first link (Resume)
                                            onChange={(e) => handleSocialLinkChange(index, 'title', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={7}>
                                        <TextField
                                            label="Link URL"
                                            required
                                            fullWidth
                                            value={socialLink.link}
                                            onChange={(e) => handleSocialLinkChange(index, 'link', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={1} style={{ textAlign: 'right' }}>
                                        {index !== 0 && ( // Prevent removing the first link (Resume)
                                            <IconButton onClick={() => removeSocialLink(index)}>
                                                <RemoveIcon />
                                            </IconButton>
                                        )}
                                    </Grid>
                                </Grid>
                            ))}
                            {SiteData.socialLinks.length < 5 && (
                                <Grid item xs={12}>
                                    <Button onClick={addSocialLink} variant="outlined" size="small">Add Social Link</Button>
                                </Grid>
                            )}
                        </Box>

                        <Box>
                            <div className="section_title">
                                <Typography variant="h4" gutterBottom>Your Projects</Typography>
                                <Divider />
                            </div>
                            
                            {SiteData.projects.map((project, projectIndex) => (
                                <Box key={projectIndex} sx={{ marginTop: 4, marginBottom: 4, padding: "40px 20px", borderRadius: "20px", border: "3px dashed #000"}}>
                                    <div style={{marginTop: "0px"}} className="section_title">
                                        <Typography variant="h6" gutterBottom>Projects #{projectIndex+1}</Typography>
                                        <Divider />
                                    </div>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                label="Project Title"
                                                fullWidth
                                                value={project.title}
                                                onChange={(e) => handleProjectChange(projectIndex, 'title', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                label="Category"
                                                fullWidth
                                                value={project.category}
                                                onChange={(e) => handleProjectChange(projectIndex, 'category', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Demo Link"
                                                fullWidth
                                                value={project.demolink}
                                                onChange={(e) => handleProjectChange(projectIndex, 'demolink', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                label="Primary Image Link"
                                                fullWidth
                                                value={project.imagelinkPrimary}
                                                onChange={(e) => handleProjectChange(projectIndex, 'imagelinkPrimary', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                label="Secondary Image Link"
                                                fullWidth
                                                value={project.imagelinkSecondary}
                                                onChange={(e) => handleProjectChange(projectIndex, 'imagelinkSecondary', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Description"
                                                required
                                                inputProps={{ maxLength: 280 }}
                                                fullWidth
                                                value={project.description}
                                                onChange={(e) => handleProjectChange(projectIndex, 'description', e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>

                                    {/* Overview */}
                                    <Typography style={{marginTop: "35px", marginBottom: "15px"}} variant="h6" gutterBottom>Overview</Typography>
                                    {project.overview.map((point, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                            <TextField
                                                fullWidth
                                                inputProps={{ maxLength: 180 }}
                                                placeholder={`Write point #${index+1} on the overview of your project. It can be its purpose, achivement. etc.`}
                                                required
                                                value={point.content}
                                                onChange={(e) => handlePointChange(projectIndex, 'overview', index, e.target.value)}
                                            />
                                            <IconButton onClick={() => removePoint(projectIndex, 'overview', index)}>
                                                <RemoveIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                                    <Button onClick={() => addPoint(projectIndex, 'overview')} variant="outlined" size="small">Add Overview Point</Button>

                                    {/* Problem Areas */}
                                    <Typography style={{marginTop: "35px", marginBottom: "15px"}}  variant="h6" gutterBottom>Problem Areas</Typography>
                                    {project.problemAreas.map((point, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                            <TextField
                                                fullWidth
                                                required
                                                inputProps={{ maxLength: 180 }}
                                                placeholder={`Write point #${index+1} on the problems that you tried solving with your project.`}
                                                value={point.content}
                                                onChange={(e) => handlePointChange(projectIndex, 'problemAreas', index, e.target.value)}
                                            />
                                            <IconButton onClick={() => removePoint(projectIndex, 'problemAreas', index)}>
                                                <RemoveIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                                    <Button onClick={() => addPoint(projectIndex, 'problemAreas')} variant="outlined" size="small">Add Problem Area</Button>

                                    {/* Solution Areas */}
                                    <Typography style={{marginTop: "35px", marginBottom: "15px"}}  variant="h6" gutterBottom>Solution Areas</Typography>
                                    {project.solutionAreas.map((point, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                            <TextField
                                                fullWidth
                                                inputProps={{ maxLength: 180 }}
                                                required
                                                placeholder={`Write point #${index+1} on the solution to problems that you created with your project.`}
                                                value={point.content}
                                                onChange={(e) => handlePointChange(projectIndex, 'solutionAreas', index, e.target.value)}
                                            />
                                            <IconButton onClick={() => removePoint(projectIndex, 'solutionAreas', index)}>
                                                <RemoveIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                                    <Button onClick={() => addPoint(projectIndex, 'solutionAreas')} variant="outlined" size="small">Add Solution Area</Button>
                                    <Button onClick={() => toggleHighlight(projectIndex)} variant="outlined" size="small" color={project.highlight ? "error" : "primary"}>
                                        {project.highlight ? "Remove Highlight" : "Highlight Project"}
                                    </Button>
                                    <Button onClick={() => removeProject(projectIndex)} variant="outlined" color="error" size="small">Remove Project</Button>
                                </Box>
                            ))}
                            <Button onClick={addProject} variant="outlined" size="large" color="primary">Add Project</Button>
                        </Box>


                         {/* Experience Section */}
                        <Box sx={{ marginTop: 4 }}>
                            <div className="section_title">
                                <Typography variant="h4" gutterBottom>Your Work Experience</Typography>
                                <Divider />
                            </div>
                            {SiteData.experience.map((exp, expIndex) => (
                                <Box key={expIndex} sx={{ marginTop: 4, marginBottom: 4, padding: "40px 20px", borderRadius: "20px", border: "3px dashed #000"}}>
                                    <div style={{marginTop: "0px"}} className="section_title">
                                        <Typography variant="h6" gutterBottom>Experience #{expIndex+1}</Typography>
                                        <Divider />
                                    </div>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                label="Company Name"
                                                fullWidth
                                                value={exp.companyName}
                                                onChange={(e) => handleExperienceChange(expIndex, 'companyName', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                label="Job Title"
                                                fullWidth
                                                value={exp.jobTitle}
                                                onChange={(e) => handleExperienceChange(expIndex, 'jobTitle', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                label="Starting Year"
                                                fullWidth
                                                value={exp.startingYear}
                                                onChange={(e) => handleExperienceChange(expIndex, 'startingYear', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                label="Ending Year"
                                                fullWidth
                                                value={exp.endingYear}
                                                onChange={(e) => handleExperienceChange(expIndex, 'endingYear', e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Typography style={{marginTop: "35px", marginBottom: "15px"}}   variant="h6">Points</Typography>
                                    {exp.points.map((point, pointIndex) => (
                                        <Box key={pointIndex} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                            <TextField
                                                fullWidth
                                                value={point}
                                                required
                                                placeholder="Add some points describing your expereince with the company"
                                                onChange={(e) => handleExperiencePointChange(expIndex, pointIndex, e.target.value)}
                                            />
                                            <IconButton onClick={() => removeExperiencePoint(expIndex, pointIndex)} disabled={exp.points.length <= 1}>
                                                <RemoveIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                                    <Box sx={{ marginTop: 2 }}>
                                        <Button onClick={() => addExperiencePoint(expIndex)} variant="outlined" size="small" disabled={exp.points.length >= 4}>Add Point</Button>
                                        <Button onClick={() => removeExperience(expIndex)} variant="outlined" size="small" color="error">Remove Experience</Button>
                                    </Box>
                                </Box>
                            ))}
                            <Button onClick={addExperience} variant="outlined" size="large">Add Experience</Button>
                        </Box>


                         {/* Education Section */}
                        <Box sx={{ marginTop: 4 }}>
                            <div className="section_title">
                                <Typography variant="h4" gutterBottom>Your Education</Typography>
                                <Divider />
                            </div>
                            {SiteData.education.map((edu, eduIndex) => (
                                <Box key={eduIndex} sx={{ marginTop: 4, marginBottom: 4, padding: "40px 20px", borderRadius: "20px", border: "3px dashed #000"}}>
                                    <div style={{marginTop: "0px"}} className="section_title">
                                        <Typography variant="h6" gutterBottom>Education #{eduIndex+1}</Typography>
                                        <Divider />
                                    </div>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                label="Institute Name"
                                                fullWidth
                                                value={edu.instituteName}
                                                onChange={(e) => handleEducationChange(eduIndex, 'instituteName', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                label="Course Name"
                                                fullWidth
                                                value={edu.courseName}
                                                onChange={(e) => handleEducationChange(eduIndex, 'courseName', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                label="Starting Date"
                                                fullWidth
                                                value={edu.startingDate}
                                                onChange={(e) => handleEducationChange(eduIndex, 'startingDate', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                required
                                                label="Ending Date"
                                                fullWidth
                                                value={edu.endingDate}
                                                onChange={(e) => handleEducationChange(eduIndex, 'endingDate', e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h6" style={{marginTop: "35px", marginBottom: "15px"}} >Descriptions</Typography>
                                    {edu.description.map((desc, descIndex) => (
                                        <Box key={descIndex} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                            <TextField
                                                fullWidth
                                                value={desc}
                                                required
                                                placeholder="Add some points describing your expereince with the institution and course"
                                                onChange={(e) => handleEducationDescriptionChange(eduIndex, descIndex, e.target.value)}
                                            />
                                            <IconButton onClick={() => removeEducationDescription(eduIndex, descIndex)} disabled={edu.description.length <= 1}>
                                                <RemoveIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                                    <Box sx={{ marginTop: 2 }}>
                                        <Button onClick={() => addEducationDescription(eduIndex)} variant="outlined" size="small" disabled={edu.description.length >= 4}>Add Description</Button>
                                        <Button onClick={() => removeEducation(eduIndex)} variant="outlined" size="small" color="error">Remove Education</Button>
                                    </Box>
                                </Box>
                            ))}
                            <Button onClick={addEducation} variant="outlined" size="large">Add Education</Button>
                        </Box>


                        <Button type="submit" sx={{height: '50px'}} variant="contained" color="primary" fullWidth>Save Portfolio</Button>
                    </Box>
                </form>
            </main>

            <footer>
                <p>© <a href="/">portfolio-mate.com</a> 2024 | All rights reserved.</p>
            </footer>
        </>
    );
};

export default SiteBuildPage;
