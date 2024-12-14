type Props = {
  percentage: number; // Progress value (0 - 100)
  size?: number; // Size of the circular progress in pixels
  strokeWidth?: number; // Thickness of the circular progress bar
  color?: string; // Color of the progress
};

export default function CircularProgress({
  percentage,
  size = 100,
  strokeWidth = 10,
  color = "#22c55e",
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className={`transform -rotate-90 transition-all duration-300 ease-in-out`}
        style={{ display: "block" }}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB" // Tailwind gray-300
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      {/* Percentage Text */}
      {percentage <= 100 && (
        <span className="absolute text-xl font-semibold text-gray-800">
          {percentage}%
        </span>
      )}
    </div>
  );
}
