export default function TextField({
  name,
  value,
  placeholder,
  onChange,
  label,
  type = "text",
  message = "",
  autoComplete,
}: {
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  type?: string;
  message?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-600">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        // 라벨이 보이지 않는 화면에서는 placeholder가 입력창 이름을 대신한다
        aria-label={label ? undefined : placeholder}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
          label ? "mt-1.5" : ""
        } ${
          message
            ? "border-red-400 focus:border-red-400"
            : "border-gray-200 focus:border-orange-400"
        }`}
      />
      {message && <p className="mt-1.5 text-xs text-red-500">{message}</p>}
    </div>
  );
}
