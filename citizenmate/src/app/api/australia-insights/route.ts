import { NextResponse } from "next/server";

// ===== Types =====

export interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    weatherCode: number;
    windSpeed: number;
    uvIndex: number;
    condition: string;
    icon: string;
  };
  daily: {
    date: string;
    dayName: string;
    tempMax: number;
    tempMin: number;
    uvMax: number;
    weatherCode: number;
    condition: string;
    icon: string;
  }[];
  location: string;
}

export interface CurrencyRate {
  code: string;
  name: string;
  flag: string;
  rate: number;
}

export interface CountryFact {
  label: string;
  value: string;
  icon: string;
}

export interface PublicHoliday {
  date: string;
  name: string;
  localName: string;
  global: boolean;
  counties: string[] | null;
  daysUntil: number;
  isPast: boolean;
}

export interface AustraliaInsightsData {
  weather: WeatherData | null;
  currencies: CurrencyRate[] | null;
  countryFacts: CountryFact[] | null;
  holidays: PublicHoliday[] | null;
  fetchedAt: string;
}

// ===== WMO Weather Code Mapping =====

const WMO_CODES: Record<number, { condition: string; icon: string }> = {
  0: { condition: "Clear sky", icon: "☀️" },
  1: { condition: "Mainly clear", icon: "🌤️" },
  2: { condition: "Partly cloudy", icon: "⛅" },
  3: { condition: "Overcast", icon: "☁️" },
  45: { condition: "Foggy", icon: "🌫️" },
  48: { condition: "Rime fog", icon: "🌫️" },
  51: { condition: "Light drizzle", icon: "🌦️" },
  53: { condition: "Drizzle", icon: "🌦️" },
  55: { condition: "Dense drizzle", icon: "🌧️" },
  61: { condition: "Slight rain", icon: "🌦️" },
  63: { condition: "Rain", icon: "🌧️" },
  65: { condition: "Heavy rain", icon: "🌧️" },
  71: { condition: "Slight snow", icon: "🌨️" },
  73: { condition: "Snow", icon: "❄️" },
  75: { condition: "Heavy snow", icon: "❄️" },
  80: { condition: "Slight showers", icon: "🌦️" },
  81: { condition: "Showers", icon: "🌧️" },
  82: { condition: "Violent showers", icon: "⛈️" },
  95: { condition: "Thunderstorm", icon: "⛈️" },
  96: { condition: "Thunderstorm with hail", icon: "⛈️" },
  99: { condition: "Thunderstorm with heavy hail", icon: "⛈️" },
};

function getWeatherInfo(code: number) {
  return WMO_CODES[code] || { condition: "Unknown", icon: "🌡️" };
}

// ===== Currency metadata =====

const CURRENCY_META: Record<string, { name: string; flag: string }> = {
  USD: { name: "US Dollar", flag: "🇺🇸" },
  GBP: { name: "British Pound", flag: "🇬🇧" },
  EUR: { name: "Euro", flag: "🇪🇺" },
  INR: { name: "Indian Rupee", flag: "🇮🇳" },
  CNY: { name: "Chinese Yuan", flag: "🇨🇳" },
  PHP: { name: "Philippine Peso", flag: "🇵🇭" },
  VND: { name: "Vietnamese Dong", flag: "🇻🇳" },
  BRL: { name: "Brazilian Real", flag: "🇧🇷" },
  NZD: { name: "New Zealand Dollar", flag: "🇳🇿" },
  JPY: { name: "Japanese Yen", flag: "🇯🇵" },
  KRW: { name: "South Korean Won", flag: "🇰🇷" },
  SGD: { name: "Singapore Dollar", flag: "🇸🇬" },
};

const TARGET_CURRENCIES = ["USD", "GBP", "EUR", "INR", "CNY", "PHP", "VND", "NZD", "JPY", "KRW", "SGD", "BRL"];

// ===== Day name helper =====

function getDayName(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === tomorrow.getTime()) return "Tomorrow";
  return date.toLocaleDateString("en-AU", { weekday: "short" });
}

// ===== Fetchers =====

