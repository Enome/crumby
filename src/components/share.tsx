import { LiaCopy } from "react-icons/lia";
import { State } from "../state";
import { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

type ShareProps = {
  state: State;
};

export default function Share(props: ShareProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copied]);

  const data_encoded = btoa(JSON.stringify(props.state));
  const url = `${window.location.origin}/${data_encoded}`;

  return (
    <>
      <div className="flex mb-2">
        <div className="border bg-gray-50 p-2 rounded truncate text-xs mr-1">
          <a href={url}>{url}</a>
        </div>
        <CopyToClipboard
          text={url}
          onCopy={() => {
            setCopied(true);
          }}
        >
          <button className="border border-gray-300 bg-gray-50 p-2 rounded cursor-pointer hover:border-gray-400">
            <LiaCopy />
          </button>
        </CopyToClipboard>
      </div>
      {copied && (
        <div className="text-xs text-gray-500 text-center">Copied!</div>
      )}
    </>
  );
}
