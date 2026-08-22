import React from "react";
import { Link, useParams } from "react-router-dom";
import employees from "../../data/mockEmployees";

const EmployeeDetails = () => {

    const { employeeId } = useParams();

    const employee = employees.find(
        (item) => item.employeeId === employeeId
    );

    if (!employee) {
        return (
            <div>
                <h1 className="text-xl font-bold text-red-600">
                    Employee not found
                </h1>

                <Link
                    to="/admin/employees"
                    className="mt-4 inline-block text-blue-600"
                >
                    Back to Employees
                </Link>
            </div>
        );
    }

    return (
        <div>

            <div className="mb-6">
                <Link
                    to="/admin/employees"
                    className="text-sm text-blue-600 hover:underline"
                >
                    ← Back to Employees
                </Link>

                <h1 className="mt-3 text-2xl font-bold text-gray-800">
                    Employee Details
                </h1>
            </div>

            <div className="space-y-6">

                {/* Personal Information */}
                <section className="rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="mb-4 text-lg font-semibold">
                        Personal Information
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <p>
                            <strong>Employee ID:</strong>{" "}
                            {employee.employeeId}
                        </p>

                        <p>
                            <strong>First Name:</strong>{" "}
                            {employee.personalDetails.firstName}
                        </p>

                        <p>
                            <strong>Last Name:</strong>{" "}
                            {employee.personalDetails.lastName}
                        </p>

                        <p>
                            <strong>Email:</strong>{" "}
                            {employee.personalDetails.email}
                        </p>

                        <p>
                            <strong>Phone:</strong>{" "}
                            {employee.personalDetails.phone}
                        </p>

                    </div>

                </section>

                {/* Qualification */}
                <section className="rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="mb-4 text-lg font-semibold">
                        Qualification
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <p>
                            <strong>Degree:</strong>{" "}
                            {employee.qualification.degree}
                        </p>

                        <p>
                            <strong>Specialization:</strong>{" "}
                            {employee.qualification.specialization}
                        </p>

                        <p>
                            <strong>University:</strong>{" "}
                            {employee.qualification.university}
                        </p>

                    </div>

                </section>

                {/* Education */}
                <section className="rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="mb-4 text-lg font-semibold">
                        Education
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <p>
                            <strong>Highest Qualification:</strong>{" "}
                            {employee.education.highestQualification}
                        </p>

                        <p>
                            <strong>Passing Year:</strong>{" "}
                            {employee.education.passingYear}
                        </p>

                    </div>

                </section>

                {/* Address */}
                <section className="rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="mb-4 text-lg font-semibold">
                        Address
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <p>
                            <strong>City:</strong>{" "}
                            {employee.address.city}
                        </p>

                        <p>
                            <strong>State:</strong>{" "}
                            {employee.address.state}
                        </p>

                        <p>
                            <strong>Country:</strong>{" "}
                            {employee.address.country}
                        </p>

                    </div>

                </section>

                {/* Skills */}
                <section className="rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="mb-4 text-lg font-semibold">
                        Primary Skills
                    </h2>

                    <div className="flex flex-wrap gap-2">

                        {employee.primarySkills.map((skill) => (
                            <span
                                key={skill}
                                className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                            >
                                {skill}
                            </span>
                        ))}

                    </div>

                </section>

                {/* BDM */}
                <section className="rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="mb-4 text-lg font-semibold">
                        BDM Details
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <p>
                            <strong>BDM Name:</strong>{" "}
                            {employee.bdmDetails.bdmName}
                        </p>

                        <p>
                            <strong>BDM Email:</strong>{" "}
                            {employee.bdmDetails.bdmEmail}
                        </p>

                    </div>

                </section>

            </div>

        </div>
    );
};

export default EmployeeDetails;