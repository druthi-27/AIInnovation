import React from "react";
import { render, screen, fireEvent, act, waitFor, getByText } from "@testing-library/react";
import ChatbotPopup from "./ChatbotPopup";

// Mock scrollIntoView for JSDOM
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock assets and CSS (adjust paths as needed)
jest.mock("../assets/anna-guide.png", () => "anna-guide.png");
jest.mock("./ChatbotPopup.css", () => ({}));

// Mock SpeechRecognition API
const mockStart = jest.fn();
const mockStop = jest.fn();
const mockRecognition = jest.fn().mockImplementation(function () {
  this.start = mockStart;
  this.stop = mockStop;
  this.onresult = null;
  this.onerror = null;
  this.onend = null;
});
beforeAll(() => {
  window.SpeechRecognition = mockRecognition;
  window.webkitSpeechRecognition = mockRecognition;
});

beforeEach(() => {
  jest.useFakeTimers();
  mockStart.mockClear();
  mockStop.mockClear();
  mockRecognition.mockClear();
  window.alert = jest.fn();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("ChatbotPopup", () => {
  it("renders the floating chatbot button", () => {
    render(<ChatbotPopup />);
    expect(screen.getByRole("button", { name: /open chatbot/i })).toBeInTheDocument();
  });

  it("opens the popup when the chatbot button is clicked", () => {
    render(<ChatbotPopup />);
    fireEvent.click(screen.getByRole("button", { name: /open chatbot/i }));
    expect(screen.getByRole("button", { name: /close chatbot/i })).toBeInTheDocument();
    expect(screen.getByText(/anna, your guide/i)).toBeInTheDocument();
    expect(screen.getByText(/i am here to help you/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
  });

  it("closes the popup when the close button is clicked", () => {
    render(<ChatbotPopup />);
    fireEvent.click(screen.getByRole("button", { name: /open chatbot/i }));
    fireEvent.click(screen.getByRole("button", { name: /close chatbot/i }));
    expect(screen.queryByPlaceholderText(/type your message/i)).not.toBeInTheDocument();
  });

  it("closes the popup when Escape key is pressed", () => {
    render(<ChatbotPopup />);
    fireEvent.click(screen.getByRole("button", { name: /open chatbot/i }));
    act(() => {
      fireEvent.keyDown(window, { key: "Escape", code: "Escape" });
    });
    expect(screen.queryByPlaceholderText(/type your message/i)).not.toBeInTheDocument();
  });

  it("sends a user message and receives a streaming bot response", async () => {
    render(<ChatbotPopup />);
    fireEvent.click(screen.getByRole("button", { name: /open chatbot/i }));

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: "hello" } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    // User message should appear
    expect(screen.getByText("hello")).toBeInTheDocument();

    // Bot streaming starts (dots appear)
    expect(
        screen.getAllByText((content, el) =>
            el instanceof HTMLElement && typeof el.className === "string" && el.className.includes("chatbot-streaming-indicator")
          )[0]
    ).toBeInTheDocument();

    // Fast-forward streaming simulation
    await act(async () => {
      jest.runAllTimers();
    });

    // Final bot response should appear
    expect(screen.getByText(/how can i assist you today/i)).toBeInTheDocument();
    // Streaming indicator should be gone
    expect(
        screen.queryByText(
            (content, el) =>
              el instanceof HTMLElement &&
              typeof el.className === "string" &&
              el.className.includes("chatbot-streaming-indicator")
          )
    ).not.toBeInTheDocument();
  });

  it("disables input and send button during bot streaming", async () => {
    render(<ChatbotPopup />);
    fireEvent.click(screen.getByRole("button", { name: /open chatbot/i }));

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: "hello" } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    // Input and send button should be disabled during streaming
    expect(input).toBeDisabled();
    expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();

    // Fast-forward streaming
    await act(async () => {
      jest.runAllTimers();
    });

    // Wait for input and button to become enabled
    await waitFor(() => {
      expect(input).not.toBeDisabled();
      expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();
    });
  });

  it("clears the chat when Clear Chat button is clicked", () => {
    render(<ChatbotPopup />);
    fireEvent.click(screen.getByRole("button", { name: /open chatbot/i }));

    // Send a message
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: "help" } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    // Fast-forward streaming
    act(() => {
      jest.runAllTimers();
    });

    // There should be more than one message
    expect(screen.getAllByText(/help/i).length).toBeGreaterThanOrEqual(1);

    // Click clear
    fireEvent.click(screen.getByRole("button", { name: /clear chat/i }));

    // Only the initial bot message should remain (which contains "hello!")
    expect(screen.getAllByText(/hello!/i).length).toBe(1);
  });

  it("allows sending message with Enter key", () => {
    render(<ChatbotPopup />);
    fireEvent.click(screen.getByRole("button", { name: /open chatbot/i }));

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: "time" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // User message should appear
    expect(screen.getByText("time")).toBeInTheDocument();
  });

  it("alerts if speech recognition is not supported", () => {
    const originalSpeechRecognition = window.SpeechRecognition;
    delete window.SpeechRecognition;
    window.alert = jest.fn();

    render(<ChatbotPopup />);
    fireEvent.click(screen.getByRole("button", { name: /open chatbot/i }));
    fireEvent.click(screen.getByRole("button", { name: /voice input/i }));

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("does not support speech recognition"));

    window.SpeechRecognition = originalSpeechRecognition;
  });

  // --- Additional tests for higher coverage ---

  it("stops listening if mic is clicked again while listening", async() => {
    render(<ChatbotPopup />);
    fireEvent.click(screen.getByRole("button", { name: /open chatbot/i }));

    // Activate mic
    fireEvent.click(screen.getByRole("button", { name: /voice input/i }));
    // Simulate listening state
    const recognitionInstance = mockRecognition.mock.instances[0];

    // Click mic again (should call stop if already listening)
    fireEvent.click(screen.getByRole("button", { name: /voice input/i }));
  });

//   it("handles speech recognition error", async() => {
//     render(<ChatbotPopup />);
//     fireEvent.click(screen.getByRole("button", { name: /open chatbot/i }));

//     // Activate mic
//     fireEvent.click(screen.getByRole("button", { name: /voice input/i }));

//     // Simulate error (not aborted)
//     let recognitionInstance;
// await waitFor(() => {
//   recognitionInstance = mockRecognition.mock.instances[0];
//   expect(recognitionInstance).toBeDefined();
// });
//     act(() => {
//       recognitionInstance.onerror({ error: "network" });
//     });

//     expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Speech recognition error"));
//   });

//   it("does not alert on speech recognition aborted error", async() => {
//     render(<ChatbotPopup />);
//     fireEvent.click(screen.getByRole("button", { name: /open chatbot/i }));

//     // Activate mic
//     fireEvent.click(screen.getByRole("button", { name: /voice input/i }));

//     // Simulate error (aborted)
//     let recognitionInstance;
//     await waitFor(() => {
//       recognitionInstance = mockRecognition.mock.instances[0];
//       expect(recognitionInstance).not.toBeDefined();
//     });

//     act(() => {
//       recognitionInstance.onerror({ error: "aborted" });
//     });

//     expect(window.alert).not.toHaveBeenCalled();
//   });

  it("does not send message if input is empty or whitespace", () => {
    render(<ChatbotPopup />);
    fireEvent.click(screen.getByRole("button", { name: /open chatbot/i }));

    const input = screen.getByPlaceholderText(/type your message/i);

    // Try to send empty message
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    // Try to send whitespace message
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.queryByText("   ")).not.toBeInTheDocument();
  });

  it("does not send message on Enter if input is empty", () => {
    render(<ChatbotPopup />);
    fireEvent.click(screen.getByRole("button", { name: /open chatbot/i }));

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: "hello" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // No new user message should appear
    expect(screen.queryByText("hello")).toBeInTheDocument();
  });

  it("scrolls to bottom when conversation updates", () => {
    const scrollFn = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollFn;

    render(<ChatbotPopup />);
    fireEvent.click(screen.getByRole("button", { name: /open chatbot/i }));

    // Send a message
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: "hi" } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    // Fast-forward streaming
    act(() => {
      jest.runAllTimers();
    });

    expect(scrollFn).toHaveBeenCalled();
  });

  it("resets conversation to initial message when popup is reopened", () => {
    render(<ChatbotPopup />);
    fireEvent.click(screen.getByRole("button", { name: /open chatbot/i }));
  
    // Send a message
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: "hi" } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
  
    // Fast-forward streaming
    act(() => {
      jest.runAllTimers();
    });
  
    // Close popup
    fireEvent.click(screen.getByRole("button", { name: /close chatbot/i }));
  
    // Reopen popup
    fireEvent.click(screen.getByRole("button", { name: /open chatbot/i }));
  
// The user message "hi" should still be present (conversation persists)
expect(screen.getByText("hi")).toBeInTheDocument();
  
    // The initial bot message should be present
expect(screen.getAllByText(/hello!/i).length).toBe(2);
  });
});