import toast, { type Toast } from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";

type MessageToastData = {
  userId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  onRead: (userId: string) => void;
};

function MessageToastContent({ t, data }: { t: Toast; data: MessageToastData }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate({ to: "/chat/$userId", params: { userId: data.userId } });
    data.onRead(data.userId);
    toast.dismiss(t.id);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className={`${t.visible ? "animate-slide-down" : "opacity-0"} flex w-[340px] cursor-pointer items-start gap-3 rounded-xl border border-glass-border border-l-[3px] border-l-amber bg-[rgba(255,255,255,0.95)] p-3 shadow-lg backdrop-blur-xl transition-all hover:bg-[rgba(255,255,255,1)]`}
    >
      {data.senderAvatar && (
        <img
          src={data.senderAvatar}
          alt={data.senderName}
          className="h-9 w-9 shrink-0 rounded-full bg-received-bg"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-ink">{data.senderName}</p>
        <p className="truncate text-[11px] text-ink-muted">{data.content}</p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toast.dismiss(t.id);
        }}
        className="shrink-0 rounded-md p-0.5 text-ink-muted transition-colors hover:text-ink"
        aria-label="Fechar"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

export function showMessageToast(data: MessageToastData) {
  toast.custom((t) => <MessageToastContent t={t} data={data} />, {
    duration: 4000,
    position: "top-right",
  });
}
