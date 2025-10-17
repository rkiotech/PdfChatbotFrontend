"use client"
import { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";

interface Message {
  role: "user" | "bot";
  text: string;
}

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hello! Upload a file and ask me anything." }
  ]);
  const [input, setInput] = useState<string>("");
  const [botResponse, setBotResponse] = useState<string>("");
const sendData = async (query: any) => {
  const newmessage: Message = { role: "user", text: query };
  const response = await fetch("http://localhost:5000/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({user_input: query}),
  });
  // console.log("response");
  const result = await response.json();
  setMessages([...messages, newmessage]);
  setBotResponse(result.response);
  return result;
  // console.log(result);
};
// useEffect(() => {
//   const fetchMessages = async () => {
//     const res = await fetch("http://localhost:5000/llm");
//     const data = await res.json();
//     console.log(data);
//     setMessages(data);
//   };

//   fetchMessages();
// }, []);
  const sendMessage = async () => {
    if (input.trim() === "") return;
    setMessages([...messages, { role: "user", text: input }]);
    let data:any=await sendData(input);
    setInput("");
    console.log("data",data);

    await new Promise((resolve) => {
      let interval=    setInterval( () => {
      if(data)
      {
      setMessages(prev => [
        ...prev,
        { role: "bot", text: data.response }

      ]);
      resolve(true);
      clearInterval(interval);
    }
    // setInput("");

    }, 1000);
    
    });
    // Simulate bot response

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
        <h2 className="text-xl font-bold mb-6">📂 Upload Files</h2>
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
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
