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

  const handleRemoveFriend = async () => {
    try {
      const connectionsQuery = query(
        collection(db, "Connections"),
        where("user_id", "in", [loggedInUserId, profileData.userId]),
        where("connected_user_id", "in", [loggedInUserId, profileData.userId])
      );
      const snapshot = await getDocs(connectionsQuery);

      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        await deleteDoc(doc(db, "Connections", docId));
        setFriendshipStatus(null);
      }
    } catch (err) {
      console.error("Error removing friend:", err);
    }
  };

  const handleBlockUser = async () => {
    try {
      const connectionsQuery = query(
        collection(db, "Connections"),
        where("user_id", "in", [loggedInUserId, profileData.userId]),
        where("connected_user_id", "in", [loggedInUserId, profileData.userId])
      );
      const snapshot = await getDocs(connectionsQuery);

      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        await updateDoc(doc(db, "Connections", docId), { status: "blocked" });
      } else {
        await addDoc(collection(db, "Connections"), {
          user_id: loggedInUserId,
          connected_user_id: profileData.userId,
          status: "blocked",
          created_at: new Date(),
        });
      }

      setBlockStatus("blocked");
      setShowBlockUserModal(false);
    } catch (err) {
      console.error("Error blocking user:", err);
    }
  };

  const handleUnblockUser = async () => {
    try {
      const connectionsQuery = query(
        collection(db, "Connections"),
        where("user_id", "in", [loggedInUserId, profileData.userId]),
        where("connected_user_id", "in", [loggedInUserId, profileData.userId])
      );
      const snapshot = await getDocs(connectionsQuery);

      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        await deleteDoc(doc(db, "Connections", docId));
      }

      setBlockStatus(null);
    } catch (err) {
      console.error("Error unblocking user:", err);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="warning">Profile not found</Alert>
      </Container>
    );
  }

   // Show only name if the viewer is blocked by the profile owner
   if (blockStatus === "blockedByOther") {
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

  if (blockStatus === "blocked") {
    return (
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
          <Card.Text className="text-center">
            {profileData.headline}
          </Card.Text>
        </Card.Body>
      </Card>

      {isCurrentUserProfile && (
        <div className="d-flex justify-content-center align-items-center mt-3">
          <Button variant="primary" onClick={handleEditProfile}>
            Edit Profile
          </Button>
        </div>
      )}
      {!isCurrentUserProfile && (
        <div className="d-flex justify-content-center align-items-center mt-2">
          {friendshipStatus === "friends" && (
            <Button
              variant="outline-danger"
              onClick={() => setShowRemoveFriendModal(true)}
            >
              Remove Friend
            </Button>
          )}
          {friendshipStatus === "pending" && (
            <Button variant="secondary" disabled>
              Friend Request Sent
            </Button>
          )}
          {friendshipStatus === null && (
            <Button variant="primary" onClick={handleAddFriend}>
              Add Friend
            </Button>
          )}
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

      {(isCurrentUserProfile ||
        !profileData.privateProfile ||
        friendshipStatus === "friends") && (
        <>
          <UserPostsSection posts={userPosts} />
          <JobPostsSection jobs={userJobs} />
          <UserExperiencesSection experiences={userExperiences} />
        </>
      )}

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

      <BlockUserModal
        show={showBlockUserModal}
        onHide={() => setShowBlockUserModal(false)}
        onConfirm={handleBlockUser}
      />
    </Container>
  );
};

export default ProfilePage;
