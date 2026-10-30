import { PROGRESS_STEPS, type Order } from "@/lib/orders";

const formatTime = (d?: Date) => (d ? d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "");

/** Vertical progress of an order: placed, confirmed, shipped, delivered (or cancelled). */
export default function OrderTimeline({ order }: { order: Pick<Order, "status" | "statusTimes"> }) {
  if (order.status === "cancelled") {
    return (
      <div role="status" className="rounded-md bg-danger/15 p-4 text-sm text-danger">
        <p className="font-medium">This order was cancelled.</p>
        {order.statusTimes.cancelled && <p className="mt-0.5 text-xs">{formatTime(order.statusTimes.cancelled)}</p>}
      </div>
    );
  }

  const current = PROGRESS_STEPS.findIndex((s) => s.status === order.status);
  return (
    <ol aria-label="Order progress">
      {PROGRESS_STEPS.map((step, i) => {
        const reached = i <= current;
        const isCurrent = i === current;
        const last = i === PROGRESS_STEPS.length - 1;
        return (
          <li key={step.status} aria-current={isCurrent ? "step" : undefined} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && <span aria-hidden className={`absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-0.5 ${i < current ? "bg-primary" : "bg-line"}`} />}
            <span
              aria-hidden
              className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[11px] ${
                reached ? "border-primary bg-primary text-primary-fg" : "border-line bg-base text-transparent"
              } ${isCurrent ? "ring-4 ring-primary/25" : ""}`}
            >
              ✓
            </span>
            <div>
              <p className={`text-sm font-medium ${reached ? "text-fg" : "text-muted"}`}>{step.label}</p>
              {isCurrent && <p className="text-xs text-muted">{step.hint}</p>}
              {reached && order.statusTimes[step.status] && <p className="text-xs text-muted">{formatTime(order.statusTimes[step.status])}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
