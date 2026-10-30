import { useState } from "react";
import type { DocumentActionComponent } from "sanity";
import { rigaDateKey } from "../../src/lib/dates";
import { deleteWarning } from "../../src/modules/operations/journey";

/**
 * Wraps Delete on journeys (OPS-03, docs/11 §6.3): deleting a journey that
 * has not departed first shows its dates and number of travellers and
 * suggests Cancelled instead. Otherwise Delete behaves as usual.
 */
export function withTripDeleteGuard(original: DocumentActionComponent): DocumentActionComponent {
  const Guarded: DocumentActionComponent = (props) => {
    const result = original(props);
    const [confirming, setConfirming] = useState(false);
    if (!result) return result;

    const warning = deleteWarning(props.draft ?? props.published, rigaDateKey(new Date()));
    if (!warning) return result;

    return {
      ...result,
      onHandle: () => setConfirming(true),
      dialog: confirming
        ? {
            type: "confirm",
            tone: "critical",
            message: warning,
            confirmButtonText: "Delete",
            cancelButtonText: "Keep",
            onConfirm: () => {
              setConfirming(false);
              result.onHandle?.();
            },
            onCancel: () => setConfirming(false),
          }
        : result.dialog,
    };
  };
  Guarded.action = original.action;
  Guarded.displayName = "GuardedTripDeleteAction";
  return Guarded;
}
