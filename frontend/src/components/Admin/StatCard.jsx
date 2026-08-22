import React from "react";

const StatCard = ({ title, value }) => {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
                {title}
            </p>

            <h3 className="mt-2 text-3xl font-bold text-gray-800">
                {value}
            </h3>
        </div>
    );
};

export default StatCard;