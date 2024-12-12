// Import necessary React hooks and Firebase utilities
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Container, Spinner, Alert, Card, Button } from "react-bootstrap";
import RemoveFriendModal from "../components/RemoveFriendModal";
import BlockUserModal from "../components/BlockUserModal";
import { UserPostsSection } from "../components/profile/UserPostsSection";
import { JobPostsSection } from "../components/profile/JobPostsSection";
import { UserExperiencesSection } from "../components/profile/UserExperiencesSection";

// ProfilePage component handles user profile display and related actions
const ProfilePage = () => {
  const { username } = useParams(); // Extracts the username parameter from the URL
  const navigate = useNavigate(); // Enables navigation to other routes
  const [profileData, setProfileData] = useState(null); // Stores fetched user profile data
  const [loading, setLoading] = useState(true); // Tracks the loading state for profile data
  const [error, setError] = useState(null); // Stores any errors encountered during data fetching
  const [friendshipStatus, setFriendshipStatus] = useState(null); // Indicates friendship status with the profile owner
  const [blockStatus, setBlockStatus] = useState(null); // Tracks block status between users
  const [showRemoveFriendModal, setShowRemoveFriendModal] = useState(false); // Controls visibility of the Remove Friend modal
  const [showBlockUserModal, setShowBlockUserModal] = useState(false); // Controls visibility of the Block User modal
  const [userPosts, setUserPosts] = useState([]); // Stores user-created posts
  const [userJobs, setUserJobs] = useState([]); // Stores user job posts
  const [userExperiences, setUserExperiences] = useState([]); // Stores user experiences
  const auth = getAuth(); // Firebase authentication instance
  const loggedInUserId = auth.currentUser?.uid; // Fetches the currently logged-in user's ID

  // Checks if the profile belongs to the logged-in user
  const isCurrentUserProfile = loggedInUserId && profileData?.userId === loggedInUserId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetches user profile based on the provided username
        const userQuery = query(
          collection(db, "users"),
          where("username", "==", username)
        );
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const profile = querySnapshot.docs[0].data();
          setProfileData(profile);
          
          // Check friendship status after fetching the profile
          checkFriendshipStatus(loggedInUserId, profile.userId);

          // Load additional data if access is granted
          if (
            isCurrentUserProfile ||
            !profile.privateProfile ||
            friendshipStatus === "friends"
          ) {
            fetchUserPosts(profile.userId); // Fetch user's posts
            fetchUserJobs(profile.userId); // Fetch user's job postings
            fetchUserExperiences(profile.userId); // Fetch user's experiences
          }
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        console.error("Error fetching profile:", err); // Log error to the console
        setError(err.message); // Set error state for display
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    // Fetches posts created by the user
    const fetchUserPosts = async (userId) => {
      try {
        const postsQuery = query(
          collection(db, "posts"),
          where("userId", "==", userId)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const posts = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserPosts(posts);
      } catch (err) {
        console.error("Error fetching user posts:", err);
      }
    };

    // Fetches jobs posted by the user
    const fetchUserJobs = async (userId) => {
      try {
        const jobsQuery = query(
          collection(db, "jobs"),
          where("userId", "==", userId)
        );
        const jobsSnapshot = await getDocs(jobsQuery);
        const jobs = jobsSnapshot.docs.map((doc) => ({
          jobID: doc.id,
          ...doc.data(),
        }));
        setUserJobs(jobs);
      } catch (err) {
        console.error("Error fetching user jobs:", err);
      }
    };

    // Fetches experiences listed by the user
    const fetchUserExperiences = async (userId) => {
      try {
        const experiencesQuery = query(
          collection(db, "experience"),
          where("userId", "==", userId)
        );
        const experiencesSnapshot = await getDocs(experiencesQuery);
        const experiences = experiencesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserExperiences(experiences);
      } catch (err) {
        console.error("Error fetching user experiences:", err);
      }
    };

    // Determines friendship status between the logged-in user and the profile owner
    const checkFriendshipStatus = async (loggedInUserId, profileUserId) => {
      try {
        if (loggedInUserId === profileUserId) return; // Skip if viewing own profile

        const connectionsQuery = query(
          collection(db, "Connections"),
          where("user_id", "in", [loggedInUserId, profileUserId]),
          where("connected_user_id", "in", [loggedInUserId, profileUserId])
        );
        const snapshot = await getDocs(connectionsQuery);

        if (!snapshot.empty) {
          const connection = snapshot.docs[0].data();
          if (connection.status === "blocked") {
            // Handle block statuses
            if (connection.user_id === loggedInUserId) {
              setBlockStatus("blocked");
            } else {
              setBlockStatus("blockedByOther");
            }
          } else {
            setFriendshipStatus(connection.status); // Set friendship status
          }
        }
      } catch (err) {
        console.error("Error checking friendship status:", err);
      }
    };
    // const checkBlockStatus = async (loggedInUserId, profileUserId) => {
    //   try {
    //     const connectionsQuery = query(
    //       collection(db, "Connections"),
    //       where("user_id", "in", [loggedInUserId, profileUserId]),
    //       where("connected_user_id", "in", [loggedInUserId, profileUserId])
    //     );
        
    //     const snapshot = await getDocs(connectionsQuery);

    //     if (!snapshot.empty) {
    //       const connection = snapshot.docs[0].data();
    //       if (connection.status === "blocked") {
    //         if (connection.user_id === loggedInUserId) {
    //           setBlockStatus("blocked");
    //         } else {
    //           setBlockStatus("blockedByOther");
    //         }
    //       }
    //     }
    //   } catch (err) {
    //     console.error("Error checking block status:", err);
    //   }
    // };
    fetchProfile();
  }, [username, loggedInUserId, friendshipStatus, isCurrentUserProfile]);

  // Navigates to the edit profile page
  const handleEditProfile = () => {
    navigate("/UserProfile");
  };
