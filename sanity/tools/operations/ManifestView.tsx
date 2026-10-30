import { CopyIcon } from "@sanity/icons/Copy";
import { DocumentPdfIcon } from "@sanity/icons/DocumentPdf";
import { DownloadIcon } from "@sanity/icons/Download";
import { Box, Button, Card, Flex, Stack, Switch, Text } from "@sanity/ui";
import { useToast } from "@sanity/ui/toast";
import { useEffect, useId, useMemo, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useClient } from "sanity";
import type { UserViewComponent } from "sanity/structure";
import { rigaDateKey } from "../../../src/lib/dates";
import {
  exportFileName,
  formatLongDate,
  toManifest,
  travellersCsv,
  whatsappSummary,
} from "../../../src/modules/operations/manifest";
import { apiVersion } from "../../env";
import { copyText, downloadText, openPrintWindow, printDocument } from "./exporters";
import { ManifestSheet } from "./ManifestSheet";

/**
 * The "Manifest" tab on every journey (OPS-03, docs/11 §7): the sheet plus a
 * toolbar to print / save as PDF, download travellers as CSV and copy a
 * WhatsApp summary. Shows the draft when there is one.
 */
export const ManifestView: UserViewComponent = ({ document: doc }) => {
  const client = useClient({ apiVersion });
  const toast = useToast();
  const switchId = useId();
  const [includeInternal, setIncludeInternal] = useState(true);
  const [siteName, setSiteName] = useState<string | undefined>();

  const manifest = useMemo(() => toManifest(doc.displayed), [doc.displayed]);
  const today = rigaDateKey(new Date());
  const unsaved = Boolean(doc.draft);

  useEffect(() => {
    let active = true;
    client
      .fetch<string | null>(`*[_id == "siteSettings"][0].siteName`)
      .then((name) => {
        if (active && name) setSiteName(name);
      })
      .catch(() => {
        // The footer simply leaves the site name out.
      });
    return () => {
      active = false;
    };
  }, [client]);

  const handlePrint = () => {
    const markup = renderToStaticMarkup(
      <ManifestSheet
        manifest={manifest}
        today={today}
        includeInternal={includeInternal}
        forPrint
        printedOn={formatLongDate(today)}
        siteName={siteName}
      />,
    );
    if (!openPrintWindow(printDocument(manifest.title, markup))) {
      toast.push({
        status: "warning",
        title: "The print window was blocked",
        description: "Allow pop-ups for this site in your browser, then try again.",
      });
    }
  };

  const handleCsv = () => {
    const ok = downloadText(
      exportFileName(manifest, "travellers", "csv"),
      travellersCsv(manifest),
      "text/csv;charset=utf-8",
    );
    toast.push(
      ok
        ? {
            status: "success",
            title: "Travellers downloaded",
            description: "Opens in Excel, Numbers or Google Sheets.",
          }
        : { status: "error", title: "The download could not start" },
    );
  };

  const handleCopy = async () => {
    const ok = await copyText(whatsappSummary(manifest));
    toast.push(
      ok
        ? { status: "success", title: "Copied", description: "Paste it into WhatsApp. Internal notes are left out." }
        : { status: "error", title: "Could not copy", description: "Your browser blocked the clipboard." },
    );
  };

  return (
    <Box height="fill" style={{ overflow: "auto" }}>
      <Card padding={3} borderBottom style={{ position: "sticky", top: 0, zIndex: 1 }}>
        <Flex gap={2} wrap="wrap" align="center">
          <Button icon={DocumentPdfIcon} text="Print / Save as PDF" tone="primary" onClick={handlePrint} />
          <Button
            icon={DownloadIcon}
            text="Download travellers (CSV)"
            mode="ghost"
            onClick={handleCsv}
            disabled={manifest.travellers.length === 0}
          />
          <Button icon={CopyIcon} text="Copy for WhatsApp" mode="ghost" onClick={handleCopy} />
          <Flex as="label" htmlFor={switchId} align="center" gap={2} style={{ marginLeft: "auto" }}>
            <Switch
              id={switchId}
              checked={includeInternal}
              onChange={(e) => setIncludeInternal(e.currentTarget.checked)}
            />
            <Text size={1}>Include internal notes</Text>
          </Flex>
        </Flex>
        <Stack marginTop={3} gap={2}>
          <Text size={1} muted>
            {includeInternal
              ? "Your version: readiness checks and internal notes are shown."
              : "Supplier version: readiness checks and internal notes are left out."}
          </Text>
          {unsaved ? (
            <Text size={1} muted>
              Showing unsaved changes
            </Text>
          ) : null}
        </Stack>
      </Card>
      <Box padding={[2, 3, 4]}>
        <ManifestSheet manifest={manifest} today={today} includeInternal={includeInternal} />
      </Box>
    </Box>
  );
};
