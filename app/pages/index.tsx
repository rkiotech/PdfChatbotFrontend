"use client"
import { useState, ChangeEvent, KeyboardEvent, useEffect, useRef, use} from "react";

interface Message {
  type: "human" | "ai";
  content: string;
}

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([
    { type: "ai", content: "Hello! Upload a file and ask me anything." }
  ])
  let chatEndRef=useRef<HTMLDivElement>(null);
  const [input, setInput] = useState<string>("");

  const [botResponse, setBotResponse] = useState<string>("");
const fetchLastMessage=async()=>{
      const response = await fetch("http://localhost:8000/load_conversation/1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({id:"1"}),
  });
  // console.log("response");
  const result = await response.json();
  setMessages(result);
  console.log("Messages loaded", result);
}
useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  fetchLastMessage();

}, []);
  const [showPrompt, setShowPrompt] = useState(false);
  const [aprrove, setAprrove] = useState(0);
  const [loading, setLoading] = useState(false)
 const triggerPrompt = () => {
    setShowPrompt(true);
  };

  // ✅ Function for API calls
  const handleResponse = async (isApproved:boolean) => {
    setLoading(true);
    setShowPrompt(false);
    if (isApproved) {
      setAprrove(aprrove + 1);
    }
    else
    {
      setAprrove(aprrove - 1);
    }
    try {
      const url = isApproved ? "http://localhost:8000/approved/1" : "http://localhost:8000/decline/1"; // Change to your real endpoints
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id:"1"}),
      });

      const data = await res.json();
      setMessages([...messages, data.messages]);
      console.log("API Response:", data);
      alert(isApproved ? "✅ Approved!" : "❌ Rejected!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

const sendData = async (query: any) => {
  // const newmessage: Message = { role: "user", text: query };
  const response = await fetch("http://localhost:8000/invoke/1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({user_input: query,id:"1"}),
  });
  // console.log("response");
  const result = await response.json();
  // console.log("response",result.messages);
  
  // setBotResponse(result.response);
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
    let userInput=input
    setInput("");
    setMessages([...messages, { type: "human", content: userInput }]);
    let data:any=await sendData(userInput);
    if (data?.status==="approval_required")
    {
       setShowPrompt(true);
    // await new Promise((resolve) => {
    //   let interval=    setInterval( () => {

        

    //   if (aprrove !==0 && showPrompt===false)

    //   {resolve(true);
    //     setAprrove(0)
    //   }
    //   clearInterval(interval);
    
    // // setInput("");

    // }, 1000);
    
    // });
    // Si

  }

    // setMessages([...messages,data.messages]);
    
    // console.log("data",data.messages);

    await new Promise((resolve) => {
      let interval=    setInterval( () => {
      if(data)
      {
        
      // setMessages(prev => [
      //   ...prev,
      //   data.messages

      // ]);
      if (aprrove !==0 && showPrompt===false)

      {resolve(true);
        setAprrove(0)
      }
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
                msg.type === "human" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs text-white ${
                  msg.type === "human" ? "bg-blue-500" : "bg-green-500"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
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
            {/* ✅ Approval Prompt Modal */}
            
      {showPrompt && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <h2 className="text-xl font-semibold mb-6">
              Do you approve this action?
            </h2>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => handleResponse(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                disabled={loading}
              >
                Yes
              </button>
              <button
                onClick={() => handleResponse(false)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                disabled={loading}
              >
                No
              </button>
            </div>
          </div>
          </div>
        )
      }
    </div>
    
  );
}
