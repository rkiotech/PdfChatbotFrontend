"use client"
import { useState, ChangeEvent, KeyboardEvent } from "react";

interface Message {
  role: "user" | "bot";
  text: string;
}

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hello! Upload a file and ask me anything." }
  ]);
  const [input, setInput] = useState<string>("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { role: "user", text: input }]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "Processing your query..." }
      ]);
    }, 1000);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`File uploaded: ${file.name}`);
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">📂 Upload File</h2>
        <input
          type="file"
          className="border border-gray-300 rounded-lg p-2"
          onChange={handleFileUpload}
        />
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-md p-4 text-lg font-semibold">
          📢 Chatbot
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs text-white ${
                  msg.role === "user" ? "bg-blue-500" : "bg-green-500"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white flex">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            className="ml-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
