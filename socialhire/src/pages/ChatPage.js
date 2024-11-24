// Import React and necessary hooks
import React, { useState } from 'react';

// Import components and styles from Bootstrap
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

// Import a search icon image
import lookGlass from '../images/lookglass.png';

// Import custom styles for the ChatPage component
import '../styles/ChatPage.css';

// Import the LastChat component to display recent chats
import LastChat from '../components/LastChat';

// Import Firebase Firestore functions and database config
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Replace with your Firebase config path

// Define the ChatPage component
const ChatPage = () => {
    // State to manage the search input value
    const [searchInput, setSearchInput] = useState('');

    // State to store the search results from the database
    const [searchResults, setSearchResults] = useState([]);

    // Function to handle form submission for search
    const handleSearchSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        
        // Trim whitespace from the search input
        const sanitizedInput = searchInput.trim();

        // If the input is empty, log an error and stop further execution
        if (!sanitizedInput) {
            console.error('Input cannot be empty');
            return;
        }

        try {
            // Reference the 'users' collection in the Firestore database
            const usersCollection = collection(db, 'users');
            
            // Create a range query to find users whose first names match the input
            const startText = sanitizedInput; // Start of the search range
            const endText = sanitizedInput + '\uf8ff'; // End of the range (\uf8ff ensures matching the highest possible characters)

            // Define the Firestore query
            const q = query(usersCollection, where('firstName', '>=', startText), where('firstName', '<', endText));

            // Execute the query and get the documents
            const querySnapshot = await getDocs(q);

            // Map the query results into an array of user objects
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push({ id: doc.id, ...doc.data() });
            });

            // Update the search results state with the fetched users
            setSearchResults(users);
        } catch (error) {
            // Log any errors that occur during the query
            console.error('Error fetching users:', error);
        }
    };

    // Render the ChatPage component
    return (
        // Use a Bootstrap Container for layout
        <Container fluid id="background" className="g-0">
            <div className="chat-page-body">
                {/* Header section containing a title and search bar */}
                <div className="chat-header">
                    <p id="header-text">Messaging</p>
                    
                    {/* Search bar for finding users */}
                    <Form className="search-bar" onSubmit={handleSearchSubmit}>
                        <Form.Control
                            type="text" // Input type is text
                            placeholder="Search" // Placeholder text
                            className="searchbar-header" // CSS class for styling
                            value={searchInput} // Controlled input value
                            onChange={(e) => setSearchInput(e.target.value)} // Update state on input change
                        />
                        
                        {/* Search button with an icon */}
                        <button type="submit" className="search-button">
                            <img src={lookGlass} alt="Search" className="search-icon" />
                        </button>
                    </Form>
                </div>

                {/* Main body section for displaying chats */}
                <div className="chat-body">
                    {/* Sidebar to show search results */}
                    <div className="chat-sidebar">
                        {/* If search results exist, display them as a list */}
                        {searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <div key={user.id} className="user-item">
                                    <p>{user.firstName} {user.lastName}</p>
                                </div>
                            ))
                        ) : (
                            // Show a message if no users are found
                            <p>No users found</p>
                        )}
                    </div>

                    {/* Include the LastChat component to show recent conversations */}
                    <LastChat />

                    {/* Placeholder div for the focused chat view */}
                    <div className="chat-focus"></div>
                </div>
            </div>
        </Container>
    );
};

// Export the ChatPage component for use in other parts of the app
export default ChatPage;
