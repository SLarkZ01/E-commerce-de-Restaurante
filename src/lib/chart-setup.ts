import {
  Chart,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);
