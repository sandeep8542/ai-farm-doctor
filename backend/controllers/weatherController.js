const axios = require("axios");

exports.getWeather = async (req, res) => {
  try {
    const latitude = req.query.lat || "28.6139";
    const longitude = req.query.lon || "77.2090";

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

    const response = await axios.get(url);

    res.json({
      location: {
        latitude,
        longitude,
      },
      ...response.data,
    });
  } catch (error) {
    console.error("Weather fetch failed:", error.message);
    res.status(500).json({ msg: "Unable to fetch weather data" });
  }
};