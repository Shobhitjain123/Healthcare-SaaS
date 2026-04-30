import { memo } from "react";

type Props = {
  title: string;
  value: string;
};

function StatCardComponent({ title, value }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-semibold mt-2">{value}</h2>
    </div>
  );
}

export const StatCard = memo(StatCardComponent);
