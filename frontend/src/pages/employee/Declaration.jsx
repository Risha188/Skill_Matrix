import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import {markSectionCompleted} from "../../utils/profileProgress.js";

const Declaration = () => {
    const navigate = useNavigate();

    const [declaration,setDeclaration] = useState({
        informationCorrect: false,
        termsAccepted: false,
        declarationDate: "",
    });

    const handleChange = (e) => {
        const {name,value} = e.target;

        setDeclaration((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Declaration Information:",declaration);
        markSectionCompleted("declaration");
        // Go to BDM Details
        navigate("/employee/dashboard");
    };

    const handleClear = () => {
        setDeclaration({
            informationCorrect: false,
            termsAccepted: false,
            declarationDate: "",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                            📋
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Declaration
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Confirm that the information provided by you is accurate.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-xl bg-white shadow-md"
                >

                    {/* Form Header */}
                    <div className="border-b border-gray-200 px-6 py-5">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Employee Declaration
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Please read the declaration carefully before submitting.
                        </p>
                    </div>

                    {/* Declaration Content */}
                    <div className="space-y-6 p-6">

                        {/* Declaration Text */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                            <p className="text-sm leading-6 text-gray-600">
                                I hereby declare that all the information provided by me
                                in my employee profile is true, complete, and accurate to
                                the best of my knowledge. I understand that any incorrect
                                or misleading information may result in appropriate action
                                by the organization.
                            </p>
                        </div>

                        {/* Information Correct */}
                        <div>
                            <label className="flex cursor-pointer items-start gap-3">

                                <input
                                    type="checkbox"
                                    name="informationCorrect"
                                    checked={declaration.informationCorrect}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />

                                <span className="text-sm leading-6 text-gray-700">
                                    I confirm that all the personal, educational, address,
                                    skills, and work experience information provided by me
                                    is correct.
                                </span>

                            </label>
                        </div>

                        {/* Terms Accepted */}
                        <div>
                            <label className="flex cursor-pointer items-start gap-3">

                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={declaration.termsAccepted}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />

                                <span className="text-sm leading-6 text-gray-700">
                                    I agree to the organization's terms and conditions
                                    regarding the information provided in this employee
                                    profile.
                                </span>

                            </label>
                        </div>

                        {/* Declaration Date */}
                        <div className="max-w-md">
                            <label
                                htmlFor="declarationDate"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Declaration Date
                            </label>

                            <input
                                id="declarationDate"
                                type="date"
                                name="declarationDate"
                                value={declaration.declarationDate}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">

                        <button
                            type="button"
                            onClick={handleClear}
                            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                            Clear
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            submit
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default Declaration;
