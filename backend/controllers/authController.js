import User from "../model/User.js";
import Employee from "../model/Employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
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
// GENERATE 6 DIGIT CODE
// ======================================================

const generateVerificationCode = () => {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
};

// ======================================================
// SEND ADMIN VERIFICATION EMAIL
// ======================================================

const sendAdminVerificationEmail = async (
    email,
    fullName,
    code
) => {
    await transporter.sendMail({
        from: `"SkillMatrix" <${process.env.EMAIL_USER}>`,

        to: email,

        subject:
            "SkillMatrix - Admin Verification Code",

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
                border: 1px solid #ddd;
                border-radius: 10px;
            ">

                <h2 style="color:#2563eb;">
                    SkillMatrix Admin Registration
                </h2>

                <p>
                    Hello <strong>${fullName}</strong>,
                </p>

                <p>
                    You are creating a SkillMatrix Admin account.
                </p>

                <p>
                    Your verification code is:
                </p>

                <div style="
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:8px;
                    color:#2563eb;
                    padding:20px;
                    background:#f3f4f6;
                    text-align:center;
                    border-radius:8px;
                ">
                    ${code}
                </div>

                <p>
                    This verification code will expire in
                    <strong>10 minutes</strong>.
                </p>

                <p>
                    After verification, you will create your
                    admin password.
                </p>

                <hr>

                <p style="
                    color:#777;
                    font-size:12px;
                ">
                    SkillMatrix Admin Portal
                </p>

            </div>
        `
    });
};

// ======================================================
// SEND EMPLOYEE VERIFICATION EMAIL
// ======================================================

const sendVerificationEmail = async (
    email,
    fullName,
    code
) => {
    await transporter.sendMail({
        from: `"SkillMatrix" <${process.env.EMAIL_USER}>`,

        to: email,

        subject:
            "SkillMatrix - Email Verification Code",

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
                border: 1px solid #ddd;
                border-radius: 10px;
            ">

                <h2 style="color:#2563eb;">
                    Welcome to SkillMatrix
                </h2>

                <p>
                    Hello <strong>${fullName}</strong>,
                </p>

                <p>
                    Thank you for creating your
                    SkillMatrix employee account.
                </p>

                <p>
                    Your email verification code is:
                </p>

                <div style="
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:8px;
                    color:#2563eb;
                    padding:20px;
                    background:#f3f4f6;
                    text-align:center;
                    border-radius:8px;
                ">
                    ${code}
                </div>

                <p>
                    This verification code will expire in
                    <strong>10 minutes</strong>.
                </p>

                <p>
                    If you did not create this account,
                    you can safely ignore this email.
                </p>

                <hr>

                <p style="
                    color:#777;
                    font-size:12px;
                ">
                    SkillMatrix Employee Portal
                </p>

            </div>
        `
    });
};

// ======================================================
// REGISTER USER
// POST /api/auth/register
// ======================================================

