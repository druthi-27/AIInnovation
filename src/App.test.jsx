import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

// Mock child components to isolate App tests
jest.mock("./Components/DownloadProgress", () => () => <div data-testid="download-progress" />);
jest.mock("./Components/ShieldoutlinedIconDialogue", () => () => <div data-testid="shield-dialogue" />);
jest.mock("./Components/ChatbotPopup", () => () => <div data-testid="chatbot-popup" />);

describe("App Component", () => {
  it("renders the top navigation bar with logo and title", () => {
    render(<App />);
    expect(screen.getByAltText(/analytics cloud/i)).toBeInTheDocument();
    expect(screen.getByText(/analytics workbench/i)).toBeInTheDocument();
  });

  it("renders all main tabs", () => {
    render(<App />);
    expect(screen.getByRole("tab", { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /library/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /data/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /schedules/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /jobs/i })).toBeInTheDocument();
  });

  it("renders sidebar with navigation items", () => {
    render(<App />);
    // Sidebar items may have multiple matches, so use getAllByText and check at least one exists
    expect(screen.getAllByText(/designer desktop/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/server/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/drivers/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /go back/i })).toBeInTheDocument();
  });

  it("renders installation type radio buttons and changes value", () => {
    render(<App />);
    const nonAdminRadio = screen.getByLabelText(/^Non-Admin$/i);
    const adminRadio = screen.getByLabelText(/^Admin$/i);
  
    expect(nonAdminRadio).toBeChecked();
    expect(adminRadio).not.toBeChecked();
  
    fireEvent.click(adminRadio);
    expect(adminRadio).toBeChecked();
    expect(nonAdminRadio).not.toBeChecked();
  });

  it("renders all main accordions with correct titles", () => {
    render(<App />);
    [
      /alteryx designer/i,
      /alteryx predictive tools/i,
      /alteryx intelligence suite/i,
      /genai tools/i,
      /copilot/i,
    ].forEach((re) => {
      expect(screen.getAllByText(re).length).toBeGreaterThan(0);
    });
  });

  it("renders DownloadProgress and ShieldoutlinedIconDialogue in each accordion", () => {
    render(<App />);
    // There are 5 accordions, so expect 5 of each mocked component
    expect(screen.getAllByTestId("download-progress")).toHaveLength(5);
    expect(screen.getAllByTestId("shield-dialogue")).toHaveLength(5);
  });

  it("renders the chatbot popup component", () => {
    render(<App />);
    expect(screen.getByTestId("chatbot-popup")).toBeInTheDocument();
  });

  it("renders 'Additional Downloads' section", () => {
    render(<App />);
    expect(screen.getByText(/additional downloads/i)).toBeInTheDocument();
  });

  it("accordion expands and collapses on click", () => {
    render(<App />);
    // Find the accordion summary button for "Alteryx Predictive Tools"
    const predictiveAccordionSummary = screen.getByRole('button', { name: /alteryx predictive tools/i });
    expect(predictiveAccordionSummary).toBeInTheDocument();
    // Collapse if expanded
    fireEvent.click(predictiveAccordionSummary);
    // Expand again
    fireEvent.click(predictiveAccordionSummary);
    // No error expected
  });
});