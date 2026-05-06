import { describe, expect, it } from "vitest";
import { NETWORKS, getNetwork } from "./networks";

describe("NETWORKS", () => {
  it("contains the expected networks", () => {
    const ids = NETWORKS.map((n) => n.id);
    expect(ids).toEqual([
      "ethereum",
      "polygon",
      "bnb",
      "optimism",
      "arbitrum",
    ]);
  });

  it("entries have all required fields", () => {
    for (const net of NETWORKS) {
      expect(net.name).toBeTruthy();
      expect(net.gas).toMatch(/^~\$/);
      expect(net.color).toMatch(/^#/);
      expect(net.icon).toBeTruthy();
    }
  });
});

describe("getNetwork", () => {
  it("returns the network with the given id", () => {
    expect(getNetwork("polygon")).toEqual(NETWORKS[1]);
  });

  it("falls back to the first network when the id is unknown", () => {
    expect(getNetwork("nonexistent")).toBe(NETWORKS[0]);
  });
});
