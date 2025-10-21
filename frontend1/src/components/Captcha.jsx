import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';

const Captcha = forwardRef(({ onCaptchaChange }, ref) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(null);

  const generateCaptcha = () => {
   
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput('');
    setIsValid(null);
    return result;
  };

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(0.5, '#334155');
    gradient.addColorStop(1, '#475569');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

   
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

 
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

 
    for (let i = 0; i < text.length; i++) {
      ctx.save();
      const x = (canvas.width / text.length) * i + canvas.width / text.length / 2;
      const y = canvas.height / 2;
      
   
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      
      const colors = ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa'];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.3);
      ctx.fillText(text[i], 0, (Math.random() - 0.5) * 8);
      ctx.restore();
    }

  
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * canvas.height);
      ctx.bezierCurveTo(
        Math.random() * canvas.width / 2, Math.random() * canvas.height,
        Math.random() * canvas.width / 2 + canvas.width / 2, Math.random() * canvas.height,
        canvas.width, Math.random() * canvas.height
      );
      ctx.stroke();
    }
  };

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    drawCaptcha(newCaptcha);
    onCaptchaChange(false); 
  };

  useImperativeHandle(ref, () => ({
    refresh: refreshCaptcha,
  }));

  useEffect(() => {
    refreshCaptcha();
  }, []);

  useEffect(() => {
    drawCaptcha(captchaText);
  }, [captchaText]);

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setUserInput(value);
    if (value.length === 5) {
      const valid = value === captchaText;
      setIsValid(valid);
      onCaptchaChange(valid);
    } else {
      setIsValid(null);
      onCaptchaChange(false);
    }
  };

  return (
    <div ref={containerRef} className="captcha-container">
      <div className="flex flex-col items-center space-y-3">
       
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={280}
            height={80}
            className="border-2 border-white/30 rounded-lg cursor-pointer transition-all duration-300 hover:border-cyan-400/50 hover:shadow-lg"
            onClick={refreshCaptcha}
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}
          />
          
         
          <button
            onClick={refreshCaptcha}
            className="absolute top-2 right-2 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30"
            title="Refresh Captcha"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

       
        <div className="flex-1 w-full">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Enter 5 characters"
            maxLength={5}
            className={`w-full px-3 py-2 rounded-lg border text-center font-mono tracking-widest text-white placeholder-white/50 transition-all duration-300 ${
              isValid === true 
                ? 'border-green-400/50 bg-green-500/20 text-green-100' 
                : isValid === false 
                ? 'border-red-400/50 bg-red-500/20 text-red-100' 
                : 'border-white/20 bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/50'
            }`}
          />
          
         
          {isValid !== null && (
            <div className={`mt-2 text-sm text-center flex items-center justify-center gap-1 ${
              isValid ? 'text-green-400' : 'text-red-400'
            }`}>
              {isValid ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified!
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
        </div>
      </div>

     
      <p className="text-xs text-white/60 text-center mt-2">Click to refresh • Case insensitive</p>

      <style jsx>{`
        .captcha-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          min-width: 300px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .captcha-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
});

Captcha.displayName = 'Captcha';

export default Captcha;

