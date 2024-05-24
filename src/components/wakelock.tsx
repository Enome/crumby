import cx from "classnames";
import { useWakeLock } from "react-screen-wake-lock";
import { TbBulb, TbBulbOff } from "react-icons/tb";

function Component() {
  const { isSupported, released, request, release } = useWakeLock({
    onRequest: () => console.log("Screen Wake Lock: requested!"),
    onError: () => console.error("An error happened 💥"),
    onRelease: () => console.log("Screen Wake Lock: released!"),
  });

  if (!isSupported) {
    return null;
  }

  return (
    <div
      title="Screen Wake Lock"
      className={cx(
        "rounded-full p-3 cursor-pointer",
        released === false
          ? "bg-orange-50 text-red-600 "
          : "bg-gray-100 text-gray-500",
      )}
      onClick={() => (released === false ? release() : request())}
    >
      {released === false ? <TbBulb /> : <TbBulbOff />}
    </div>
  );
}

export default Component;
