import { useState } from "react";
import { markSectionCompleted } from "../../utils/profileProgress.js";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api.js";
import { useEmployeeProfile } from "../../context/EmployeeProfileContext";

const Education = () => {

  const navigate = useNavigate();

  const { profile, updateSection } = useEmployeeProfile();

  const [education, setEducation] = useState(
    profile.education
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {

    const { name, value } = e.target;

    setEducation((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error when user starts correcting the field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // =========================
    // HIGHEST QUALIFICATION
    // =========================
    if (!education.highestQualification) {
      newErrors.highestQualification =
        "Please select your highest qualification";
    }

    // =========================
    // COURSE
    // =========================
    const course = education.course?.trim();

    if (!course) {
      newErrors.course = "Course / Degree is required";
    } else if (course.length < 2) {
      newErrors.course =
        "Course / Degree must be at least 2 characters";
    } else if (course.length > 100) {
      newErrors.course =
        "Course / Degree cannot exceed 100 characters";
    }

    // =========================
    // SPECIALIZATION
    // =========================
    const specialization =
      education.specialization?.trim();

    if (!specialization) {
      newErrors.specialization =
        "Specialization is required";
    } else if (specialization.length < 2) {
      newErrors.specialization =
        "Specialization must be at least 2 characters";
    } else if (specialization.length > 100) {
      newErrors.specialization =
        "Specialization cannot exceed 100 characters";
    }

    // =========================
    // UNIVERSITY
    // =========================
    const university = education.university?.trim();

    if (!university) {
      newErrors.university =
        "University / Board is required";
    } else if (university.length < 2) {
      newErrors.university =
        "University / Board must be at least 2 characters";
    } else if (university.length > 150) {
      newErrors.university =
        "University / Board cannot exceed 150 characters";
    }

    // =========================
    // COLLEGE
    // =========================
    const college = education.college?.trim();

    if (!college) {
      newErrors.college =
        "College / Institution is required";
    } else if (college.length < 2) {
      newErrors.college =
        "College / Institution must be at least 2 characters";
    } else if (college.length > 150) {
      newErrors.college =
        "College / Institution cannot exceed 150 characters";
    }

    // =========================
    // PASSING YEAR
    // =========================
    const passingYear = education.passingYear;

    if (!passingYear) {
      newErrors.passingYear =
        "Passing year is required";
    } else {
      const year = Number(passingYear);
      const currentYear = new Date().getFullYear();

      if (!Number.isInteger(year)) {
        newErrors.passingYear =
          "Passing year must be a valid year";
      } else if (year < 1950) {
        newErrors.passingYear =
          "Passing year cannot be before 1950";
      } else if (year > currentYear) {
        newErrors.passingYear =
          "Passing year cannot be in the future";
      }
    }

    // =========================
    // PERCENTAGE
    // =========================
    const percentage = education.percentage;

    if (
      percentage !== "" &&
      percentage !== null &&
      percentage !== undefined
    ) {
      const percentageValue = Number(percentage);

      if (isNaN(percentageValue)) {
        newErrors.percentage =
          "Percentage must be a valid number";
      } else if (
        percentageValue < 0 ||
        percentageValue > 100
      ) {
        newErrors.percentage =
          "Percentage must be between 0 and 100";
      }
    }

    // =========================
    // CGPA
    // =========================
    const cgpa = education.cgpa;

    if (
      cgpa !== "" &&
      cgpa !== null &&
      cgpa !== undefined
    ) {
      const cgpaValue = Number(cgpa);

      if (isNaN(cgpaValue)) {
        newErrors.cgpa =
          "CGPA must be a valid number";
      } else if (
        cgpaValue < 0 ||
        cgpaValue > 10
      ) {
        newErrors.cgpa =
          "CGPA must be between 0 and 10";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before API request
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      const employeeId =
        localStorage.getItem("employeeId");

      if (!employeeId) {
        alert(
          "Employee ID not found. Please complete Personal Information first."
        );
        return;
      }

      // Save Education to MongoDB
      const response = await API.put(
        `/employees/${employeeId}/education`,
        education
      );

      console.log(
        "Education saved:",
        response.data
      );

      // Update React Context
      updateSection(
        "education",
        education
      );

      // Mark Education as completed
      markSectionCompleted("education");

      // Go to Address
      navigate("/employee/address");

    } catch (error) {
      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "DATA:",
        error.response?.data
      );

      console.error(
        "FULL ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to save education details"
      );
    }
  };

   const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const errorInputClass =
    "w-full rounded-lg border border-red-500 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Education
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter your educational qualifications and academic details.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow-md"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Highest Qualification */}
            <div>
              <label
                htmlFor="highestQualification"
                className={labelClass}
              >
                Highest Qualification
              </label>

              <select
                id="highestQualification"
                name="highestQualification"
                value={education.highestQualification}
                onChange={handleChange}
                required
                className={
                  errors.highestQualification
                    ? errorInputClass
                    : inputClass
                }
              >
                <option value="">Select Qualification</option>
                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="Diploma">Diploma</option>
                <option value="Graduation">Graduation</option>
                <option value="Post Graduation">Post Graduation</option>
                <option value="PhD">PhD</option>
              </select>

              {errors.highestQualification && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.highestQualification}
                </p>
              )}
            </div>

            {/* Course */}
            <div>
              <label
                htmlFor="course"
                className={labelClass}
              >
                Course / Degree
              </label>

              <input
                id="course"
                type="text"
                name="course"
                placeholder="e.g. B.Tech, BCA, MCA"
                value={education.course}
                onChange={handleChange}
                maxLength={100}
                className={
                  errors.course
                    ? errorInputClass
                    : inputClass
                }
              />

              {errors.course && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.course}
                </p>
              )}

            </div>

            {/* Specialization */}
            <div>

              <label
                htmlFor="specialization"
                className={labelClass}
              >
                Specialization
              </label>

              <input
                id="specialization"
                type="text"
                name="specialization"
                placeholder="e.g. Computer Science"
                value={education.specialization}
                onChange={handleChange}
                maxLength={100}
                className={
                  errors.specialization
                    ? errorInputClass
                    : inputClass
                }
              />

              {errors.specialization && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.specialization}
                </p>
              )}

            </div>

            {/* University */}
            <div>

              <label
                htmlFor="university"
                className={labelClass}
              >
                University / Board
              </label>

              <input
                id="university"
                type="text"
                name="university"
                placeholder="Enter university or board"
                value={education.university}
                onChange={handleChange}
                maxLength={150}
                className={
                  errors.university
                    ? errorInputClass
                    : inputClass
                }
              />

              {errors.university && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.university}
                </p>
              )}

            </div>

            {/* College */}
            <div>

              <label
                htmlFor="college"
                className={labelClass}
              >
                College / Institution
              </label>

              <input
                id="college"
                type="text"
                name="college"
                placeholder="Enter college or institution"
                value={education.college}
                onChange={handleChange}
                maxLength={150}
                className={
                  errors.college
                    ? errorInputClass
                    : inputClass
                }
              />

              {errors.college && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.college}
                </p>
              )}

            </div>

            {/* Passing Year */}
            <div>

              <label
                htmlFor="passingYear"
                className={labelClass}
              >
                Passing Year
              </label>

              <input
                id="passingYear"
                type="number"
                name="passingYear"
                placeholder="e.g. 2025"
                min="1950"
                max={new Date().getFullYear()}
                value={education.passingYear}
                onChange={handleChange}
                className={
                  errors.passingYear
                    ? errorInputClass
                    : inputClass
                }
              />

              {errors.passingYear && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.passingYear}
                </p>
              )}

            </div>

            {/* Percentage */}
            <div>

              <label
                htmlFor="percentage"
                className={labelClass}
              >
                Percentage
              </label>

              <input
                id="percentage"
                type="number"
                name="percentage"
                placeholder="e.g. 85"
                min="0"
                max="100"
                step="0.01"
                value={education.percentage}
                onChange={handleChange}
                className={
                  errors.percentage
                    ? errorInputClass
                    : inputClass
                }
              />

              {errors.percentage && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.percentage}
                </p>
              )}

            </div>

            {/* CGPA */}
            <div>

              <label
                htmlFor="cgpa"
                className={labelClass}
              >
                CGPA
              </label>

              <input
                id="cgpa"
                type="number"
                name="cgpa"
                placeholder="e.g. 8.5"
                min="0"
                max="10"
                step="0.01"
                value={education.cgpa}
                onChange={handleChange}
                className={
                  errors.cgpa
                    ? errorInputClass
                    : inputClass
                }
              />

              {errors.cgpa && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.cgpa}
                </p>
              )}

            </div>

          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save & Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Education;