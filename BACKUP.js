
const User = require('./models/User')
const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    let accessToken = req.cookies.jwt

    //if there is not token in the cookies, request is unauthorized
    if (!accessToken) {
        return res.status(403).json({
            error: "Unauthorized",
        })
    }

    let payload;
    try {
        //verify the token using jwt.verifty
        //throws an error if token has expired or has an invalid signature
        payload = jwt.verify(accessToken, process.env.JWT_SECRET)
        req._id = payload._id

        next()
    } catch (err) {
        //return the req unauthorized error
        return res.status(403).json({
            error: "Unauthorized",
        })
    }
}

const filterLoggedInUser = (req, res, next) => {
    let accessToken = req.cookies.jwt

    if (!accessToken) {
        next()
    } else return res.status(403).json({error: "User already logged in"})


}

const register = async (req, res) => {
    const usernameExists = await User.findOne({
        username: req.body.username
    })
    const emailExists = await User.findOne({
        email: req.body.email
    })

    if (usernameExists) {
        return res.status(403).json({
            error: "Username is taken",
        })
    }

    if (emailExists) {
        return res.status(403).json({
            error: "Email is taken",
        })
    }

    const user = new User(req.body)
    await user.save()

    res.status(201).json({
        message: "Sign up successful! Login to proceed"
    })
}

const login = async (req, res) => {
    // find the user based on the email
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                error: "Invalid Credentials",
            })
        }

        //if user is found, we use the authenticate methods
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Invalid email or password",
            })
        }//if pass is incorrect

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "24h"
        })

        res.cookie("jwt", token, { expire: new Date() + 9999, httpOnly: true });


        const { username } = user;
        return res.json({
            message: 'Login successful',
            username,
        })
    } catch (err) {
        return res.status(500).json({
            error: "Server Error",
        })
    }
}


const userRegisterValidator = (req, res, next) => {
    // username is not null
    args.check("username", "Username is required").notEmpty()

    //email is not null, valid and normalized
    args.check("email", "Email is required").notEmpty()
    args.check("email", "Invalid email").isEmail()

    args.check("password", "Password is required").notEmpty()
    args.check("password")
        .isLength({ min: 6 })
        .withMessage("Password must contain more than 6 characters")
    args.check("password", "Password must have at least 1 uppercase letter, 1 lowercase letter and 1 number")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
            "i"
        )

    const errors = req.validationErrors()

    if (errors) {
        const firstError = errors.map((err) => err.msg)[0]

        return res.status(400).json({
            error: firstError
        })
    }

    next()
}

const userById = async (req, res, next) => {
    try {
        let user = await User.findById(req._id)
        if (!user) {
            return res.status(400).json({
                error: "User not found"
            })
        }
        req.user = user
        next()
    } catch (err) {
        return res.status(500).json({error: "Server error"})
    }
}


const getLoggedInUser = (req, res) => {
    const { username, email} = req.user;
    return res.status(200).json({
        message: "User is still logged in",
        username,
        email
    })
}

const logout = (req, res) => {
    res.clearCookie("jwt")

    return res.json({
        message: "Logout successful"
    })
}


router.post('/login', filterLoggedInUser, login)
router.post('/register', filterLoggedInUser, userRegisterValidator, register)
router.get('/user', verifyToken, userById, getLoggedInUser)
router.get('/logout', logout)

app.use("/", router)