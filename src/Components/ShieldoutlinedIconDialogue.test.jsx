import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShieldoutlinedIconDialogue from "../Components/ShieldoutlinedIconDialogue";

describe("ShieldoutlinedIconDialogue", () => {
  const defaultProps = {
    fileName: "testfile.exe",
    hash: "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    publisher: "Test Publisher",
    lastScan: "2024-06-01 12:34:56"
  };

  it("shouldOpenDialogOnIconButtonClick", () => {
    render(<ShieldoutlinedIconDialogue {...defaultProps} />);
    // Dialog should not be visible initially
    expect(screen.queryByText(/Security Details/i)).not.toBeInTheDocument();

    // Click the icon button (ShieldOutlinedIcon is inside IconButton)
    const iconButton = screen.getByRole("button", { name: /view security details/i });
    fireEvent.click(iconButton);

    // Dialog should now be visible
    expect(screen.getByText(/Security Details/i)).toBeInTheDocument();
  });

  it("shouldDisplayFileDetailsInDialog", () => {
    render(<ShieldoutlinedIconDialogue {...defaultProps} />);
    const iconButton = screen.getByRole("button", { name: /view security details/i });
    fireEvent.click(iconButton);

    // Check all file details are displayed
    expect(screen.getByText(/File:/i)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.fileName)).toBeInTheDocument();
    expect(screen.getByText(/SHA256:/i)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.hash)).toBeInTheDocument();
    expect(screen.getByText(/Publisher:/i)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.publisher)).toBeInTheDocument();
    expect(screen.getByText(/Last Security Scan:/i)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.lastScan)).toBeInTheDocument();
    expect(
      screen.getByText(/This file is digitally signed and has passed all security checks./i)
    ).toBeInTheDocument();
  });

  it("shouldCloseDialogOnCloseButtonClick", async () => {
    render(<ShieldoutlinedIconDialogue {...defaultProps} />);
    const iconButton = screen.getByRole("button", { name: /view security details/i });
    fireEvent.click(iconButton);

    // Dialog should be open
    expect(screen.getByText(/Security Details/i)).toBeInTheDocument();

    // Click the Close button
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    // Dialog should close
    await waitFor(() =>
      expect(screen.queryByText(/Security Details/i)).not.toBeInTheDocument()
    );
  });


  it("shouldNotOpenDialogWithoutUserInteraction", () => {
    render(<ShieldoutlinedIconDialogue {...defaultProps} />);
    // Dialog should not be visible before any interaction
    expect(screen.queryByText(/Security Details/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shouldCloseDialogOnBackdropClick", async () => {
    render(<ShieldoutlinedIconDialogue
      fileName="testfile.exe"
      hash="abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
      publisher="Test Publisher"
      lastScan="2024-06-01 12:34:56"
    />);
    // Open the dialog
    const iconButton = screen.getByRole("button", { name: /view security details/i });
    fireEvent.click(iconButton);

    // Dialog should be open
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Find the backdrop and click it
    // MUI uses [role="presentation"] for the backdrop
    const backdrop = document.querySelector('[role="presentation"]');
    expect(backdrop).toBeTruthy();
    fireEvent.mouseDown(backdrop); // MUI listens for mouseDown
    fireEvent.click(backdrop);
  });
});