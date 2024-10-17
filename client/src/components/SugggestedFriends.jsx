import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IconButton } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FlexBetween from "./Flexbetween";
import UserImage from "./UserImages.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import config from "../config";
import Modal from "./Modal";
import { setFriends } from "state";

function SugggestedFriends() {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [friendList, setFriendList] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const [openModal, setOpenModal] = useState(false);
  const friends = useSelector((state) => state.user.friends);
  const isFriend = (friendId) => friendList.includes(friendId);
  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await fetch(
        `${config.API_SERVER}/users/${_id}/allusers`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      const dataExceptUser = data.filter((user) => user._id !== _id);
      setAllUsers(dataExceptUser);
    } catch (error) {
      console.error(error);
    }
  };
  const handleOpenModal = (user) => {
    try {
      setOpenModal(true);
      setSelectedUser(user);
    } catch (error) {
      setOpenModal(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  useEffect(() => {
    setFriendList(friends);
  }, [friends]);
  return (
    <div>
      <h3>People you might know</h3>
      {openModal && (
        <Modal
          setOpenModal={setOpenModal}
          selectedUser={selectedUser}
          isFriend={isFriend(selectedUser._id)}
        />
      )}
      {allUsers &&
        allUsers.map((user) => (
          <FlexBetween key={user._id}>
            <FlexBetween gap={"1rem"} paddingTop={"20px"}>
              <UserImage size="55px" image={user.picture} />
              <Box onClick={() => navigate(`/profile/${user._id}`)}>
                <Typography
                  color={main}
                  variant="h5"
                  fontWeight="500"
                  sx={{
                    ":hover": {
                      color: palette.primary.light,
                      cursor: "pointer",
                    },
                  }}
                >
                  {`${user.firstname} ${user.lastname}`}
                </Typography>
                <Typography color={medium} fontSize="0.75rem">
                  {user.subtitle}
                </Typography>
              </Box>
              <>
                <Box>
                  <IconButton onClick={() => handleOpenModal(user)}>
                    <PersonAddIcon />
                  </IconButton>
                </Box>
              </>
            </FlexBetween>
          </FlexBetween>
        ))}
    </div>
  );
}

export default SugggestedFriends;
