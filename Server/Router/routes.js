const express = require("express");
const router = express.Router();
const Auth = require("../Auth/authentication")
const { Register, Login } = require("../Controller/auth_controller");
const {createStory, fetchStory, updateStory}= require("../Controller/story_controller")
const {generateSharableUrl,sharableStoryData}= require("../Controller/share_url_controller")
const { liked, unliked, bookmarked, UnBookmarked,  fetchBookmarks} = require("../Controller/bookmark&like")

router.post("/auth/register", Register);
router.post("/auth/login", Login);


router.post("/story/create",Auth, createStory);
router.get("/story/fetch", fetchStory);
router.post("/story/update", Auth,updateStory);


router.get("/story/share/:id/:slideNumber",sharableStoryData);
router.post("/story/share/generateurl",generateSharableUrl);


router.post("/story/like", Auth,liked)
router.post("/story/unlike",Auth, unliked)

router.post("/story/bookmark",Auth, bookmarked)
router.post("/story/unbookmark",Auth, UnBookmarked)
router.post("/story/fetch/bookmark",Auth, fetchBookmarks)




module.exports = router;