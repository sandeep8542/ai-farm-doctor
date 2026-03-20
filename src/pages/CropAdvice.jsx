import MainLayout from "../layout/MainLayout";
import Card from "../components/Card";
import {
  FaSeedling,
  FaTint,
  FaBug,
  FaSun,
  FaLeaf,
  FaCheckCircle,
} from "react-icons/fa";

const cropCards = [
  {
    name: "Tomato",
    risk: "High Risk",
    riskColor: "bg-red-50 text-red-600 border-red-200",
    image:
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1200&q=80",
    tips: [
      "Inspect lower leaves for dark lesions",
      "Avoid overhead irrigation in humid weather",
      "Use preventive fungicide if symptoms spread",
    ],
  },
  {
    name: "Wheat",
    risk: "Moderate Risk",
    riskColor: "bg-yellow-50 text-yellow-700 border-yellow-200",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
    tips: [
      "Monitor for rust patches on leaves",
      "Keep field drainage balanced",
      "Use nitrogen in recommended quantity only",
    ],
  },
  {
    name: "Rice",
    risk: "Low Risk",
    riskColor: "bg-green-50 text-green-700 border-green-200",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d73c3ad7a0?auto=format&fit=crop&w=1200&q=80",
    tips: [
      "Check standing water levels regularly",
      "Watch for leaf discoloration near the base",
      "Maintain proper spacing for airflow",
    ],
  },
];

const advisoryPoints = [
  {
    title: "Fertilizer Plan",
    icon: <FaSeedling className="text-green-600 text-lg" />,
    description:
      "Apply NPK 10-30-20 during stress conditions to strengthen root development and flowering response.",
  },
  {
    title: "Irrigation Advice",
    icon: <FaTint className="text-blue-500 text-lg" />,
    description:
      "Water early in the morning to reduce leaf wetness duration and lower fungal disease probability.",
  },
  {
    title: "Disease Prevention",
    icon: <FaBug className="text-red-500 text-lg" />,
    description:
      "Remove infected leaves quickly, sanitize tools, and avoid water splashing between nearby plants.",
  },
  {
    title: "Sunlight & Climate",
    icon: <FaSun className="text-yellow-500 text-lg" />,
    description:
      "Maintain airflow and sunlight exposure where possible, especially after rainy or high-humidity conditions.",
  },
];

export default function CropAdvice() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-800">
            Crop Advice & Smart Recommendations
          </h1>
          <p className="mt-2 text-sm text-gray-500 max-w-3xl">
            Personalized crop guidance based on disease risk, irrigation needs,
            seasonal conditions, and preventive agricultural practices.
          </p>
        </div>

        {/* Top overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Primary Crop</p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800">
                  Tomato
                </h3>
              </div>
              <div className="rounded-xl bg-green-50 p-3">
                <FaLeaf className="text-green-600 text-xl" />
              </div>
            </div>
          </Card>

          <Card className="h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Disease Risk</p>
                <h3 className="mt-1 text-2xl font-semibold text-red-600">
                  High
                </h3>
              </div>
              <div className="rounded-xl bg-red-50 p-3">
                <FaBug className="text-red-500 text-xl" />
              </div>
            </div>
          </Card>

          <Card className="h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Water Need</p>
                <h3 className="mt-1 text-2xl font-semibold text-blue-600">
                  Moderate
                </h3>
              </div>
              <div className="rounded-xl bg-blue-50 p-3">
                <FaTint className="text-blue-500 text-xl" />
              </div>
            </div>
          </Card>

          <Card className="h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Action Priority</p>
                <h3 className="mt-1 text-2xl font-semibold text-gray-800">
                  Immediate
                </h3>
              </div>
              <div className="rounded-xl bg-yellow-50 p-3">
                <FaCheckCircle className="text-yellow-500 text-xl" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <Card title="Today’s Advisory Summary" className="xl:col-span-2">
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden border border-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=80"
                  alt="Crop field"
                  className="w-full h-[280px] object-cover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {advisoryPoints.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="rounded-xl bg-white p-2 shadow-sm border border-gray-200">
                        {item.icon}
                      </div>
                      <h3 className="text-base font-semibold text-gray-800">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Recommended Actions">
            <div className="space-y-4">
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                <p className="text-sm text-gray-500">Detected Threat</p>
                <h3 className="mt-1 text-lg font-semibold text-red-600">
                  Late Blight Risk Rising
                </h3>
              </div>

              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-green-600">✔</span>
                  Apply fungicide spray to affected regions first.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-green-600">✔</span>
                  Reduce excess evening irrigation for the next few days.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-green-600">✔</span>
                  Remove damaged leaves and isolate severely affected plants.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-green-600">✔</span>
                  Re-check crop after 48 hours and compare symptoms.
                </li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Crop-specific cards */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-800 mb-5">
            Crop-wise Advisory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cropCards.map((crop, index) => (
              <Card key={index} className="h-full">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden border border-gray-200">
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {crop.name}
                    </h3>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full border ${crop.riskColor}`}
                    >
                      {crop.risk}
                    </span>
                  </div>

                  <ul className="space-y-3 text-sm text-gray-700">
                    {crop.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 text-green-600">✔</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}