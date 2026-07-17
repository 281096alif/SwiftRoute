import React from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const ReviewCard = ({ review }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <FaQuoteLeft className="text-3xl text-blue-500 mb-4" />

      <p className="text-gray-600 leading-relaxed mb-6 italic">
        "{review.reviewComment}"
      </p>

      <div className="flex items-center justify-between border-t pt-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {review.name}
          </h3>
          <p className="text-sm text-gray-500">
            {review.designation}
          </p>
        </div>

        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, index) => (
            <FaStar key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;