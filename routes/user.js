const express = require("express");
const { handleGetAllUsers, handleDeleteUserById, handleUpdateUserById, handleGetUserById, handleCreateNewUser } = require("../controllers/user");

const router = express.Router();

// router.get('/users', async (req, res) => {
//     const dbUsers = await User.find({})
//     const html = `
//      <ul>
//         ${dbUsers
//            .map((users) => `<li>${users.firstName} - ${users.email}</li>`)
//            .join(" ")}
//      </ul>
//     `;
//     res.send(html)
// })


// Rest API
router.route("/")
    .get(handleGetAllUsers)
    .post(handleCreateNewUser)

// Dynamic Path
router.route("/:id")
    .get(handleGetUserById)
    .patch(handleUpdateUserById)  
    .delete(handleDeleteUserById)



module.exports = router;  