import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import Card from "../components/Card";
import axiosInstance from "../api/axiosInstance";
import { FaHistory, FaLeaf } from "react-icons/fa";

export default function ScanHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axiosInstance.get("/crop/history");
        setHistory(res.data || []);
      } catch (err) {
        setError(err?.response?.data?.msg || "Failed to load scan history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const severityStyle = (severity) => {
    if (severity === "High") return "bg-red-50 text-red-600 border-red-200";
    if (severity === "Moderate") return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-green-50 text-green-700 border-green-200";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const backendBaseUrl = "http://localhost:5000";

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-800">
            Scan History
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Review previous crop scans, disease predictions, and smart farming recommendations.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="h-72 rounded-2xl bg-gray-100 animate-pulse"></div>
            <div className="h-72 rounded-2xl bg-gray-100 animate-pulse"></div>
            <div className="h-72 rounded-2xl bg-gray-100 animate-pulse"></div>
            <div className="h-72 rounded-2xl bg-gray-100 animate-pulse"></div>
          </div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {history.map((item) => (
              <Card key={item._id} className="h-full">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                    {item.image ? (
                      <img
                        src={`${backendBaseUrl}${item.image}`}
                        alt={item.disease}
                        className="w-full h-56 object-cover"
                      />
                    ) : (
                      <div className="flex h-56 items-center justify-center bg-gray-100 text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Detected Disease</p>
                      <h3 className="mt-1 text-xl font-semibold text-gray-800">
                        {item.disease}
                      </h3>
                    </div>

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${severityStyle(
                        item.severity
                      )}`}
                    >
                      {item.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">Crop Type</p>
                      <h3 className="mt-1 text-base font-semibold text-gray-800">
                        {item.cropType}
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">Confidence</p>
                      <h3 className="mt-1 text-base font-semibold text-gray-800">
                        {item.confidence}%
                      </h3>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Symptoms</p>
                    <p className="text-sm leading-6 text-gray-600">
                      {item.symptoms}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Recommendations</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {item.recommendations?.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="mt-0.5 text-green-600">✔</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FaHistory className="text-[#245a45]" />
                      <span className="text-sm text-gray-600">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaLeaf className="text-green-600" />
                      {item.cropType}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center text-gray-500">
              No scan history found yet. Analyze a crop image from the dashboard to create your first record.
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}