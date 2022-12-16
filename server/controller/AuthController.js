const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createToken = require("../helper/createToken");
const authController = {
  handleLogin: async (req, res) => {
    try {
      const { username, password } = req.body;

      const foundUser = await User.findOne({ username }).exec();
      if (!foundUser) {
        res.status(401).json({ message: "Invalid Username or Password!" });
      } else {
        const match = await bcrypt.compare(password, foundUser.password);

        if (match) {
          //create JWTs
          const userObject = {
            UserInfo: {
              username: foundUser.username,
              userType: foundUser.userType,
            },
          };
          const accessToken = createToken.access(userObject);
          const refreshToken = createToken.refresh({
            username: foundUser.username,
          });
       

          // Saving RefreshToken with Current User
          foundUser.refreshToken = refreshToken;
          const result = await foundUser.save();
          console.log(result);

          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          // res.json({ sucess: `Users ${user} is logged in!` });

          res.json({ userType: foundUser.userType, accessToken });
        } else {
          res.status(401).json({ message: "Invalid Username/Password!" });
        }
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: authController.js:42 ~ handleLogin: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = authController;
