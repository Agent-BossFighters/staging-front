export default function Button({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`font-bold py-2 px-4 rounded ${className}`}
    >
      {children}
    </button>
  );
}
