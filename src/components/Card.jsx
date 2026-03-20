export default function Card({ title, children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-7 ${className}`}
    >
      {title && (
        <div className="mb-5">
          <h2 className="text-[20px] font-semibold tracking-tight text-gray-800">
            {title}
          </h2>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}