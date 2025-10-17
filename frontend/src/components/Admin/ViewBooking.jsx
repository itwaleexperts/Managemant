import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa"; 

const StatusBadge = ({ status }) => {
    let color = 'bg-gray-400';
    if (status === 'Confirmed') color = 'bg-green-500';
    if (status === 'Cancelled') color = 'bg-red-500';
    if (status === 'Pending') color = 'bg-yellow-500';

    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${color}`}>
            {status}
        </span>
    );
};

export default function ViewBooking() {
    const { id } = useParams();
    const navigate = useNavigate(); 
    const [booking, setBooking] = useState(null);
    const [status, setStatus] = useState("Waiting");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await axios.get(`https://apiyatraadda.jaspersoftwaresolutions.com/api/booking/${id}`);
                const fetchedBooking = res.data.booking || res.data;
                setBooking(fetchedBooking);
                setStatus(fetchedBooking?.status || "Pending");
            } catch (err) {
                console.error(" Error fetching booking details:", err.response?.data || err.message);
            }
        };

        fetchBooking();
    }, [id]);

    const handleStatusChange = async () => {
        console.log("=== STATUS UPDATE START ===");
        if (!window.confirm(`Are you sure you want to change the status to: ${status}?`)) return;

        if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
            alert("Invalid status selected");
            return;
        }

        const token = localStorage.getItem("adminToken");
        if (!token) {
            alert("You are not logged in as Admin!");
            return;
        }

        setUpdating(true);
        try {
            const res = await axios.put(
                `https://apiyatraadda.jaspersoftwaresolutions.com/api/booking/${id}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Status updated successfully!");
            setStatus(res.data.booking.status);
            setBooking(res.data.booking);
        } catch (err) {
            console.error(" Error updating status:", err.response?.data);
            alert(err.response?.data?.message || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    if (!booking)
        return (
            <p className="text-center mt-10 text-gray-500 text-lg">
                Loading booking details...
            </p>
        );

    const currentStatus = booking.status;
    let availableOptions = [];
    if (currentStatus === "Pending") {
        availableOptions = ["Confirmed", "Cancelled"];
    } else if (currentStatus === "Confirmed") {
        availableOptions = [];
    } else if (currentStatus === "Cancelled") {
        availableOptions = [];
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-3xl w-full">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Bookings
                    </button>
                </div>

                <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">Booking Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
                    <div>
                        <p><strong>User:</strong> {booking.firstName} {booking.lastName}</p>
                        <p><strong>Email:</strong> {booking.email}</p>
                        <p><strong>Phone:</strong> {booking.phone}</p>
                        <p><strong>Payment Method:</strong> {booking.paymentMethod}</p>
                    </div>
                    <div>
                        <p><strong>Hotel:</strong> {booking.hotelId?.name || "Unknown Hotel"}</p> {/* Updated to use hotelId.name */}
                        <p><strong>Room Type:</strong> {booking.roomType}</p>
                        <p><strong>Nights:</strong> {booking.nights}</p>
                        <p><strong>Room No:</strong> {booking.roomId?.roomNumber || 'N/A'}</p>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="font-semibold text-gray-600">Check-In</p>
                        <p className="text-lg text-gray-900">{new Date(booking.checkIn).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="font-semibold text-gray-600">Check-Out</p>
                        <p className="text-lg text-gray-900">{new Date(booking.checkOut).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-200 text-center">
                    <p className="text-lg font-semibold text-gray-700">Room Price: ₹{booking.roomPrice?.toLocaleString() || '0'}</p>
                    <p className="text-lg font-semibold text-gray-700">City Tax: ₹{booking.cityTax?.toLocaleString() || '0'}</p>
                    <p className="text-2xl font-bold text-green-700 mt-2">Total: ₹{booking.totalPrice?.toLocaleString() || '0'}</p>
                </div>

                <div className="mt-6 flex flex-col items-center">
                    <label className="text-gray-700 font-semibold mb-2">Current Status: <StatusBadge status={currentStatus} /></label>
                    {availableOptions.length > 0 ? (
                        <>
                            <label className="text-gray-700 font-semibold mt-4 mb-2">Change Status To:</label>

<select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  className="border border-gray-300 rounded-lg px-4 py-2 w-48 text-center focus:ring-2 focus:ring-blue-400 focus:outline-none"
>
  <option value="Waiting" disabled>
    Waiting
  </option>

  {availableOptions.map((opt) => (
    <option key={opt} value={opt}>
      {opt}
    </option>
  ))}
</select>

<button
  onClick={handleStatusChange}
  disabled={updating || status === "Waiting"}
  className={`mt-4 px-6 py-2 rounded-lg text-white font-semibold shadow-lg ${
    updating || status === "Waiting" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {updating ? "Updating..." : `Update to ${status}`}
</button>


                        </>
                    ) : (
                        <p className="mt-4 text-lg font-medium text-gray-500">
                            This booking status cannot be changed further.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}