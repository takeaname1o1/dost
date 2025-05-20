import React from "react";
import { useLocation } from "wouter";

const HelpSupport: React.FC = () => {
  const [, setLocation] = useLocation();

  const navigateBack = () => {
    setLocation("/profile");
  };

  const faqs = [
    {
      question: "How do I make calls?",
      answer: "To make a call, go to the home screen, browse the list of companions and tap on the audio or video call button on their profile."
    },
    {
      question: "How much do calls cost?",
      answer: "Audio calls cost 10 coins per minute, while video calls cost 60 coins per minute. Coins are deducted in real-time during the call."
    },
    {
      question: "How do I recharge my coins?",
      answer: "Tap on your coin balance or the '+' button next to it to open the recharge screen. Select a package and follow the payment instructions."
    },
    {
      question: "What happens if I run out of coins during a call?",
      answer: "The call will be automatically terminated when your coin balance reaches zero. Make sure to recharge before making long calls."
    },
    {
      question: "What is a Random Call?",
      answer: "Random Call connects you with an available companion randomly. It's a great way to meet different companions on the platform."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take privacy seriously. Your personal information is encrypted and stored securely. We never share your data with third parties without your consent."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--background))]">
      <header className="bg-[hsl(var(--card))] p-4 flex items-center sticky top-0 z-10">
        <button 
          className="mr-3"
          onClick={navigateBack}
        >
          <i className="ri-arrow-left-line text-xl text-white"></i>
        </button>
        <h1 className="text-2xl font-bold text-white">Help & Support</h1>
      </header>
      
      <main className="flex-1 overflow-auto p-4 bg-[hsl(var(--background))]">
        <div className="bg-[hsl(var(--card))] rounded-xl p-4 mb-4">
          <h2 className="text-white text-lg font-semibold mb-2">Contact Support</h2>
          <p className="text-[hsl(var(--text-secondary))] mb-3">We're here to help you with any questions or issues.</p>
          <a 
            href="mailto:support@dostt.com" 
            className="block bg-[hsl(var(--primary))] text-black text-center py-2 rounded-lg font-medium"
          >
            Email Support
          </a>
        </div>
        
        <div className="bg-[hsl(var(--card))] rounded-xl p-4 mb-6">
          <h2 className="text-white text-lg font-semibold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`${index < faqs.length - 1 ? 'border-b border-gray-700 pb-3' : ''}`}
              >
                <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                <p className="text-[hsl(var(--text-secondary))] text-sm">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpSupport;