const registerUser = async (req, res) => {
    try {

        console.log("=================================");
        console.log("🔥 REGISTER API HIT");
        console.log("BODY:", req.body);
        console.log("=================================");

        const {
            fullName,
            email
        } = req.body;

        // ==================================================
        // VALIDATION
        // ==================================================

        if (!fullName || !email) {
            return res.status(400).json({
                success: false,
                message:
                    "Full name and email are required"
            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const normalizedName =
            fullName.trim();

        // ==================================================
        // EMAIL FORMAT
        // ==================================================

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid email address"
            });
        }

        // ==================================================
        // CHECK EXISTING USER
        // ==================================================

        const existingUser =
            await User.findOne({
                email: normalizedEmail
            });

        if (existingUser) {

            // Already verified
            if (existingUser.isEmailVerified) {
                return res.status(400).json({
                    success: false,
                    message:
                        "An account with this email already exists"
                });
            }

            // ==================================================
            // RESEND VERIFICATION
            // ==================================================

            const verificationCode =
                generateVerificationCode();

            const verificationCodeExpires =
                new Date(
                    Date.now() +
                    10 * 60 * 1000
                );

            existingUser.fullName =
                normalizedName;

            existingUser.verificationCode =
                verificationCode;

            existingUser.verificationCodeExpires =
                verificationCodeExpires;

            await existingUser.save();

            try {

                await sendVerificationEmail(
                    normalizedEmail,
                    normalizedName,
                    verificationCode
                );

            } catch (emailError) {

                console.error(
                    "❌ Verification email error:",
                    emailError
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Unable to send verification email. Please try again."
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    "Verification code sent to your email",
                email:
                    normalizedEmail
            });
        }

        // ==================================================
        // CREATE VERIFICATION CODE
        // ==================================================

        const verificationCode =
            generateVerificationCode();

        const verificationCodeExpires =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );

        // ==================================================
        // CREATE EMPLOYEE
        // ==================================================

        const user =
            await User.create({

                fullName:
                    normalizedName,

                email:
                    normalizedEmail,

                password:
                    null,

                role:
                    "employee",

                isActive:
                    true,

                isEmailVerified:
                    false,

                verificationCode,

                verificationCodeExpires
            });

        console.log(
            "Employee registration created:",
            user._id
        );

        // ==================================================
        // SEND EMAIL
        // ==================================================

        try {

            await sendVerificationEmail(
                normalizedEmail,
                normalizedName,
                verificationCode
            );

        } catch (emailError) {

            console.error(
                "❌ Verification email error:",
                emailError
            );

            await User.findByIdAndDelete(
                user._id
            );

            return res.status(500).json({
                success: false,
                message:
                    "Unable to send verification email. Please try again."
            });
        }

        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(201).json({
            success: true,

            message:
                "Verification code sent to your email",

            email:
                user.email,

            userId:
                user._id
        });

    } catch (error) {

        console.error(
            "❌ Registration Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error during registration"
        });
    }
};

// ======================================================
// VERIFY EMAIL
// POST /api/auth/verify
// ======================================================


const verifyEmail = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        // Validate required fields
        if (!email || !verificationCode) {
            return res.status(400).json({
                success: false,
                message: "Email and verification code are required."
            });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const cleanCode = String(verificationCode).trim();

        // Validate email and OTP format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        if (!/^\d{6}$/.test(cleanCode)) {
            return res.status(400).json({
                success: false,
                message: "Verification code must contain exactly 6 digits."
            });
        }

        // Find user
        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please register again."
            });
        }

        // Check account status
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive. Please contact the administrator."
            });
        }

        // Check whether already verified
        if (user.isEmailVerified) {
            return res.status(200).json({
                success: true,
                message: "Your email is already verified."
            });
        }

        // Check whether a verification code exists
        if (!user.verificationCode || !user.verificationCodeExpires) {
            return res.status(400).json({
                success: false,
                message: "No active verification code found. Please register again or request a new code."
            });
        }

        // Check expiration
        const expiryTime = new Date(user.verificationCodeExpires).getTime();

        if (!Number.isFinite(expiryTime) || expiryTime <= Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Verification code has expired. Please request a new code."
            });
        }

        // Compare verification codes
        const storedCode = String(user.verificationCode).trim();

        if (storedCode !== cleanCode) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code. Please enter the latest code sent to your email."
            });
        }

        // Mark email as verified
        user.isEmailVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Verify Email Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while verifying your email."
        });
    }
};


// ======================================================
// SET PASSWORD
// POST /api/auth/set-password
// ======================================================

const setPassword = async (req, res) => {
    try {

        console.log(
            "===== SET PASSWORD ====="
        );

        console.log(
            "BODY:",
            req.body
        );

        const {
            email,
            password,
            confirmPassword
        } = req.body;

        // ==================================================
        // VALIDATION
        // ==================================================

        if (
            !email ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Email, password and confirm password are required"
            });
        }

        if (
            password !==
            confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Password and confirm password do not match"
            });
        }

        if (
            password.length < 8
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 8 characters long"
            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        // ==================================================
        // FIND USER
        // ==================================================

        const user =
            await User.findOne({
                email:
                    normalizedEmail
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found"
            });
        }

        // ==================================================
        // EMAIL VERIFIED
        // ==================================================

        if (
            !user.isEmailVerified
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Please verify your email first"
            });
        }

        // ==================================================
        // PREVENT REPLACEMENT
        // ==================================================

        if (user.password) {
            return res.status(400).json({
                success: false,
                message:
                    "Password has already been created. Please login."
            });
        }

        // ==================================================
        // HASH PASSWORD
        // ==================================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        user.password =
            hashedPassword;

        await user.save();

        console.log(
            "✅ PASSWORD CREATED:",
            user.email
        );

        return res.status(200).json({
            success: true,

            message:
                "Password created successfully. You can now login."
        });

    } catch (error) {

        console.error(
            "❌ Set Password Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while creating password"
        });
    }
};

