const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Employee = require("../model/Employee");

const fixEmployeeIds = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("=================================");
        console.log("MongoDB connected");
        console.log("=================================");

        const employees = await Employee.find({}).lean();

        console.log(
            `Found ${employees.length} employees`
        );

        let updated = 0;

        for (const employee of employees) {

            const oldId = employee.employeeId;

            if (!oldId) {
                console.log(
                    `Skipping employee ${employee._id}: no employeeId`
                );
                continue;
            }

            /*
             * Convert:
             *
             * EMP0001 -> EMP001
             * EMP0002 -> EMP002
             * EMP0010 -> EMP010
             */

            const match = oldId.match(
                /^EMP0+(\d+)$/i
            );

            if (!match) {
                console.log(
                    `Skipping ${oldId} - already correct format`
                );

                continue;
            }

            const number = parseInt(
                match[1],
                10
            );

            const newId =
                `EMP${String(number).padStart(3, "0")}`;

            if (oldId === newId) {
                continue;
            }

            // ==========================================
            // CHECK DUPLICATE
            // ==========================================

            const existing =
                await Employee.findOne({
                    employeeId: newId,
                    _id: {
                        $ne: employee._id
                    }
                }).lean();

            if (existing) {

                console.log(
                    `SKIPPED ${oldId} -> ${newId}`
                );

                console.log(
                    `${newId} already exists`
                );

                continue;
            }

            // ==========================================
            // UPDATE ONLY employeeId
            // IMPORTANT:
            // Do NOT use employee.save()
            // ==========================================

            const result =
                await Employee.updateOne(
                    {
                        _id: employee._id
                    },
                    {
                        $set: {
                            employeeId: newId
                        }
                    }
                );

            if (result.modifiedCount === 1) {

                console.log(
                    `Updated: ${oldId} -> ${newId}`
                );

                updated++;

            } else {

                console.log(
                    `Failed to update ${oldId}`
                );
            }
        }

        console.log("=================================");
        console.log(
            `Updated employees: ${updated}`
        );
        console.log("=================================");

        await mongoose.disconnect();

        console.log(
            "MongoDB disconnected"
        );

        process.exit(0);

    } catch (error) {

        console.error(
            "❌ Employee ID migration failed:",
            error
        );

        try {
            await mongoose.disconnect();
        } catch (disconnectError) {
            console.error(
                "Disconnect error:",
                disconnectError.message
            );
        }

        process.exit(1);
    }
};

fixEmployeeIds();