import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const SimpleCaptcha = forwardRef(({ onCaptchaChange }, ref) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(null);

  const generateQuestion = () => {
    const operations = ['+', '-'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2, result;
    
    if (operation === '+') {
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      result = num1 + num2;
    } else {
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * 10) + 1;
      result = num1 - num2;
    }
    
    setQuestion(`${num1} ${operation} ${num2} = ?`);
    setAnswer(result.toString());
    setUserInput('');
    setIsValid(null);
    onCaptchaChange(false);
  };

  useImperativeHandle(ref, () => ({
    refresh: generateQuestion,
  }));

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
    
    if (value === answer) {
      setIsValid(true);
      onCaptchaChange(true);
    } else if (value !== '' && value !== answer) {
      setIsValid(false);
      onCaptchaChange(false);
    } else {
      setIsValid(null);
      onCaptchaChange(false);
    }
  };

  return (
    <div className="simple-captcha-container">
      <div className="flex items-center space-x-3">
      
        <div className="flex-1">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-center">
            <p className="text-white text-lg font-mono">{question}</p>
          </div>
        </div>
        
     
        <div className="flex-1">
          <input
            type="number"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Answer"
            className={`w-full px-3 py-2 rounded-lg border text-center font-mono text-lg transition-all duration-300 ${
              isValid === true 
                ? 'border-green-400/50 bg-green-500/20 text-green-100' 
                : isValid === false 
                ? 'border-red-400/50 bg-red-500/20 text-red-100' 
                : 'border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/30'
            }`}
          />
        </div>
        
        <button
          onClick={generateQuestion}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20"
          title="New Question"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
  
      {isValid !== null && (
        <div className={`mt-2 text-sm text-center flex items-center justify-center gap-1 ${
          isValid ? 'text-green-400' : 'text-red-400'
        }`}>
          {isValid ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Correct!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Try again
            </>
          )}
        </div>
      )}
      
      <style jsx>{`
        .simple-captcha-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .simple-captcha-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
});

SimpleCaptcha.displayName = 'SimpleCaptcha';

export default SimpleCaptcha;



























