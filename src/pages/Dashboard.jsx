import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layout/MainLayout";
import Card from "../components/Card";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import {
  FaCloudRain,
  FaLeaf,
  FaExclamationTriangle,
  FaChartLine,
  FaUpload,
  FaHistory,
} from "react-icons/fa";

export default function Dashboard() {
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await axiosInstance.get("/crop/history");
      setHistory(res.data || []);
    } catch (err) {
      console.error("History fetch failed:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const analyzeImage = async () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      toast.success("Image analyzed successfully");

      const formData = new FormData();
      formData.append("image", image);

      const res = await axiosInstance.post("/crop/detect", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data);
      fetchHistory();
    } catch (err) {
      setError(err?.response?.data?.msg || "Image analysis failed.");
      toast.success("Image analyzed successfully");
    } finally {
      setLoading(false);
    }
  };

  const statCards = useMemo(
    () => [
      {
        title: "Total Scans",
        value: history.length,
        icon: <FaChartLine className="text-green-600 text-lg" />,
        bg: "bg-green-50",
      },
      {
        title: "Detected Disease",
        value: result?.disease || history[0]?.disease || "No scans yet",
        icon: <FaLeaf className="text-emerald-600 text-lg" />,
        bg: "bg-emerald-50",
      },
      {
        title: "Confidence",
        value: result?.confidence ? `${result.confidence}%` : history[0]?.confidence ? `${history[0].confidence}%` : "--",
        icon: <FaExclamationTriangle className="text-yellow-600 text-lg" />,
        bg: "bg-yellow-50",
      },
      {
        title: "Weather Risk",
        value: "High Humidity",
        icon: <FaCloudRain className="text-blue-600 text-lg" />,
        bg: "bg-blue-50",
      },
    ],
    [history, result]
  );

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-800">
            Welcome{user?.name ? `, ${user.name}` : ""}!
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Monitor crop health, analyze disease symptoms, and review smart farming recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map((item, index) => (
            <Card key={index} className="h-full">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-gray-800 break-words">
                    {item.value}
                  </h3>
                </div>
                <div className={`rounded-xl p-3 ${item.bg}`}>{item.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-7">
            <Card title="Upload Crop Image">
              {preview ? (
                <div className="space-y-5">
                  <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={preview}
                      alt="Crop preview"
                      className="w-full h-[360px] object-contain bg-white"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">Selected file:</span>{" "}
                      {image?.name || "No file selected"}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="cursor-pointer rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Choose Another
                        <input type="file" onChange={handleImage} className="hidden" />
                      </label>

                      <button
                        onClick={analyzeImage}
                        disabled={loading}
                        className="rounded-xl bg-[#245a45] px-6 py-2.5 text-white font-medium shadow-sm hover:bg-[#1d4a39] disabled:opacity-70"
                      >
                        {loading ? "Analyzing..." : "Analyze"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-10 md:p-14 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-gray-200 shadow-sm">
                    <FaUpload className="text-[#245a45] text-xl" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800">
                    Upload crop or leaf image
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                    Drag and drop or select a high-quality image to detect crop disease and receive smart advisory recommendations.
                  </p>

                  <div className="mt-6">
                    <label className="inline-flex cursor-pointer rounded-xl bg-[#245a45] px-5 py-2.5 text-white font-medium shadow-sm hover:bg-[#1d4a39]">
                      Select Image
                      <input type="file" onChange={handleImage} className="hidden" />
                    </label>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}
            </Card>
          </div>

          <div className="xl:col-span-5">
            <Card title="Diagnosis Results" className="h-full">
              {result ? (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                    <p className="text-sm text-gray-500">Detected Disease</p>
                    <h3 className="mt-1 text-2xl font-semibold text-red-600">
                      {result.disease}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">Confidence</p>
                      <h3 className="mt-1 text-xl font-semibold text-gray-800">
                        {result.confidence}%
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">Severity</p>
                      <h3 className="mt-1 text-xl font-semibold text-gray-800">
                        {result.severity}
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">Crop Type</p>
                      <h3 className="mt-1 text-xl font-semibold text-gray-800">
                        {result.cropType}
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">Action</p>
                      <h3 className="mt-1 text-sm font-semibold text-gray-800 leading-6">
                        Immediate treatment recommended
                      </h3>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-2">
                      Symptoms
                    </h3>
                    <p className="text-sm leading-6 text-gray-600">
                      {result.symptoms}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-2">
                      Recommendations
                    </h3>

                    <ul className="space-y-3 text-sm text-gray-700">
                      {result.recommendations?.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="mt-0.5 text-green-600">✔</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-500 text-center px-6">
                  Upload and analyze a crop image to view disease prediction, confidence score, severity, and treatment advice.
                </div>
              )}
            </Card>
          </div>
        </div>

        <Card title="Recent Scan History">
          <div className="space-y-4">
            {historyLoading ? (
              <div className="space-y-3">
                <div className="h-20 rounded-2xl bg-gray-100 animate-pulse"></div>
                <div className="h-20 rounded-2xl bg-gray-100 animate-pulse"></div>
                <div className="h-20 rounded-2xl bg-gray-100 animate-pulse"></div>
              </div>
            ) : history.length > 0 ? (
              history.slice(0, 5).map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200">
                      <FaHistory className="text-[#245a45]" />
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-gray-800">
                        {item.disease}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.cropType} • {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${severityStyle(
                        item.severity
                      )}`}
                    >
                      {item.severity} Severity
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
                No recent scans found. Upload an image to create your first diagnosis history.
              </div>
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}