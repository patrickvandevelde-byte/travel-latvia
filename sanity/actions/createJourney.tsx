import { ClipboardIcon } from "@sanity/icons/Clipboard";
import { useCallback, useEffect, useState } from "react";
import { useClient, type DocumentActionComponent } from "sanity";
import { useRouter } from "sanity/router";
import { journeyFromEnquiry } from "../../src/modules/operations/journey";
import { apiVersion } from "../env";

const EXISTING_JOURNEY = `*[_type == "trip" && enquiry._ref == $id] | order(_updatedAt desc)[0]._id`;

const newId = () => crypto.randomUUID();
const newKey = () => crypto.randomUUID().replace(/-/g, "").slice(0, 12);

/**
 * "Create journey" on an enquiry (OPS-03, docs/11 §6.2). Creates a draft
 * journey prefilled from the enquiry and opens it. When a journey already
 * exists for this enquiry (draft or published) the action becomes
 * "Open journey". The enquiry's own status is left to the operator.
 */
export const CreateJourneyAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion });
  const router = useRouter();
  const enquiryId = props.id;
  const [existing, setExisting] = useState<string | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  const findExisting = useCallback(
    () =>
      client
        .fetch<string | null>(EXISTING_JOURNEY, { id: enquiryId }, { perspective: "raw" })
        .then((id) => (id ? id.replace(/^drafts\./, "") : null)),
    [client, enquiryId],
  );

  useEffect(() => {
    let active = true;
    findExisting()
      .then((id) => active && setExisting(id))
      .catch(() => active && setExisting(null));
    return () => {
      active = false;
    };
  }, [findExisting]);

  const enquiry = props.draft ?? props.published;

  return {
    label: existing ? "Open journey" : "Create journey",
    title: existing
      ? "Open the journey made from this enquiry"
      : "Create a journey prefilled with this enquiry's details and open it",
    icon: ClipboardIcon,
    disabled: busy || existing === undefined || !enquiry,
    onHandle: async () => {
      setBusy(true);
      try {
        // Check again at click time so a double click never creates two journeys.
        const found = await findExisting();
        if (found) {
          setExisting(found);
          router.navigateIntent("edit", { id: found, type: "trip" });
          return;
        }
        const id = newId();
        await client.create({ _id: `drafts.${id}`, ...journeyFromEnquiry({ ...enquiry, _id: enquiryId }, newKey) });
        setExisting(id);
        router.navigateIntent("edit", { id, type: "trip" });
      } finally {
        setBusy(false);
      }
    },
  };
};
CreateJourneyAction.displayName = "CreateJourneyAction";
