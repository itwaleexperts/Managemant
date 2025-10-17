import React, { useEffect, useState } from "react";
import Card from "../../components/Admin/Card";
import { Calendar, DollarSign, Box, Users } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    setStats([
      { title: "Today's Bookings", value: 12, icon: <Calendar />, color: "bg-blue-100" },
      { title: "Revenue", value: "$4,560", icon: <DollarSign />, color: "bg-green-100" },
      { title: "Available Rooms", value: 24, icon: <Box />, color: "bg-yellow-100" },
      { title: "Staff Online", value: 8, icon: <Users />, color: "bg-purple-100" },
    ]);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
