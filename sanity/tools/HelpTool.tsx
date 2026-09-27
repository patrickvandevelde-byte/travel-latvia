import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { Box, Card, Container, Heading, Stack, Text, TextInput } from "@sanity/ui";
import { useMemo, useState } from "react";
import type { Tool } from "sanity";
import { helpGuides } from "../help/guides";

function HelpToolComponent() {
  const [query, setQuery] = useState("");
  const guides = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return helpGuides;
    return helpGuides.filter((g) => `${g.title} ${g.steps.join(" ")}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <Box padding={4} style={{ overflow: "auto", height: "100%" }}>
      <Container width={2}>
        <Stack gap={5}>
          <Stack gap={3}>
            <Heading as="h1" size={3}>
              How do I…?
            </Heading>
            <Text muted>Step-by-step guides for everyday website tasks.</Text>
            <TextInput
              aria-label="Search the guides"
              placeholder="Search, e.g. redirect, menu, hero"
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
            />
          </Stack>
          {guides.map((guide) => (
            <Card key={guide.task} padding={4} radius={3} shadow={1}>
              <Stack gap={4}>
                <Heading as="h2" size={1}>
                  {guide.title}
                </Heading>
                <Stack as="ol" gap={3} style={{ paddingLeft: "1.25em", margin: 0 }}>
                  {guide.steps.map((step) => (
                    <Text as="li" key={step}>
                      {step}
                    </Text>
                  ))}
                </Stack>
                {guide.tip ? (
                  <Text size={1} muted>
                    Tip: {guide.tip}
                  </Text>
                ) : null}
              </Stack>
            </Card>
          ))}
          {guides.length === 0 ? <Text muted>No guide matches “{query}”.</Text> : null}
        </Stack>
      </Container>
    </Box>
  );
}

export const helpTool: Tool = {
  name: "help",
  title: "Help",
  icon: HelpCircleIcon,
  component: HelpToolComponent,
};
