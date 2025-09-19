import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faTimes, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function ChatGPTBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you with your reading today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch ("http://localhost:5001/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
       if (res.status === 429) {
      setMessages([...newMessages, { role: "assistant", content: data.error }]);
    } else {
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    }
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I couldn't get a response." }]);
    }
    setLoading(false);
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 bg-[#7f2323] text-[#EAD298] p-4 rounded-full shadow-lg  z-[9999]"
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
      >
        <FontAwesomeIcon icon={open ? faTimes : faComments} size="lg" />
      </button>
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-2xl p-4 z-[9999] flex flex-col">
          <h3 className="font-bold text-[#7f2323] mb-2">ChatGPT</h3>
          <div className="flex-1 overflow-y-auto mb-2 max-h-60">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 p-2 rounded-lg shadow text-sm ${
                  msg.role === "user"
                    ? "bg-[#7f2323] text-[#EAD298] self-end"
                    : "bg-[#EAD298] text-[#7f2323] self-start"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="mb-2 p-2 rounded-lg shadow text-sm bg-[#EAD298] text-[#7f2323] self-start">
                Typing...
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-lg px-2 py-1"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className="bg-[#7f2323] text-[#EAD298] px-3 py-2 rounded-lg"
              disabled={loading}
              aria-label="Send"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}