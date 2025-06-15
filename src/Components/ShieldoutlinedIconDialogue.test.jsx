import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShieldoutlinedIconDialogue from "./ShieldoutlinedIconDialogue";

// Mock MUI icons to avoid unnecessary rendering complexity
jest.mock("@mui/icons-material/ShieldOutlined", () => () => <span data-testid="shield-icon" />);
jest.mock("@mui/icons-material/CheckCircleOutline", () => () => <span data-testid="check-icon" />);

const mockFileData = {
  fileName: "example.exe",
  md5CheckSum: "abc123def456",
  sha256CheckSum: "789ghi012jkl345mno678pqr901stu234vwx567yz890",
  publisher: "Acme Corp",
  releaseDate: "2024-06-01T12:34:56Z"
};

describe("ShieldoutlinedIconDialogue", () => {
  it("renders nothing if fileData is not provided", () => {
    const { container } = render(<ShieldoutlinedIconDialogue />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the shield icon button with tooltip", () => {
    render(<ShieldoutlinedIconDialogue fileData={mockFileData} />);
    // The icon button should be present
    expect(screen.getByRole("button")).toBeInTheDocument();
    // Tooltip text is present in the DOM only on hover, but the button is present
    expect(screen.getByTestId("shield-icon")).toBeInTheDocument();
  });

  it("opens the dialog with correct details when icon button is clicked", () => {
    render(<ShieldoutlinedIconDialogue fileData={mockFileData} />);
    // Dialog should not be visible initially
    expect(screen.queryByText(/security details/i)).not.toBeInTheDocument();

    // Open dialog
    fireEvent.click(screen.getByRole("button"));

    // Dialog title
    expect(screen.getByText(/security details/i)).toBeInTheDocument();

    // File details
    expect(screen.getByText(/file:/i)).toBeInTheDocument();
    expect(screen.getByText(mockFileData.fileName)).toBeInTheDocument();
    expect(screen.getByText(/md5:/i)).toBeInTheDocument();
    expect(screen.getByText(mockFileData.md5CheckSum)).toBeInTheDocument();
    expect(screen.getByText(/sha256:/i)).toBeInTheDocument();
    expect(screen.getByText(mockFileData.sha256CheckSum)).toBeInTheDocument();
    expect(screen.getByText(/publisher:/i)).toBeInTheDocument();
    expect(screen.getByText(mockFileData.publisher)).toBeInTheDocument();
    expect(screen.getByText(/release date:/i)).toBeInTheDocument();
    // Check formatted date
    expect(screen.getByText(new Date(mockFileData.releaseDate).toLocaleString())).toBeInTheDocument();

    // Security check message and icon
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    expect(
      screen.getByText(/digitally signed and has passed all security checks/i)
    ).toBeInTheDocument();
  });

  it("closes the dialog when Close button is clicked", async () => {
    render(<ShieldoutlinedIconDialogue fileData={mockFileData} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText(/security details/i)).toBeInTheDocument();
  
    // Click Close button
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
  
    // Wait for the dialog to be removed
    await waitFor(() => {
      expect(screen.queryByText(/security details/i)).not.toBeInTheDocument();
    });
  });
  
  it("dialog can be closed by pressing Escape key (onClose)", async () => {
    render(<ShieldoutlinedIconDialogue fileData={mockFileData} />);
    fireEvent.click(screen.getByRole("button"));
    // Ensure dialog is open
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // Fire Escape key event on the dialog element
    fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });

    // Wait for the dialog to be removed
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});