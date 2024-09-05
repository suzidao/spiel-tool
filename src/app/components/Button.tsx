/** @format */

export default function Button(props: {
  btnText: string;
  btnColor: string;
  btnAction: () => void;
  disabled?: boolean;
}) {
  const { btnColor, btnAction, btnText, disabled } = props;
  return (
    <button
      className={
        `bg-${btnColor}-300/60 hover:bg-${btnColor}-400/80 border border-${btnColor}-500 transition-all ease-in-out py-1 px-3 rounded text-xs font-medium uppercase whitespace-nowrap ` +
        (disabled ? `disabled:text-gray-600 disabled:bg-${btnColor}-200/50 disabled:border-${btnColor}-400` : "")
      }
      onClick={btnAction}
      disabled={disabled}
    >
      {btnText}
    </button>
  );
}
