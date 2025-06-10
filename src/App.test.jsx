import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "./App";

// Mock child components to isolate App logic
jest.mock("./Components/DownloadProgress", () => (props) => (
  <div data-testid={`download-progress-${props.installType}`} />
));
jest.mock("./Components/ShieldoutlinedIconDialogue", () => (props) => (
  <div
    data-testid="shield-dialogue"
    data-filename={props.fileName}
    data-hash={props.hash}
    data-publisher={props.publisher}
    data-lastscan={props.lastScan}
  />
));

describe("App Component", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the top navigation bar with correct title and tabs", () => {
    expect(screen.getByText("ANALYTICS CLOUD")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Library" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Data" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Schedules" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Jobs" })).toBeInTheDocument();
  });

  it("renders the sidebar with navigation items", () => {
    expect(screen.getByText("Server")).toBeInTheDocument();
    expect(screen.getByText("Drivers")).toBeInTheDocument();
    expect(screen.getByLabelText("Go back")).toBeInTheDocument();
  });

  it("renders the main card with installation type radio buttons", () => {
    expect(screen.getByLabelText("Non-Admin")).toBeInTheDocument();
    expect(screen.getByLabelText("Admin")).toBeInTheDocument();
    // Non-Admin should be checked by default
    expect(screen.getByLabelText("Non-Admin")).toBeChecked();
  });

  it("changes installation type when radio button is clicked", () => {
    const adminRadio = screen.getByLabelText("Admin");
    fireEvent.click(adminRadio);
    expect(adminRadio).toBeChecked();
    // DownloadProgress should now be rendered with Admin prop
    // There are 5 accordions, each should have a DownloadProgress with Admin
    expect(screen.getAllByTestId("download-progress-Admin").length).toBe(5);
  });

  it("renders all accordions with correct titles", () => {
    expect(screen.getByText("Alteryx Designer")).toBeInTheDocument();
    expect(screen.getByText("Alteryx Predictive Tools")).toBeInTheDocument();
    expect(screen.getByText("Alteryx Intelligence Suite")).toBeInTheDocument();
    expect(screen.getByText("GenAI Tools")).toBeInTheDocument();
    expect(screen.getByText("Copilot")).toBeInTheDocument();
  });

  it("renders DownloadProgress and ShieldoutlinedIconDialogue in each accordion", () => {
    // There are 5 accordions, each should have a DownloadProgress and ShieldoutlinedIconDialogue
    expect(screen.getAllByTestId(/download-progress-/).length).toBe(5);
    expect(screen.getAllByTestId("shield-dialogue").length).toBe(5);
  });

  it("renders correct fileName prop in ShieldoutlinedIconDialogue", () => {
    const dialogues = screen.getAllByTestId("shield-dialogue");
    dialogues.forEach((dialogue) => {
      expect(dialogue.getAttribute("data-filename")).toBe("Alteryx Designer 2025.1.exe");
      expect(dialogue.getAttribute("data-hash")).toContain("SHA256");
      expect(dialogue.getAttribute("data-publisher")).toBe("Alteryx, Inc.");
      expect(dialogue.getAttribute("data-lastscan")).toBe("April 22, 2025");
    });
  });

  it("renders Additional Downloads section", () => {
    expect(screen.getByText("Additional Downloads")).toBeInTheDocument();
  });

  it("renders release notes links", () => {
    // There should be at least one Release Notes link
    expect(screen.getAllByText("Release Notes").length).toBeGreaterThan(0);
  });

  it("renders correct version and last updated text for each product", () => {
    expect(screen.getAllByText(/2025\.1/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Last Updated: April 22, 2025/).length).toBeGreaterThan(0);
  });

  it("renders correct file sizes for each product", () => {
    expect(screen.getByText("843 MB")).toBeInTheDocument();
    expect(screen.getByText("250 MB")).toBeInTheDocument();
    expect(screen.getByText("500 MB")).toBeInTheDocument();
    expect(screen.getByText("120 MB")).toBeInTheDocument();
    expect(screen.getByText("80 MB")).toBeInTheDocument();
  });
});