export default function Input({
  type = "text",
  onChange,
  className = "",
  ...props
}) {
  const textLikeTypes = ["text", "password", "email", "search", "tel", "url"];
  const isTextLike = textLikeTypes.includes(type);

  const combinedClasses = `bg-transparent w-full h-full text-primary font-bold ps-1 py-2 ${
    isTextLike
      ? "border-input border-b hover:border-b-2 focus:border-b-2 focus:outline-none focus:border-primary placeholder-input focus:placeholder-primary/50"
      : ""
  } ${className}`;

  return (
    <input
      type={type}
      onChange={onChange}
      className={combinedClasses}
      {...props}
    />
  );
}
