import React from "react";

const PeriodSelector = ({ period, setPeriod }) => (
  <div className="mb-4">
    <label className="font-semibold mr-2">Период:</label>
    <select
      value={period}
      onChange={(e) => setPeriod(e.target.value)}
      className="border rounded px-2 py-1"
    >
      <option value="week">Последняя неделя</option>
      <option value="month">Последний месяц</option>
    </select>
  </div>
);

export default PeriodSelector;
