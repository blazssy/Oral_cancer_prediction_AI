import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function WellnessAgent({ prediction, patientData }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Generate initial AI recommendation when component mounts
    if (prediction && patientData) {
      generateInitialRecommendation();
    }
  }, [prediction, patientData]);

  const generateInitialRecommendation = async () => {
    setIsTyping(true);
    
    const prompt = `You are a compassionate medical AI assistant specializing in oral health. 
    
Patient Information:
- Condition: ${prediction.predicted_class}
- Confidence: ${(prediction.confidence_score * 100).toFixed(1)}%
- Age: ${patientData.age} years
- Gender: ${patientData.gender}
- Tobacco Use: ${patientData.tobaccoUse}

Provide a brief, empathetic, and actionable health recommendation (3-4 sentences). Include:
1. What this condition means
2. Immediate steps they should take
3. Lifestyle modifications

Keep it concise, supportive, and professional.`;

    try {
      const response = await fetch('http://localhost:8000/api/gemini-chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setMessages([
        {
          type: 'ai',
          text: data.response || 'Hello! I\'m here to help you understand your results and provide personalized health guidance.',
          timestamp: new Date(),
        }
      ]);
    } catch (error) {
      console.error('Error generating recommendation:', error);
      setMessages([
        {
          type: 'ai',
          text: `Based on your diagnosis of ${prediction.predicted_class}, I recommend consulting with an oral health specialist for a comprehensive evaluation. In the meantime, maintain good oral hygiene and avoid risk factors like tobacco use.`,
          timestamp: new Date(),
        }
      ]);
    }
    
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      type: 'user',
      text: userInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setIsTyping(true);

    const conversationContext = `Patient has ${prediction.predicted_class} with ${(prediction.confidence_score * 100).toFixed(1)}% confidence. Age: ${patientData.age}, Gender: ${patientData.gender}, Tobacco: ${patientData.tobaccoUse}.

Previous conversation:
${messages.map(m => `${m.type === 'user' ? 'Patient' : 'AI'}: ${m.text}`).join('\n')}

Patient's question: ${userInput}

Provide a helpful, medically accurate response (2-3 sentences).`;

    try {
      const response = await fetch('http://localhost:8000/api/gemini-chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: conversationContext }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage = {
        type: 'ai',
        text: data.response || 'I apologize, but I\'m having trouble generating a response. Please consult with a healthcare professional.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'ai',
        text: 'I apologize for the inconvenience. Please try again or consult with a healthcare professional.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="wellness-agent-container">
      <h2>🤖 AI Health Assistant</h2>
      <div className="chat-interface">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <motion.div 
              key={index}
              className={`chat-bubble ${msg.type}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.text}
            </motion.div>
          ))}
          
          {isTyping && (
            <div className="chat-bubble ai typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask me about your condition, treatment, or prevention..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button 
            className="chat-send-button"
            onClick={handleSendMessage}
            disabled={isLoading || !userInput.trim()}
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WellnessAgent;
