import { describe, expect, it } from "vitest";
import { deleteWarning, journeyFromEnquiry } from "@/modules/operations/journey";
import { DEFAULT_CHECKLIST } from "@/modules/operations/manifest";

const keys = () => {
  let i = 0;
  return () => `k${++i}`;
};

describe("journeyFromEnquiry", () => {
  const enquiry = {
    _id: "drafts.enq-1",
    _type: "enquiry",
    status: "quoted",
    name: "Anna Jansen",
    email: "anna@example.com",
    phone: "+31 6 1234 5678",
    period: "October 2027",
    tripType: "Nature & hiking",
    wishes: "Family of four, two kids",
  };

  it("prefills the journey from the enquiry", () => {
    expect(journeyFromEnquiry(enquiry, keys())).toEqual({
      _type: "trip",
      title: "Anna Jansen — Nature & hiking",
      status: "planned",
      kind: "journey",
      tripType: "Nature & hiking",
      lead: { name: "Anna Jansen", email: "anna@example.com", phone: "+31 6 1234 5678" },
      travellers: [{ _key: "k1", _type: "traveller", fullName: "Anna Jansen", ageGroup: "adult" }],
      enquiry: { _type: "reference", _ref: "enq-1", _weak: true },
      checklist: DEFAULT_CHECKLIST.map((label, i) => ({ _key: `k${i + 2}`, _type: "checkItem", label, done: false })),
      internalNotes: "Travel period: October 2027\n\nWishes:\nFamily of four, two kids",
    });
  });

  it("detects hunting trips case-insensitively", () => {
    expect(journeyFromEnquiry({ ...enquiry, tripType: "Driven HUNT" }, keys()).kind).toBe("hunting");
    expect(journeyFromEnquiry({ ...enquiry, tripType: "Hunting trip" }, keys()).kind).toBe("hunting");
  });

  it("copes with a sparse enquiry", () => {
    const draft = journeyFromEnquiry({ _id: "enq-2", name: "Jan" }, keys());
    expect(draft.title).toBe("Jan — journey");
    expect(draft.kind).toBe("journey");
    expect(draft.tripType).toBeUndefined();
    expect(draft.lead).toEqual({ name: "Jan" });
    expect(draft.internalNotes).toBe("Travel period: not given\n\nWishes:\nnot given");
  });

  it("keeps the title within the 80-character limit", () => {
    const draft = journeyFromEnquiry({ _id: "e", name: "A".repeat(70), tripType: "Nature & hiking" }, keys());
    expect(draft.title.length).toBeLessThanOrEqual(80);
    expect(draft.title.endsWith("…")).toBe(true);
  });
});

describe("deleteWarning", () => {
  const trip = {
    status: "confirmed",
    startDate: "2027-10-14",
    endDate: "2027-10-19",
    travellers: [{ fullName: "A" }, { fullName: "B" }, { fullName: "C" }, { fullName: "D" }],
  };

  it("warns before deleting a journey that has not departed", () => {
    expect(deleteWarning(trip, "2027-09-01")).toBe(
      "This journey departs on 14 Oct 2027 with 4 travellers. Delete it anyway? Setting the status to Cancelled keeps the record.",
    );
    expect(deleteWarning({ ...trip, travellers: [{ fullName: "A" }] }, "2027-10-14")).toContain("with 1 traveller.");
    expect(deleteWarning({ ...trip, travellers: [] }, "2027-09-01")).toContain("with no travellers yet.");
  });

  it("lets cancelled, past or undated journeys be deleted as usual", () => {
    expect(deleteWarning({ ...trip, status: "cancelled" }, "2027-09-01")).toBeNull();
    expect(deleteWarning(trip, "2027-10-15")).toBeNull();
    expect(deleteWarning({ ...trip, startDate: undefined }, "2027-09-01")).toBeNull();
  });
});