// Function to send a friend request
  const handleAddFriend = async () => {
    try {
      const connectionsCollectionRef = collection(db, "Connections"); // Reference to the "Connections" collection in Firestore
      await addDoc(connectionsCollectionRef, {
        user_id: loggedInUserId, // ID of the user sending the friend request
        connected_user_id: profileData.userId, // ID of the user receiving the friend request
        status: "pending", // Initial status of the friend reques
        created_at: new Date(), // Timestamp for when the request was created
      });
      setFriendshipStatus("pending"); // Update the UI to reflect the pending status
    } catch (err) {
      console.error("Error sending friend request:", err);
    }
  };
// Function to handle removing a friend
  const handleRemoveFriend = async () => {
    try {
      // Create a query to search the "Connections" collection to find the connection
      // between the logged-in user and the profile user (either user_id or connected_user_id)
      const connectionsQuery = query(
        collection(db, "Connections"), // The "Connections" collection in the Firestore database
        where("user_id", "in", [loggedInUserId, profileData.userId]), // Find documents where user_id matches either logged-in or profile user
        where("connected_user_id", "in", [loggedInUserId, profileData.userId]) // Find documents where connected_user_id matches either logged-in or profile user
      );
       // Execute the query to get the matching documents
      const snapshot = await getDocs(connectionsQuery);

      // If a matching connection is found, remove it by deleting the document
      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id; // Get the document ID of the first matching document
        await deleteDoc(doc(db, "Connections", docId)); // Delete the document from the database
        setFriendshipStatus(null); // Reset the friendship status to null
      }
    } catch (err) {
      console.error("Error removing friend:", err);
    }
  };
