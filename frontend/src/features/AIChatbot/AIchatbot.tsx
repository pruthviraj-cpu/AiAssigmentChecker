import Header from '../../shared/components/header/Header';
import PageList from '../../shared/components/sidebar/PageList';
import { useState, useEffect } from 'react';
import useManualFetch from '../../shared/hooks/useManualFetch';

interface Message {
  content: string;
  sender: 'user' | 'bot';
}

interface BotApiResponse {
  response?: {
    content?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

const AIchatbot = () => {
  const { execute, data, status, error } = useManualFetch<BotApiResponse>();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = { content: inputMessage, sender: 'user' };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage('');

    // fire request (but don’t handle response here)
    await execute(`http://localhost:80/python_api/teacherChatBottest`, 'POST', {
      message: inputMessage,
    });
  };

  // 🔥 Whenever status/data changes, add bot message
  useEffect(() => {
    if (status === 'success' && data) {
      console.log('API Response:', data);
      const botContent =
        data.response?.content ??
        "error displaying response";

      setMessages((prev) => [...prev, { content: botContent, sender: 'bot' }]);
    }

    if (status === 'error') {
      setMessages((prev) => [
        ...prev,
        { content: `Error: ${error?.message || 'Failed to get response.'}`, sender: 'bot' },
      ]);
    }
  }, [status, data, error]);

  return (
    <div>
      <Header />
      <div className="flex">
        <PageList />
        <div className="relative w-full bg-gray-100 flex flex-col items-center justify-between">
          {/* Chat messages */}
          <div className="flex-grow w-full max-w-4xl mx-auto p-4 overflow-y-scroll h-[500px] ">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 my-2 rounded-lg max-w-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-gray-300 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {/* Loader */}
            {status === 'loading' && (
              <div className="p-3 my-2 rounded-lg max-w-xs bg-gray-300 text-gray-800">
                <span className="animate-pulse">Typing...</span>
              </div>
            )}
          </div>

          {/* Input box */}
          <div className="w-full max-w-4xl mx-auto p-4 mb-[100px]">
            <div className="relative">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                type="text"
                placeholder="Ask Anything"
                className="w-full rounded-full px-8 py-4 pr-24 text-lg focus:outline-none focus:ring-2 focus:ring-blue-700 border border-gray-300"
                disabled={status === 'loading'}
              />
              <button
                onClick={handleSend}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full px-6 py-3 font-semibold hover:bg-blue-700 transition"
                disabled={status === 'loading'}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIchatbot;