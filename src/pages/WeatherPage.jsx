import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layout/MainLayout";
import Card from "../components/Card";
import axiosInstance from "../api/axiosInstance";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  WiDaySunny,
  WiHumidity,
  WiRain,
  WiStrongWind,
  WiCloudy,
} from "react-icons/wi";
import { FaTint, FaLeaf, FaExclamationTriangle } from "react-icons/fa";

export default function WeatherPage() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchWeather = async (lat, lon) => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.get(`/weather?lat=${lat}&lon=${lon}`);
      setWeather(res.data);
    } catch (err) {
      setError(err?.response?.data?.msg || "Unable to fetch live weather data.");
    } finally {
      setLoading(false);
    }
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      () => {
        fetchWeather(28.6139, 77.2090);
      }
    );
  } else {
    fetchWeather(28.6139, 77.2090);
  }
}, []);

  const chartData = useMemo(() => {
    if (!weather?.daily?.time) return [];

    return weather.daily.time.map((day, index) => ({
      day: new Date(day).toLocaleDateString("en-US", { weekday: "short" }),
      maxTemp: weather.daily.temperature_2m_max?.[index] ?? 0,
      minTemp: weather.daily.temperature_2m_min?.[index] ?? 0,
      rain: weather.daily.precipitation_sum?.[index] ?? 0,
    }));
  }, [weather]);

  const riskLevel = useMemo(() => {
    if (!weather?.current) return "Moderate";

    const humidity = weather.current.relative_humidity_2m ?? 0;
    const rain = weather.current.rain ?? 0;

    if (humidity >= 75 || rain > 2) return "High";
    if (humidity >= 55) return "Moderate";
    return "Low";
  }, [weather]);

  const riskStyle =
    riskLevel === "High"
      ? "bg-red-50 text-red-600 border-red-200"
      : riskLevel === "Moderate"
      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
      : "bg-green-50 text-green-700 border-green-200";

  const summaryCards = [
    {
      title: "Temperature",
      value: weather ? `${weather.current?.temperature_2m ?? "--"}°C` : "--",
      icon: <WiDaySunny className="text-4xl text-yellow-500" />,
      bg: "bg-yellow-50",
    },
    {
      title: "Humidity",
      value: weather ? `${weather.current?.relative_humidity_2m ?? "--"}%` : "--",
      icon: <WiHumidity className="text-4xl text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      title: "Rain",
      value: weather ? `${weather.current?.rain ?? "--"} mm` : "--",
      icon: <WiRain className="text-4xl text-cyan-500" />,
      bg: "bg-cyan-50",
    },
    {
      title: "Wind Speed",
      value: weather ? `${weather.current?.wind_speed_10m ?? "--"} km/h` : "--",
      icon: <WiStrongWind className="text-4xl text-gray-600" />,
      bg: "bg-gray-50",
    },
  ];

  const forecastChips = chartData.slice(0, 7);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-800">
            Weather & Soil Insights
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Monitor climate conditions, moisture risk, and weekly crop advisory signals for smarter farming decisions.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {summaryCards.map((item, index) => (
            <Card key={index}>
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 w-24 rounded bg-gray-200"></div>
                  <div className="h-8 w-28 rounded bg-gray-200"></div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">{item.title}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-gray-800">
                      {item.value}
                    </h3>
                  </div>
                  <div className={`rounded-2xl p-2 ${item.bg}`}>{item.icon}</div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-7">
            <Card title="Weekly Forecast Overview" className="h-full">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-[280px] rounded-2xl bg-gray-100"></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-16 rounded-xl bg-gray-100"></div>
                    <div className="h-16 rounded-xl bg-gray-100"></div>
                    <div className="h-16 rounded-xl bg-gray-100"></div>
                  </div>
                </div>
              ) : chartData.length > 0 ? (
                <div className="space-y-6">
                  <div className="h-[320px] w-full rounded-2xl bg-gray-50 p-4 border border-gray-200">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="maxTempFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2f855a" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#2f855a" stopOpacity={0.05} />
                          </linearGradient>
                          <linearGradient id="minTempFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#68d391" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#68d391" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="maxTemp"
                          stroke="#2f855a"
                          fill="url(#maxTempFill)"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="minTemp"
                          stroke="#68d391"
                          fill="url(#minTempFill)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
                    {forecastChips.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-center"
                      >
                        <p className="text-xs font-medium text-gray-500">{item.day}</p>
                        <WiCloudy className="mx-auto my-1 text-3xl text-gray-500" />
                        <p className="text-sm font-semibold text-gray-800">
                          {item.maxTemp}° / {item.minTemp}°
                        </p>
                        <p className="text-xs text-gray-500">{item.rain} mm</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-500">
                  Forecast data not available.
                </div>
              )}
            </Card>
          </div>

          <div className="xl:col-span-5">
            <Card title="Soil Moisture & Advisory" className="h-full">
              <div className="space-y-5">
                <div className="rounded-2xl overflow-hidden border border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"
                    alt="Farm advisory"
                    className="h-56 w-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div>
                    <p className="text-sm text-gray-500">Disease Weather Risk</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-800">
                      Moisture-sensitive conditions
                    </h3>
                  </div>

                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${riskStyle}`}
                  >
                    {riskLevel} Risk
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-3">
                        <FaTint className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Irrigation Window</p>
                        <h3 className="text-base font-semibold text-gray-800">
                          Early Morning
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-green-50 p-3">
                        <FaLeaf className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Crop Advisory</p>
                        <h3 className="text-base font-semibold text-gray-800">
                          Preventive Care
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <FaExclamationTriangle className="mt-1 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">Advisory Alert</p>
                      <h3 className="mt-1 text-lg font-semibold text-red-600">
                        Late Blight Conditions Likely
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        High humidity and rainfall can increase fungal spread. Inspect leaves, improve airflow, and reduce unnecessary water exposure.
                      </p>
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-green-600">✔</span>
                    Use balanced fertilizer support such as NPK 10-30-20 during stress periods.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-green-600">✔</span>
                    Water crops in the morning to reduce prolonged leaf wetness.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-green-600">✔</span>
                    Remove infected leaves early and monitor symptom spread every 24–48 hours.
                  </li>
                </ul>

                {weather?.location && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Coordinates:</span>{" "}
                    {weather.location.latitude}, {weather.location.longitude}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}