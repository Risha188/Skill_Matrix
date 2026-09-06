const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ======================================================
// EMAIL TRANSPORTER
// ======================================================

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ======================================================
// JWT TOKEN
// ======================================================

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

// ======================================================
// REGISTER NORMAL USER
// ======================================================

const registerUser = async (req, res) => {
    try {

        console.log("===== USER REGISTRATION =====");
        console.log("Request Body:", req.body);

        const {
            fullName,
            name,
            email,
            password
        } = req.body;

        const userName = fullName || name;

        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (!userName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const cleanName = userName.trim();
        const cleanEmail = email.toLowerCase().trim();

        // ==================================================
        // IMPORTANT:
        // PREVENT ADMIN EMAIL FROM NORMAL REGISTRATION
        // ==================================================

        if (
            cleanEmail ===
            (process.env.ADMIN_EMAIL || "poreysouvik71@gmail.com")
                .toLowerCase()
                .trim()
        ) {
            return res.status(403).json({
                success: false,
                message: "This email is reserved for administrator access"
            });
        }

        // -------------------------------
        // CHECK EXISTING USER
        // -------------------------------

        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // -------------------------------
        // HASH PASSWORD
        // -------------------------------

        const hashedPassword = await bcrypt.hash(password, 10);

        // -------------------------------
        // CREATE USER
        // -------------------------------

        const user = await User.create({
            fullName: cleanName,
            email: cleanEmail,
            password: hashedPassword,
            role: "employee",
            isActive: true,
            isEmailVerified: true
        });

        console.log("✅ USER CREATED:", user.email);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error("❌ Register User Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================================================
// LOGIN
// ======================================================

const loginUser = async (req, res) => {
    try {

        console.log("===== LOGIN REQUEST =====");
        console.log("Request Body:", req.body);

        const {
            email,
            password
        } = req.body;

        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const cleanEmail = email.toLowerCase().trim();

        // -------------------------------
        // FIND USER
        // -------------------------------

        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // -------------------------------
        // CHECK ACTIVE
        // -------------------------------

        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }

        // -------------------------------
        // CHECK PASSWORD
        // -------------------------------

        if (!user.password) {
            return res.status(401).json({
                success: false,
                message: "Password is not configured for this account"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // -------------------------------
        // GENERATE JWT
        // -------------------------------

        const token = generateToken(user);

        console.log(
            `✅ LOGIN SUCCESS: ${user.email} | ROLE: ${user.role}`
        );

        // -------------------------------
        // RESPONSE
        // -------------------------------

        return res.status(200).json({
            success: true,
            message: "Login successful",

            token,

            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                isEmailVerified: user.isEmailVerified
            }
        });

    } catch (error) {

        console.error("❌ Login Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================================================
// FORGOT PASSWORD
// ======================================================

const forgotPassword = async (req, res) => {
    try {

        console.log("===== FORGOT PASSWORD =====");

        const {
            email
        } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const cleanEmail = email.toLowerCase().trim();

        // -------------------------------
        // FIND USER
        // -------------------------------

        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email"
            });
        }

        // -------------------------------
        // GENERATE OTP
        // -------------------------------

        const resetCode =
            Math.floor(
                100000 + Math.random() * 900000
            ).toString();

        const resetCodeExpires =
            new Date(
                Date.now() + 10 * 60 * 1000
            );

        // -------------------------------
        // SAVE OTP
        // -------------------------------

        user.resetCode = resetCode;
        user.resetCodeExpires = resetCodeExpires;

        await user.save();

        // -------------------------------
        // SEND EMAIL
        // -------------------------------

        const mailOptions = {
            from: `"SkillMatrix" <${process.env.EMAIL_USER}>`,
            to: cleanEmail,
            subject: "SkillMatrix Password Reset Code",

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    background: #ffffff;
                ">

                    <h2 style="color:#1e293b;">
                        SkillMatrix Password Reset
                    </h2>

                    <p>
                        Hello <strong>${user.fullName}</strong>,
                    </p>

                    <p>
                        We received a request to reset your
                        SkillMatrix account password.
                    </p>

                    <p>
                        Your password reset code is:
                    </p>

                    <div style="
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        color: #2563eb;
                        background: #eff6ff;
                        padding: 20px;
                        text-align: center;
                        border-radius: 10px;
                        margin: 20px 0;
                    ">
                        ${resetCode}
                    </div>

                    <p>
                        This code will expire in
                        <strong>10 minutes</strong>.
                    </p>

                    <p>
                        If you did not request a password reset,
                        please ignore this email.
                    </p>

                    <hr />

                    <p style="
                        color:#64748b;
                        font-size:12px;
                    ">
                        © ${new Date().getFullYear()} SkillMatrix
                    </p>

                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        console.log(
            "✅ RESET CODE SENT TO:",
            cleanEmail
        );

        return res.status(200).json({
            success: true,
            message: "Password reset code sent successfully",
            email: cleanEmail
        });

    } catch (error) {

        console.error(
            "❌ Forgot Password Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================================================
// VERIFY RESET CODE
// ======================================================

const verifyResetCode = async (req, res) => {
    try {

        const {
            email,
            resetCode
        } = req.body;

        if (!email || !resetCode) {
            return res.status(400).json({
                success: false,
                message: "Email and reset code are required"
            });
        }

        const cleanEmail = email.toLowerCase().trim();
        const cleanCode = resetCode.toString().trim();

        // -------------------------------
        // FIND USER
        // -------------------------------

        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // -------------------------------
        // CHECK CODE
        // -------------------------------

        if (user.resetCode !== cleanCode) {
            return res.status(400).json({
                success: false,
                message: "Invalid reset code"
            });
        }

        // -------------------------------
        // CHECK EXPIRY
        // -------------------------------

        if (
            !user.resetCodeExpires ||
            user.resetCodeExpires < new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "Reset code has expired"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reset code verified successfully",
            email: cleanEmail
        });

    } catch (error) {

        console.error(
            "❌ Verify Reset Code Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================================================
// RESET PASSWORD
// ======================================================

const resetPassword = async (req, res) => {
    try {

        console.log("===== RESET PASSWORD =====");

        const {
            email,
            resetCode,
            newPassword,
            confirmPassword
        } = req.body;

        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (
            !email ||
            !resetCode ||
            !newPassword ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Email, reset code, new password and confirm password are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters"
            });
        }

        const cleanEmail = email.toLowerCase().trim();
        const cleanCode = resetCode.toString().trim();

        // -------------------------------
        // FIND USER
        // -------------------------------

        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // -------------------------------
        // VERIFY RESET CODE
        // -------------------------------

        if (user.resetCode !== cleanCode) {
            return res.status(400).json({
                success: false,
                message: "Invalid reset code"
            });
        }

        // -------------------------------
        // CHECK EXPIRY
        // -------------------------------

        if (
            !user.resetCodeExpires ||
            user.resetCodeExpires < new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "Reset code has expired"
            });
        }

        // -------------------------------
        // HASH NEW PASSWORD
        // -------------------------------

        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        // -------------------------------
        // CLEAR RESET DATA
        // -------------------------------

        user.resetCode = null;
        user.resetCodeExpires = null;

        await user.save();

        console.log(
            "✅ PASSWORD RESET SUCCESS:",
            user.email
        );

        return res.status(200).json({
            success: true,
            message:
                "Password reset successfully"
        });

    } catch (error) {

        console.error(
            "❌ Reset Password Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================================================
// GET CURRENT USER
// ======================================================

const getCurrentUser = async (req, res) => {
    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.error(
            "❌ Get Current User Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    getCurrentUser
};