// ======================================================
// LOGIN USER
// POST /api/auth/login
// ======================================================

// ======================================================
// LOGIN USER
// POST /api/auth/login
// ======================================================

const loginUser = async (req, res) => {
    try {

        console.log("=================================");
        console.log("========== LOGIN REQUEST =========");
        console.log("=================================");

        const { email, password } = req.body;


        // ==================================================
        // VALIDATION
        // ==================================================

        if (
            typeof email !== "string" ||
            !email.trim() ||
            typeof password !== "string" ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }


        // ==================================================
        // NORMALIZE EMAIL
        // ==================================================

        const cleanEmail = email.trim().toLowerCase();

        // DO NOT trim password
        const loginPassword = password;


        console.log("Login Email:", cleanEmail);
        console.log("Password Length:", loginPassword.length);


        // ==================================================
        // FIND USER
        // ==================================================

        const user = await User.findOne({
            email: cleanEmail
        });


        if (!user) {

            console.log("❌ USER NOT FOUND");

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }


        console.log("✅ USER FOUND");
        console.log("User ID:", user._id.toString());
        console.log("Role:", user.role);


        // ==================================================
        // ACCOUNT STATUS
        // ==================================================

        if (user.isActive === false) {

            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated."
            });
        }


        // ==================================================
        // PASSWORD
        // ==================================================

        if (!user.password) {

            return res.status(401).json({
                success: false,
                message:
                    "Password has not been created. Please complete Set Password first."
            });
        }


        // ==================================================
        // CHECK PASSWORD
        // ==================================================

        const passwordMatch = await bcrypt.compare(
            loginPassword,
            user.password
        );


        if (!passwordMatch) {

            console.log("❌ PASSWORD DOES NOT MATCH");

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }


        console.log("✅ PASSWORD MATCH");


        // ==================================================
        // EMAIL VERIFICATION
        // ==================================================

        if (
            user.role === "employee" &&
            user.isEmailVerified !== true
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Please verify your email before logging in."
            });
        }


        // ==================================================
        // JWT SECRET
        // ==================================================

        if (!process.env.JWT_SECRET) {

            console.error("❌ JWT_SECRET missing");

            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not configured."
            });
        }


        // ==================================================
        // EMPLOYEE PROFILE
        // ==================================================

        let employee = null;


        if (user.role === "employee") {

            console.log("=================================");
            console.log("🔎 FINDING EMPLOYEE PROFILE");
            console.log("=================================");


            // --------------------------------------------------
            // FIND BY USER ID
            // --------------------------------------------------

            employee = await Employee.findOne({
                userId: user._id
            });


            // --------------------------------------------------
            // IF NOT FOUND, FIND BY EMAIL
            // --------------------------------------------------

            if (!employee) {

                console.log(
                    "⚠️ Employee not found by userId."
                );

                employee = await Employee.findOne({
                    email: cleanEmail
                });
            }


            // --------------------------------------------------
            // EXISTING EMPLOYEE FOUND
            // --------------------------------------------------

            if (employee) {

                console.log(
                    "✅ Employee found:",
                    employee.employeeId
                );


                // ------------------------------------------------
                // LINK OLD EMPLOYEE TO USER
                // ------------------------------------------------

                if (!employee.userId) {

                    console.log(
                        "🔧 Linking Employee to User..."
                    );

                    await Employee.updateOne(
                        {
                            _id: employee._id
                        },
                        {
                            $set: {
                                userId: user._id,
                                email: cleanEmail
                            }
                        }
                    );


                    employee.userId = user._id;
                    employee.email = cleanEmail;


                    console.log(
                        "✅ Employee linked successfully."
                    );
                }
            }


            // --------------------------------------------------
            // CREATE EMPLOYEE IF IT DOES NOT EXIST
            // --------------------------------------------------

            if (!employee) {

                console.log(
                    "⚠️ Employee profile does not exist."
                );

                console.log(
                    "🔧 Creating employee profile..."
                );


                // Generate a SAFE unique employee ID
                const employeeId =
                    `EMP${Date.now()}`;


                // Get name
                const fullName =
                    String(
                        user.fullName || ""
                    ).trim();


                const nameParts =
                    fullName
                        .split(/\s+/)
                        .filter(Boolean);


                const firstName =
                    nameParts.shift() || "";


                const lastName =
                    nameParts.join(" ");


                employee =
                    await Employee.create({

                        userId: user._id,

                        employeeId: employeeId,

                        email: cleanEmail,

                        personalDetails: {

                            firstName: firstName,

                            lastName: lastName,

                            phone: "",

                            alternatePhone: "",

                            dateOfBirth: null,

                            gender: ""
                        },

                        education: [],

                        address: {

                            current: {},

                            permanent: {},

                            sameAsCurrent: false
                        },

                        skills: [],

                        isFresher: false,

                        workExperience: [],

                        bdmDetails: {

                            nonTechnicalSkills: [],

                            languagesKnown: [],

                            hobbies: [],

                            areasOfInterest: [],

                            keyStrengths: "",

                            additionalInformation: ""
                        },

                        profileCompleted: false
                    });


                console.log(
                    "✅ EMPLOYEE CREATED:",
                    employee.employeeId
                );
            }


            // --------------------------------------------------
            // FINAL CHECK
            // --------------------------------------------------

            if (!employee) {

                return res.status(500).json({
                    success: false,
                    message:
                        "Employee profile could not be loaded."
                });
            }
        }


        // ==================================================
        // CREATE JWT
        // ==================================================

        const token = jwt.sign(

            {
                userId: user._id.toString(),

                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }
        );


        // ==================================================
        // SAFE USER
        // ==================================================

        const safeUser = {

            id: user._id,

            fullName: user.fullName,

            email: user.email,

            role: user.role,

            employeeId:
                employee?.employeeId || null
        };


        // ==================================================
        // FINAL LOGIN RESPONSE
        // ==================================================

        console.log("=================================");
        console.log("✅ LOGIN SUCCESS");
        console.log("Email:", user.email);
        console.log("Role:", user.role);
        console.log(
            "Employee ID:",
            employee?.employeeId || "N/A"
        );
        console.log("=================================");


        return res.status(200).json({

            success: true,

            message: "Login successful.",

            token: token,

            user: safeUser,

            employee: employee || null,

            employeeId:
                employee?.employeeId || null
        });


    } catch (error) {
    console.error("LOGIN SERVER ERROR:", error.message);

    return res.status(500).json({
        success: false,
        message: "Server error during login."
    });
}
};

