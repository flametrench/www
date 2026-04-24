export function FlameMark({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="flame-gradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f7b733" />
          <stop offset="1" stopColor="#ff6b35" />
        </linearGradient>
      </defs>
      {/* Stylized flame trench: an upward flame shape inside a trench silhouette */}
      <path
        d="M12 2c1.6 3.2 4.4 5.4 4.4 9.2 0 3.4-2 5.6-4.4 5.6s-4.4-2.2-4.4-5.6C7.6 7.4 10.4 5.2 12 2z"
        fill="url(#flame-gradient)"
      />
      <path
        d="M3 18h4l1-2h8l1 2h4v3H3z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M3 18h4l1-2h8l1 2h4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}
