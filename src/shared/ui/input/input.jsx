export default function Input({ type = 'text', onChange, className = '', ...props }) {
  const textLikeTypes = ['text', 'password', 'email', 'search', 'tel', 'url'];
  const isTextLike = textLikeTypes.includes(type);

  const combinedClasses = `bg-transparent w-full h-full text-primary font-bold py-2 ${
    isTextLike
      ? 'border-b-2 border-input focus:outline-none focus:border-b-3 focus:border-primary placeholder-input focus:placeholder-primary/50'
      : ''
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
