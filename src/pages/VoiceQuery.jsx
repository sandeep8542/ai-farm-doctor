import { useMemo, useState } from "react";
import MainLayout from "../layout/MainLayout";
import Card from "../components/Card";
import {
  FaMicrophone,
  FaWaveSquare,
  FaLeaf,
  FaBug,
  FaTint,
  FaLanguage,
  FaCheckCircle,
} from "react-icons/fa";

const samplePrompts = [
  "Why are my tomato leaves turning brown?",
  "How often should I water wheat this week?",
  "My crop leaves have black spots. What should I do?",
  "Which fertilizer is good during fungal infection?",
];

export default function VoiceQuery() {
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en-US");

  const aiResponse = useMemo(() => {
    if (!text.trim()) {
      return {
        title: "AI Diagnosis Preview",
        disease: "Possible Late Blight",
        confidence: "91%",
        advice: [
          "Inspect lower and older leaves for dark water-soaked lesions.",
          "Reduce evening irrigation and avoid leaf wetness for long periods.",
          "Apply preventive fungicide if symptoms spread rapidly.",
          "Remove visibly infected leaves and monitor the crop for 48 hours.",
        ],
      };
    }

    return {
      title: "AI Diagnosis Result",
      disease: "Leaf Disease Risk Detected",
      confidence: "89%",
      advice: [
        "Your spoken symptoms suggest a fungal or moisture-related leaf issue.",
        "Check whether spots are increasing in size or developing yellow halos.",
        "Improve airflow between plants and reduce excess watering.",
        "Use crop-specific fungicide only after confirming severity in affected areas.",
      ],
    };
  }, [text]);

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    setError("");

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setRecording(true);

    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript;
      setText(speech);
      setRecording(false);
    };

    recognition.onerror = () => {
      setRecording(false);
      setError("Voice capture failed. Please try again.");
    };

    recognition.onend = () => {
      setRecording(false);
    };
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-800">
            Voice Query Diagnosis
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Describe crop problems by voice and get smart AI-based advisory for disease symptoms, irrigation, and treatment planning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Input Mode</p>
                <h3 className="mt-2 text-2xl font-semibold text-gray-800">
                  Voice
                </h3>
              </div>
              <div className="rounded-xl bg-green-50 p-3">
                <FaMicrophone className="text-green-600 text-lg" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Detected Topic</p>
                <h3 className="mt-2 text-2xl font-semibold text-gray-800">
                  Disease
                </h3>
              </div>
              <div className="rounded-xl bg-red-50 p-3">
                <FaBug className="text-red-500 text-lg" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Language</p>
                <h3 className="mt-2 text-2xl font-semibold text-gray-800">
                  {language === "en-US" ? "English" : "Hindi"}
                </h3>
              </div>
              <div className="rounded-xl bg-blue-50 p-3">
                <FaLanguage className="text-blue-500 text-lg" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">AI Confidence</p>
                <h3 className="mt-2 text-2xl font-semibold text-gray-800">
                  {aiResponse.confidence}
                </h3>
              </div>
              <div className="rounded-xl bg-yellow-50 p-3">
                <FaCheckCircle className="text-yellow-500 text-lg" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-6">
            <Card title="Farmer Voice Input">
              <div className="space-y-5">
                <div className="rounded-2xl overflow-hidden border border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80"
                    alt="Farmer field"
                    className="w-full h-[280px] object-cover"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Selected Language</p>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-700"
                    >
                      <option value="en-US">English</option>
                      <option value="hi-IN">Hindi</option>
                    </select>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Recording Status</p>
                    <div className="mt-3">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                          recording
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {recording ? "Recording..." : "Ready"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-[#245a45] px-6 py-8 text-white">
                  <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 border border-white/20">
                      <FaWaveSquare className="text-2xl" />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold">
                        Speak your crop problem
                      </h3>
                      <p className="mt-2 text-sm text-green-50/90 max-w-md">
                        Example: my tomato leaves have black spots and are drying from the edges.
                      </p>
                    </div>

                    <button
                      onClick={startRecording}
                      className="rounded-xl bg-white px-6 py-3 text-[#245a45] font-semibold shadow-sm hover:bg-green-50"
                    >
                      {recording ? "Listening..." : "Start Voice Query"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="xl:col-span-6">
            <Card title="Transcript & AI Response">
              <div className="space-y-5">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 min-h-[150px]">
                  <p className="text-sm text-gray-500 mb-2">Captured farmer query</p>
                  <p className="text-gray-700 leading-8 text-[17px]">
                    {text ||
                      "“The leaves on my tomato plants have dark spots and are wilting. What should I do?”"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-500">Possible Issue</p>
                    <h3 className="mt-1 text-base font-semibold text-red-600">
                      {aiResponse.disease}
                    </h3>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-500">Confidence</p>
                    <h3 className="mt-1 text-base font-semibold text-gray-800">
                      {aiResponse.confidence}
                    </h3>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <p className="text-sm text-gray-500">Suggestion Type</p>
                    <h3 className="mt-1 text-base font-semibold text-gray-800">
                      Preventive
                    </h3>
                  </div>
                </div>

                <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-xl bg-white p-2 border border-green-100">
                      <FaLeaf className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      AI Advisory Response
                    </h3>
                  </div>

                  <ul className="space-y-3 text-sm text-gray-700">
                    {aiResponse.advice.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-0.5 text-green-600">✔</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <FaTint className="text-blue-500" />
                    <h3 className="text-base font-semibold text-gray-800">
                      Irrigation Note
                    </h3>
                  </div>
                  <p className="text-sm leading-6 text-gray-700">
                    During suspected fungal symptoms, avoid late evening watering and keep leaf surfaces dry as much as possible.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Card title="Suggested Voice Prompts">
          <div className="flex flex-wrap gap-3">
            {samplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setText(prompt)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:border-green-300 hover:bg-green-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}