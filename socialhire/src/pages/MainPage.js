import React, { useEffect, useState } from 'react'; // React library for building components
import { Container, Spinner } from 'react-bootstrap'; // Bootstrap Container and Spinner for layout and loading indicator
import '../styles/MainPage.css'; // Custom CSS for the Main page
import ProfileCard from '../components/ProfileCard'; // Component for displaying the user's profile information
import PeopleToBefriend from '../components/AddPeople'; // Component for displaying suggestions to connect with people
import { useAuth } from '../hooks/useAuth'; // Custom hook to handle user authentication state
import { PostList } from '../components/PostCard';
import { db } from "../firebaseConfig"; // Firebase configuration for accessing Firestore
import {collection, query, where, getDocs } from "firebase/firestore"; // Firestore functions

//tryng users
import UserCard from '../components/UserCard'; 


const Main = () => {
    const { user, loading } = useAuth(); // Destructuring user and loading state from the authentication hook

    // State for managing posts and loading status
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);

    //trying users
    const [alice, setAlice] = useState(null); // State for Alice's data
    const [aliceLoading, setAliceLoading] = useState(true); // Loading state for Alice

    // Fetch posts data from Firestore once the user is authenticated
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Assuming there's a 'posts' collection in Firestore
                const postsQuery = query(collection(db, "posts"));
                const querySnapshot = await getDocs(postsQuery);
                console.log(user.uid);

                // Map through the documents and get the data
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setPosts(postsData);
                setPostsLoading(false); // Set loading to false once data is fetched
            } catch (error) {
                console.error("Error fetching posts:", error);
                setPostsLoading(false); // Set loading to false even if there's an error
            }
        };

        if (user) {
            fetchPosts(); // Fetch posts only if the user is authenticated
        }
    }, [user]); // Run the effect when user is authenticated

    //trying users
    // Fetch Alice's data
    useEffect(() => {
        const fetchAlice = async () => {
            try {
                // Query Alice by username in Firestore
                const aliceQuery = query(
                    collection(db, "users"),
                    where("username", "==", "Alice")
                );
                const querySnapshot = await getDocs(aliceQuery);

                if (!querySnapshot.empty) {
                    // Assuming 'username' is unique and we get one result
                    const aliceData = querySnapshot.docs[0].data();
                    setAlice(aliceData);
                } else {
                    console.error("Alice not found in database.");
                }
            } catch (error) {
                console.error("Error fetching Alice's data:", error);
            } finally {
                setAliceLoading(false);
            }
        };

        fetchAlice();
    }, []);

    // Display a loading spinner while authentication status is being determined
    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    // Handle the case where no user is authenticated (edge case since useAuth might handle redirection)
    if (!loading && !user) {
        return <div>Redirecting...</div>;
    }

    // Main page layout once the user is authenticated
    return (
        <Container fluid id="background-main-page" className="g-0">
            <div className="grid-layout">
                {/* Sidebar */}
                <div className="layout-sidebar">
                    <div className="sidebar-header">
                        <div className="header-top">
                            {/* ProfileCard displays user information */}
                            <ProfileCard user={user} />
                        </div>
                    </div>
                    {/* trying users  */}
                    {/* Alice's UserCard */}
                    <div className="alice-usercard">
                        <h3>Featured User</h3>
                        {aliceLoading ? (
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        ) : alice ? (
                            <UserCard user={alice} />
                        ) : (
                            <p>Alice's profile could not be loaded.</p>
                        )}
                    </div>
                </div>

                {/* Main Content Section */}
                <div className="layout-main">
                    <h1>Main Content</h1>
                    {/* Render PostList component */}
                    <PostList posts={posts} loading={postsLoading} className="Main-page" />
                </div>

                {/* Aside Section */}
                <div className="layout-aside">
                    <div className="add-people">
                        <h2>Add People</h2>
                        {/* Component to suggest people the user might want to connect with */}
                        <PeopleToBefriend />
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Main;