async function fetchWeather(): Promise<WeatherData | null> {
  try {
    // Default to Sydney — in a real app, we'd use the user's saved location
    const url = "https://api.open-meteo.com/v1/forecast?latitude=-33.87&longitude=151.21&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,uv_index&daily=temperature_2m_max,temperature_2m_min,uv_index_max,weather_code&timezone=Australia%2FSydney&forecast_days=7";
    const res = await fetch(url, { next: { revalidate: 1800 } }); // 30 min cache
    if (!res.ok) return null;
    const data = await res.json();

    const currentWeather = getWeatherInfo(data.current.weather_code);

    return {
      current: {
        temperature: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        weatherCode: data.current.weather_code,
        windSpeed: Math.round(data.current.wind_speed_10m),
        uvIndex: data.current.uv_index,
        condition: currentWeather.condition,
        icon: currentWeather.icon,
      },
      daily: data.daily.time.map((date: string, i: number) => {
        const info = getWeatherInfo(data.daily.weather_code[i]);
        return {
          date,
          dayName: getDayName(date),
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          tempMin: Math.round(data.daily.temperature_2m_min[i]),
          uvMax: data.daily.uv_index_max[i],
          weatherCode: data.daily.weather_code[i],
          condition: info.condition,
          icon: info.icon,
        };
      }),
      location: "Sydney, NSW",
    };
  } catch (e) {
    console.error("Weather fetch failed:", e);
    return null;
  }
}

async function fetchCurrencies(): Promise<CurrencyRate[] | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/AUD", {
      next: { revalidate: 86400 }, // 24 hour cache
    });
    if (!res.ok) return null;
    const data = await res.json();

    return TARGET_CURRENCIES
      .filter((code) => data.rates[code])
      .map((code) => ({
        code,
        name: CURRENCY_META[code]?.name || code,
        flag: CURRENCY_META[code]?.flag || "🏳️",
        rate: data.rates[code],
      }));
  } catch (e) {
    console.error("Currency fetch failed:", e);
    return null;
  }
}

async function fetchCountryFacts(): Promise<CountryFact[] | null> {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/alpha/aus?fields=name,capital,population,area,languages,currencies,timezones,demonyms,car",
      { next: { revalidate: 604800 } } // 7 day cache — rarely changes
    );
    if (!res.ok) return null;
    const data = await res.json();

    return [
      { label: "Official Name", value: data.name?.official || "Commonwealth of Australia", icon: "🏛️" },
      { label: "Capital", value: data.capital?.[0] || "Canberra", icon: "🏙️" },
      { label: "Population", value: new Intl.NumberFormat("en-AU").format(data.population || 27000000), icon: "👥" },
      { label: "Area", value: `${new Intl.NumberFormat("en-AU").format(data.area || 7692024)} km²`, icon: "🗺️" },
      { label: "Language", value: Object.values(data.languages || {})[0] as string || "English", icon: "💬" },
      { label: "Currency", value: `${data.currencies?.AUD?.name || "Australian Dollar"} (${data.currencies?.AUD?.symbol || "$"})`, icon: "💵" },
      { label: "Drive Side", value: (data.car?.side || "left").charAt(0).toUpperCase() + (data.car?.side || "left").slice(1), icon: "🚗" },
      { label: "Timezones", value: `${(data.timezones || []).length} zones`, icon: "🕐" },
    ];
  } catch (e) {
    console.error("Country facts fetch failed:", e);
    return null;
  }
}

async function fetchHolidays(): Promise<PublicHoliday[] | null> {
  try {
    const year = new Date().getFullYear();
    const res = await fetch(`https://date.nager.at/api/v3/publicholidays/${year}/AU`, {
      next: { revalidate: 86400 }, // 24 hour cache
    });
    if (!res.ok) return null;
    const data = await res.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (data as Array<{
      date: string;
      name: string;
      localName: string;
      global: boolean;
      counties: string[] | null;
    }>).map((h) => {
      const holidayDate = new Date(h.date + "T00:00:00");
      const diffMs = holidayDate.getTime() - today.getTime();
      const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      return {
        date: h.date,
        name: h.name,
        localName: h.localName,
        global: h.global,
        counties: h.counties,
        daysUntil,
        isPast: daysUntil < 0,
      };
    });
  } catch (e) {
    console.error("Holidays fetch failed:", e);
    return null;
  }
}

// ===== Route Handler =====

export async function GET() {
  const [weather, currencies, countryFacts, holidays] = await Promise.allSettled([
    fetchWeather(),
    fetchCurrencies(),
    fetchCountryFacts(),
    fetchHolidays(),
  ]);

  const result: AustraliaInsightsData = {
    weather: weather.status === "fulfilled" ? weather.value : null,
    currencies: currencies.status === "fulfilled" ? currencies.value : null,
    countryFacts: countryFacts.status === "fulfilled" ? countryFacts.value : null,
    holidays: holidays.status === "fulfilled" ? holidays.value : null,
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
