import { type ReactNode } from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <h3 className="text-md font-medium mb-4">{title}</h3>
      {children}
    </div>
  );
}
