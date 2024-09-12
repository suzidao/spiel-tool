/** @format */

export default function Button(props: {
  btnText: string;
  btnColor: string;
  className?: string;
  btnType?: "button" | "reset" | "submit";
  btnAction?: () => void;
  disabled?: boolean;
}) {
  const { btnColor, btnAction, btnText, btnType, className, disabled } = props;

  const buildBtnStyles = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-300/60 hover:bg-red-400/80 border-red-500 disabled:bg-red-200/50 disabled:border-red-400";
      case "orange":
        return "bg-orange-300/60 hover:bg-orange-400/80 border-orange-500 disabled:bg-orange-200/50 disabled:border-orange-400";
      case "yellow":
        return "bg-yellow-300/60 hover:bg-yellow-400/80 border-yellow-500 disabled:bg-yellow-200/50 disabled:border-yellow-400";
      case "green":
        return "bg-green-300/60 hover:bg-green-400/80 border-green-500 disabled:bg-green-200/50 disabled:border-green-400";
      case "teal":
        return "bg-teal-300/60 hover:bg-teal-400/80 border-teal-500 disabled:bg-teal-200/50 disabled:border-teal-400";
      case "cyan":
        return "bg-cyan-300/60 hover:bg-cyan-400/80 border-cyan-500 disabled:bg-cyan-200/50 disabled:border-cyan-400";
      case "purple":
        return "bg-purple-300/60 hover:bg-purple-400/80 border-purple-500 disabled:bg-purple-200/50 disabled:border-purple-400";
      case "gray":
        return "bg-gray-200/40 hover:bg-gray-300/70 border-gray-400 disabled:bg-gray-100/30 disabled:border-gray-300";
    }
  };

  return (
    <button
      className={`${buildBtnStyles(
        btnColor
      )} ${className} border transition-all ease-in-out py-1 px-3 rounded text-xs font-medium uppercase whitespace-nowrap disabled:text-gray-600`}
      onClick={btnAction}
      type={btnType ?? "button"}
      disabled={disabled}
    >
      {btnText}
    </button>
  );
}