const forgotPassword = async (
    req,
    res
) => {
    try {

        console.log(
            "===== FORGOT PASSWORD ====="
        );

        const {
            email
        } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message:
                    "Email is required"
            });
        }

        const cleanEmail =
            email.toLowerCase().trim();

        // ==================================================
        // EMPLOYEE ONLY
        // ==================================================

        const user =
            await User.findOne({
                email:
                    cleanEmail,

                role:
                    "employee"
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "No employee account found with this email"
            });
        }

        if (
            user.isActive === false
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Your account has been deactivated"
            });
        }

        // ==================================================
        // GENERATE RESET CODE
        // ==================================================

        const resetCode =
            generateVerificationCode();

        const resetCodeExpires =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );

        // ==================================================
        // SAVE USING ACTUAL MODEL FIELDS
        // ==================================================

        user.resetCode =
            resetCode;

        user.resetCodeExpires =
            resetCodeExpires;

        await user.save();

        // ==================================================
        // EMAIL
        // ==================================================

        await transporter.sendMail({
            from:
                `"SkillMatrix" <${process.env.EMAIL_USER}>`,

            to:
                cleanEmail,

            subject:
                "SkillMatrix Password Reset Code",

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
                        Hello
                        <strong>
                            ${user.fullName}
                        </strong>,
                    </p>

                    <p>
                        Your password reset code is:
                    </p>

                    <div style="
                        font-size:32px;
                        font-weight:bold;
                        letter-spacing:8px;
                        color:#2563eb;
                        background:#eff6ff;
                        padding:20px;
                        text-align:center;
                        border-radius:10px;
                        margin:20px 0;
                    ">
                        ${resetCode}
                    </div>

                    <p>
                        This code will expire in
                        <strong>
                            10 minutes
                        </strong>.
                    </p>

                    <p>
                        If you did not request a password reset,
                        please ignore this email.
                    </p>

                    <hr>

                    <p style="
                        color:#64748b;
                        font-size:12px;
                    ">
                        © ${new Date().getFullYear()}
                        SkillMatrix
                    </p>

                </div>
            `
        });

        console.log(
            "✅ RESET CODE SENT:",
            cleanEmail
        );

        return res.status(200).json({
            success: true,

            message:
                "Reset code sent successfully",

            email:
                cleanEmail
        });

    } catch (error) {

        console.error(
            "❌ Forgot Password Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message
        });
    }
};

// ======================================================
// VERIFY RESET CODE
// POST /api/auth/verify-reset-code
// ======================================================

const verifyResetOTP = async (
    req,
    res
) => {
    try {

        const {
            email,
            resetCode
        } = req.body;

        if (
            !email ||
            !resetCode
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and reset code are required"
            });
        }

        const cleanEmail =
            email.toLowerCase().trim();

        const cleanCode =
            resetCode
                .toString()
                .trim();

        const user =
            await User.findOne({
                email:
                    cleanEmail,

                role:
                    "employee"
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "Employee account not found"
            });
        }

        // ==================================================
        // CODE CHECK
        // ==================================================

        if (
            user.resetCode !==
            cleanCode
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid reset code"
            });
        }

        // ==================================================
        // EXPIRATION
        // ==================================================

        if (
            !user.resetCodeExpires ||
            user.resetCodeExpires <
                new Date()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Reset code has expired"
            });
        }

        // ==================================================
        // IMPORTANT
        // Store temporary verification state
        //
        // We use resetCode itself as proof that
        // the code was verified. It will be cleared
        // only after password reset.
        // ==================================================

        return res.status(200).json({
            success: true,

            message:
                "Reset code verified successfully",

            email:
                cleanEmail
        });

    } catch (error) {

        console.error(
            "❌ Verify Reset Code Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message
        });
    }
};

// ======================================================
// RESET PASSWORD
// POST /api/auth/reset-password
// ======================================================


const resetPassword = async (req, res) => {
    try {
        const {
            email,
            resetCode,
            newPassword,
            confirmPassword
        } = req.body;

        // 1. Validate required fields
        if (
            !email ||
            !resetCode ||
            !newPassword ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // 2. Normalize email
        const cleanEmail = String(email).trim().toLowerCase();
        const cleanResetCode = String(resetCode).trim();

        // 3. Validate password
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match."
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }

        // 4. Find employee account
        const user = await User.findOne({
            email: cleanEmail,
            role: "employee"
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Employee account not found."
            });
        }

        // 5. Verify reset code
        if (
            !user.resetCode ||
            user.resetCode !== cleanResetCode
        ) {
            return res.status(403).json({
                success: false,
                message: "Invalid reset code. Please verify again."
            });
        }

        // 6. Check expiration
        if (
            !user.resetCodeExpires ||
            new Date(user.resetCodeExpires).getTime() <= Date.now()
        ) {
            return res.status(400).json({
                success: false,
                message: "Password reset code has expired. Request a new code."
            });
        }

        // 7. Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        // 8. Clear reset code
        user.resetCode = null;
        user.resetCodeExpires = null;

        await user.save();

        console.log("✅ Password reset completed.");

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please log in."
        });

    } catch (error) {
        console.error("❌ Reset Password Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to reset password. Please try again."
        });
    }
};


// ======================================================
// EXPORTS
// ======================================================

export {
    registerUser,
    verifyEmail,
    setPassword,
    loginUser,
    forgotPassword,
    verifyResetOTP,
    resetPassword
};