const User = require("../model/User");
const bcrypt = require("bcryptjs");

const createDefaultAdmin = async () => {
    try {

        const email =
            process.env.DEFAULT_ADMIN_EMAIL
                ?.trim()
                .toLowerCase();

        const password =
            process.env.DEFAULT_ADMIN_PASSWORD;
        console.log("DEFAULT ADMIN CHECK");

        if (!email || !password) {

            console.log(
                "❌ DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD is missing"
            );

            return;
        }

        console.log(
            "Admin Email:",
            email
        );

        console.log(
            "Admin Password Length:",
            password.length
        );

        // ==================================================
        // FIND ADMIN
        // ==================================================

        let admin =
            await User.findOne({
                email
            });

        // ==================================================
        // CREATE ADMIN IF NOT EXISTS
        // ==================================================

        if (!admin) {

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );

            admin =
                await User.create({

                    fullName:
                        "System Administrator",

                    email,

                    password:
                        hashedPassword,

                    role:
                        "admin",

                    isActive:
                        true,

                    isEmailVerified:
                        true
                });

            console.log(
                "✅ DEFAULT ADMIN CREATED"
            );

            return;
        }

        // ==================================================
        // EXISTING ADMIN
        // ==================================================

        console.log(
            "✅ Existing admin found"
        );

        // ==================================================
        // MAKE SURE ADMIN DETAILS ARE CORRECT
        // ==================================================

        admin.fullName =
            "System Administrator";

        admin.email =
            email;

        admin.role =
            "admin";

        admin.isActive =
            true;

        admin.isEmailVerified =
            true;

        // ==================================================
        // ALWAYS SET PASSWORD FROM ENV
        // ==================================================
        //
        // This is intentional for your development setup.
        //
        // The password stored in MongoDB will always be
        // the password specified in DEFAULT_ADMIN_PASSWORD.
        //
        // ==================================================

        admin.password =
            await bcrypt.hash(
                password,
                10
            );

        await admin.save();

        console.log(
            "✅ ADMIN PASSWORD SYNCHRONIZED"
        );

        // ==================================================
        // VERIFY HASH
        // ==================================================

        const passwordCheck =
            await bcrypt.compare(
                password,
                admin.password
            );

        console.log(
            "Password verification after save:",
            passwordCheck
        );

        if (passwordCheck) {

            console.log(
                "✅ DEFAULT ADMIN READY"
            );

        } else {

            console.log(
                "❌ ADMIN PASSWORD VERIFICATION FAILED"
            );
        }

    } catch (error) {

        console.error(
            "❌ Default Admin Creation Error:",
            error
        );
    }
};

module.exports =
    createDefaultAdmin;