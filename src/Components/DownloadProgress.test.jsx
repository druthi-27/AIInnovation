import React from "react";
import { render, waitFor, screen, fireEvent, act } from "@testing-library/react";
import DownloadProgress from "../Components/DownloadProgress";
import { adminDownloadLink, nonAdminDownloadLink } from "../Constants/Const";

// Helper to advance timers and flush intervals
const advanceTimers = async (ms = 500) => {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
};

describe("DownloadProgress Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should_start_download_and_show_progress", async () => {
    render(<DownloadProgress installType="Admin" />);
    const downloadButton = screen.getByTestId("download-button");
    expect(downloadButton).toBeEnabled();

    fireEvent.click(downloadButton);

    // Button should now show 'Downloading...' and be disabled
    expect(downloadButton).toHaveAttribute("aria-disabled", "true");

    // Progress bar should appear
    expect(await screen.findByTestId("download-progress")).toBeInTheDocument();

    // Simulate some progress
    await advanceTimers(1000);

    // Progress, speed, and ETA should be visible and not initial values
    expect(screen.getByText(/%/)).toBeInTheDocument();
    expect(screen.getByText(/Speed:/)).toBeInTheDocument();
    expect(screen.getByText(/ETA:/)).toBeInTheDocument();
  });

  it("should_enable_download_button_for_valid_install_type", () => {
    render(<DownloadProgress installType="Non-Admin" />);
    const downloadButton = screen.getByTestId("download-button");
    expect(downloadButton).toBeEnabled();
    expect(downloadButton).toHaveAttribute("href", nonAdminDownloadLink);

    render(<DownloadProgress installType="Admin" />);
    expect(downloadButton).toBeEnabled();
  });

  it("should_cancel_download_and_reset_state", async () => {
    render(<DownloadProgress installType="Admin" />);
    const downloadButton = screen.getByTestId("download-button");
    expect(downloadButton).toBeInTheDocument();
    fireEvent.click(downloadButton);

    // Wait for progress UI
    const progressBox = await screen.findByTestId("download-progress");
    expect(progressBox).toBeInTheDocument();

    // Cancel button should be present
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    // Wait for progress UI to disappear and button to reset
    await waitFor(() =>
      expect(screen.queryByTestId("download-progress")).not.toBeInTheDocument()
    );
    expect(screen.getByTestId("download-button")).toBeEnabled();
  });

  it("should_disable_download_button_while_downloading", async () => {
    render(<DownloadProgress installType="Admin" />);
    const downloadButton = screen.getByTestId("download-button");
    fireEvent.click(downloadButton);

    // Button should be disabled during download
    expect(downloadButton).toHaveAttribute("aria-disabled", "true");

    // Try clicking again, should not trigger another download
    fireEvent.click(screen.getByRole("button", { name: "Downloading..." }));
    // Still only one progress bar
    expect(screen.getAllByTestId("download-progress").length).toBe(1);
  });

  it("should_handle_invalid_install_type_gracefully", () => {
    render(<DownloadProgress installType="UnknownType" />);
    const downloadButton = screen.getByTestId("download-button");
    expect(downloadButton).toBeDisabled();
    expect(downloadButton).not.toHaveAttribute("href");
  });

  it("should_handle_instant_or_minimal_download_completion", async () => {
    // Patch Math.random to always return max chunk for instant download
    const originalRandom = Math.random;
    Math.random = () => 1;

    render(<DownloadProgress installType="Admin" />);
    const downloadButton = screen.getByTestId("download-button");
    fireEvent.click(downloadButton);

    // Simulate enough time for instant completion
    await advanceTimers(5000);

    // Wait for download to finish and reset
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    // Progress UI should disappear and button should reset
    expect(downloadButton).toBeEnabled();

    Math.random = originalRandom;
  });
});