// Function to handle blocking a user
  const handleBlockUser = async () => {
    try {
      // Create a query to search for existing connection between the logged-in user and the profile user
      const connectionsQuery = query(
        collection(db, "Connections"),
        where("user_id", "in", [loggedInUserId, profileData.userId]),
        where("connected_user_id", "in", [loggedInUserId, profileData.userId])
      );
      // Execute the query to check if a connection exists
      const snapshot = await getDocs(connectionsQuery);

      // If a connection exists, update its status to "blocked"
      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id; // Get the document ID of the first matching document
        await updateDoc(doc(db, "Connections", docId), { status: "blocked" }); // Update the document's status field to "blocked"
      } else {
        // If no connection exists, create a new "blocked" connection
        await addDoc(collection(db, "Connections"), {
          user_id: loggedInUserId,
          connected_user_id: profileData.userId,
          status: "blocked", // Set the initial status to "blocked"
          created_at: new Date(), // Set the creation date of the new connection
        });
      }

      setBlockStatus("blocked"); // Update the state to reflect the "blocked" status
      setShowBlockUserModal(false); // Close the block user modal
    } catch (err) {
      console.error("Error blocking user:", err);
    }
  };

  // Function to handle unblocking a user
  const handleUnblockUser = async () => {
    try {
       // Create a query to search for an existing connection between the logged-in user and the profile user
      const connectionsQuery = query(
        collection(db, "Connections"),
        where("user_id", "in", [loggedInUserId, profileData.userId]),
        where("connected_user_id", "in", [loggedInUserId, profileData.userId])
      );
      // Execute the query to check if a connection exists
      const snapshot = await getDocs(connectionsQuery);

      // If a connection exists, delete it (unblock the user)
      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id; // Get the document ID of the first matching document
        await deleteDoc(doc(db, "Connections", docId)); // Delete the connection from the database
      }

      setBlockStatus(null); // Reset the block status to null (unblocked)
    } catch (err) {
      console.error("Error unblocking user:", err);
    }
  };

  // UI rendering logic for various states (loading, error, and profile not found)
  if (loading) {
    // If loading is true, display a loading spinner in the center of the screen
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
     // If an error exists, display the error message in a danger-colored alert
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!profileData) {
     // If no profile data exists, display a warning alert indicating profile not found
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="warning">Profile not found</Alert>
      </Container>
    );
  }

   // Check if the user has been blocked by the profile owner
   if (blockStatus === "blockedByOther") {
    // Display the profile container centered on the screen
    return (
      <Container className="profile-container d-flex flex-column justify-content-center align-items-center">
        <Card className="profile-card mt-3 shadow-sm">
          <Card.Body>
            <Card.Title className="text-center profile-card-title">
              {profileData.firstName} {profileData.lastName}
            </Card.Title>
            <Card.Text className="text-center">
              This user has deactivated their account.
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }
  // Check if the viewer has blocked this user
  if (blockStatus === "blocked") {
    return (
      // Display the profile container centered on the screen
      <Container className="profile-container d-flex flex-column justify-content-center align-items-center">
        <div className="profile-image-wrapper">
          <img
            src={
              profileData.profileImageUrl ||
              `https://ui-avatars.com/api/?name=${profileData.firstName}+${profileData.lastName}&background=177b7b&color=ffffff`
            }
            alt={`${profileData.firstName} ${profileData.lastName}`}
            className="profile-image"
          />
        </div>
        <Card className="profile-card mt-3 shadow-sm">
          <Card.Body>
            <Card.Title className="text-center profile-card-title">
              {profileData.firstName} {profileData.lastName}
            </Card.Title>
          </Card.Body>
        </Card>
        <Button variant="danger" onClick={handleUnblockUser}>
          Unblock User
        </Button>
      </Container>
    );
  }
  return (
    <Container className="profile-container d-flex flex-column justify-content-center align-items-center">
      {/* Wrapper for the profile image */}
      <div className="profile-image-wrapper">
        <img
          src={
            profileData.profileImageUrl ||
            `https://ui-avatars.com/api/?name=${profileData.firstName}+${profileData.lastName}&background=177b7b&color=ffffff`
          }
          alt={`${profileData.firstName} ${profileData.lastName}`}
          className="profile-image"
        />
      </div>

      {/* Profile information displayed in a card */}
      <Card className="profile-card mt-3 shadow-sm">
        <Card.Body>
          {/* Display user's name in the card title */}
          <Card.Title className="text-center profile-card-title">
            {profileData.firstName} {profileData.lastName}
          </Card.Title>
          <Card.Text className="text-center">
            {profileData.headline}
          </Card.Text>
        </Card.Body>
      </Card>

       {/* Conditional rendering: Only show the "Edit Profile" button if this is the current user's profile */}
      {isCurrentUserProfile && (
        <div className="d-flex justify-content-center align-items-center mt-3">
          <Button variant="primary" onClick={handleEditProfile}>
            Edit Profile
          </Button>
        </div>
      )}
      {/* Conditional rendering for non-current users */}
      {!isCurrentUserProfile && (
        <div className="d-flex justify-content-center align-items-center mt-2">
          {/* If the user is a friend, show the "Remove Friend" button */}
          {friendshipStatus === "friends" && (
            <Button
              variant="outline-danger"
              onClick={() => setShowRemoveFriendModal(true)}
            >
              Remove Friend
            </Button>
          )}
          {/* Modal for confirming the removal of a friend */}
          <RemoveFriendModal
            show={showRemoveFriendModal}  // Modal visibility controlled by state
            onHide={() => setShowRemoveFriendModal(false)}  // Close the modal
            onConfirm={handleRemoveFriend}  // Executes the function to remove the friend
          />
          {/* If a friend request is pending, show a disabled button */}
          {friendshipStatus === "pending" && (
            <Button variant="secondary" disabled>
              Friend Request Sent
            </Button>
          )}
          {/* If there's no friendship status, show an "Add Friend" button */}
          {friendshipStatus === null && (
            <Button variant="primary" onClick={handleAddFriend}>
              Add Friend
            </Button>
          )}
          {/* If the user is not blocked, show the "Block User" button */}
          {blockStatus !== "blocked" && (
            <Button
              variant="danger"
              className="ms-2"
              onClick={() => setShowBlockUserModal(true)}
            >
              Block User
            </Button>
          )}
        </div>
      )}

      {/* Conditional rendering for posts and job sections:
            - Show posts and experiences only if it's the current user's profile, or the profile is public,
              or the users are friends.
      */}
      {(isCurrentUserProfile ||
        !profileData.privateProfile ||
        friendshipStatus === "friends") && (
        <>
          <UserPostsSection posts={userPosts} />
          <JobPostsSection jobs={userJobs} />
          <UserExperiencesSection experiences={userExperiences} />
        </>
      )}
      {/* If it's a private profile and the viewer is not a friend, show a message indicating the profile is private */}
      {!isCurrentUserProfile &&
        profileData.privateProfile &&
        friendshipStatus !== "friends" && (
          <Card className="profile-card mt-3 shadow-sm">
            <Card.Body>
              <Card.Text className="text-center">
                This profile is private. Become friends to view more details.
              </Card.Text>
            </Card.Body>
          </Card>
        )}
      {/* Modal for blocking a user */}
      <BlockUserModal
        show={showBlockUserModal} // Controls whether the block user modal is visible
        onHide={() => setShowBlockUserModal(false)} // Closes the modal
        onConfirm={handleBlockUser} // Executes the function to block the user
      />
    </Container>
  );
};
// Export the ProfilePage component for use in other parts of the application
export default ProfilePage;
