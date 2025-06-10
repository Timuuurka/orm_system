import React from "react";

const AlertCard = ({ alert, onResolve }) => {
  return (
    <div className={`border-l-4 p-4 mb-4 rounded shadow-md ${alert.resolved ? "border-gray-400 bg-gray-50" : "border-red-500 bg-red-50"}`}>
      <p className="text-md font-semibold">{alert.message}</p>
      <p className="text-sm text-gray-500">Время: {new Date(alert.timestamp).toLocaleString()}</p>
      {!alert.resolved && (
        <button
          onClick={() => onResolve(alert.id)}
          className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
        >
          Пометить как обработанный
        </button>
      )}
      {alert.resolved && (
        <span className="mt-2 inline-block text-green-600 font-medium">✅ Обработан</span>
      )}
    </div>
  );
};

export default AlertCard;
