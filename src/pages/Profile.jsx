import { useMemo, useState } from "react";
import MainLayout from "../layout/MainLayout";
import Card from "../components/Card";
import { FaUser, FaEnvelope, FaLeaf, FaMapMarkerAlt, FaBell } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Profile() {
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    farmLocation: "Punjab, India",
    preferredCrop: "Tomato",
    alerts: true,
  });

  const initials = useMemo(() => {
    if (!form.name) return "U";
    return form.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [form.name]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveProfile = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name: form.name,
      email: form.email,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    toast.success("Profile settings saved");
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-800">
            Profile & Settings
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your account details and farming preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-4">
            <Card className="h-full">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-[#245a45]">
                  {initials}
                </div>

                <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                  {form.name || "User"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">{form.email}</p>

                <div className="mt-6 w-full space-y-4">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left">
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Farm Location</p>
                        <h3 className="text-base font-semibold text-gray-800">
                          {form.farmLocation}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left">
                    <div className="flex items-center gap-3">
                      <FaLeaf className="text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Preferred Crop</p>
                        <h3 className="text-base font-semibold text-gray-800">
                          {form.preferredCrop}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left">
                    <div className="flex items-center gap-3">
                      <FaBell className="text-yellow-500" />
                      <div>
                        <p className="text-sm text-gray-500">Alerts</p>
                        <h3 className="text-base font-semibold text-gray-800">
                          {form.alerts ? "Enabled" : "Disabled"}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="xl:col-span-8">
            <Card title="Update Settings">
              <form onSubmit={saveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-green-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-green-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Farm Location
                    </label>
                    <input
                      type="text"
                      name="farmLocation"
                      value={form.farmLocation}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-700"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Preferred Crop
                    </label>
                    <select
                      name="preferredCrop"
                      value={form.preferredCrop}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-700"
                    >
                      <option>Tomato</option>
                      <option>Wheat</option>
                      <option>Rice</option>
                      <option>Potato</option>
                      <option>Maize</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <label className="flex items-center justify-between gap-4 cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Disease & weather alerts
                      </p>
                      <p className="text-sm text-gray-500">
                        Receive smart reminders and farming notifications.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      name="alerts"
                      checked={form.alerts}
                      onChange={handleChange}
                      className="h-5 w-5 accent-green-700"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-[#245a45] px-6 py-3 text-white font-medium shadow-sm hover:bg-[#1d4a39]"
                >
                  Save Changes
                </button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}