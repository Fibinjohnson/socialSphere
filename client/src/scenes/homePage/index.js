import { Box, useMediaQuery } from "@mui/material";
import NavPage from "scenes/navbarPage";
import UserWidgets from "widgets/UserWidgets";
import MyPostsWidgets from "widgets/MyPostsWidgets";
import PostsWidget from "widgets/PostsWidget";
import { useSelector } from "react-redux";
import AdvertWidget from "widgets/AdvertWidget";
import FriendListWidget from "widgets/FriendListWidget";

const HomePage = () => {
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
  const { _id, picture } = useSelector((state) => state.user);

  return (
    <Box>
      <NavPage />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreen ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreen ? "26%" : undefined}>
          <UserWidgets userId={_id} picturePath={picture}></UserWidgets>
        </Box>
        <Box
          flexBasis={isNonMobileScreen ? "42%" : undefined}
          mt={isNonMobileScreen ? undefined : "2rem"}
        >
          <MyPostsWidgets picturePath={picture} />
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreen && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default HomePage;
