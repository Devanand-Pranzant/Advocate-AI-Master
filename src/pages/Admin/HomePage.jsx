// homepage.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';

const Homepage = () => {
  const [chatWindowOpen, setChatWindowOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [allowOnlineSearch, setAllowOnlineSearch] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(-1);
  const [highlights, setHighlights] = useState([]);
  const [faqOpenStates, setFaqOpenStates] = useState([true, false, false, false, false, false]);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const chatBodyRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const carouselIntervalRef = useRef(null);

  // Carousel data
  const carouselSlides = [
    {
      img: "/src/assets/Images/index/image/carousel-2.jpg",
      title: "Revolutionizing Law with AI",
      description: "Transforming legal practice through advanced AI technologies that enhance efficiency, accuracy, and accessibility.",
      buttonText: "Register",
      buttonLink: "Login_registration.php"
    },
    {
      img: "/src/assets/Images/index/image/carousel-3.jpg",
      title: "Modernizing Law with AI",
      description: "Digital Document Management, ChatBot Assistance, and Advanced Document Analysis.",
      buttonText: "Register",
      buttonLink: "Login_registration.php"
    },
    {
      img: "/src/assets/Images/index/image/carousel-1.jpg",
      title: "AI-Driven Legal Solutions",
      description: "Our AI-driven platform offers a suite of tools designed to enhance efficiency and accuracy in legal work",
      buttonText: "Explore",
      buttonLink: "faq.html"
    }
  ];

  // Carousel auto-play
  useEffect(() => {
    startCarousel();
    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, []);

  const startCarousel = () => {
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
    }
    carouselIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    startCarousel();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    startCarousel();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    startCarousel();
  };

  // Back to top button handler
  useEffect(() => {
    const handleScroll = () => {
      const backToTop = document.querySelector('.back-to-top');
      if (backToTop) {
        if (window.scrollY > 200) {
          backToTop.classList.remove('hidden');
        } else {
          backToTop.classList.add('hidden');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clean up media stream
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Google Analytics
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-0RRRD2PCYY';
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-0RRRD2PCYY');
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleChat = () => {
    setChatWindowOpen(!chatWindowOpen);
    if (chatWindowOpen) {
      setSearchBarOpen(false);
      setMenuDropdownOpen(false);
      setSearchTerm('');
      resetSearch();
    }
  };

  const closeChat = () => {
    setChatWindowOpen(false);
    setSearchBarOpen(false);
    setMenuDropdownOpen(false);
    setSearchTerm('');
    resetSearch();
  };

  const toggleFaq = (index) => {
    const newFaqOpenStates = [...faqOpenStates];
    newFaqOpenStates[index] = !newFaqOpenStates[index];
    setFaqOpenStates(newFaqOpenStates);
  };

  const base64ToBlob = (base64, contentType) => {
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: contentType });
    } catch (error) {
      console.error('Base64 to blob conversion error:', error);
      return null;
    }
  };

  const sendTextToAPI = async (message) => {
    try {
      const payload = {
        query: message,
        language: language,
        allow_online_search: allowOnlineSearch
      };
      console.log("Text Payload", payload);
      
      const response = await fetch('http://192.168.1.56:8004/voice/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      
      const data = await response.json();
      console.log('Text API response:', data);
      
      const answerText = language === 'en' ? data.answer_english : data.answer_translated;
      
      if (answerText) {
        appendMessage('AI Assistant', answerText);
      } else {
        appendMessage('AI Assistant', 'No valid text response provided.');
      }
      
      if (data.audio_url_english) {
        try {
          const audioBlob = base64ToBlob(data.audio_url_english, 'audio/webm');
          if (audioBlob) {
            const audioUrl = URL.createObjectURL(audioBlob);
            appendAudioMessage('AI Assistant', audioUrl, answerText);
          }
        } catch (error) {
          console.error('Audio conversion error:', error);
          appendMessage('AI Assistant', 'Error processing audio response.');
        }
      }
    } catch (error) {
      console.error('Text API error:', error);
      appendMessage('AI Assistant', 'Error connecting to the server. Please try again.');
    }
  };

  const convertToWav = async (blob) => {
    return new Promise((resolve, reject) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      const fileReader = new FileReader();
      
      fileReader.onload = async () => {
        try {
          const arrayBuffer = fileReader.result;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const numberOfChannels = 1;
          const sampleRate = 16000;
          const length = audioBuffer.length;
          const wavBuffer = new ArrayBuffer(44 + length * 2);
          const view = new DataView(wavBuffer);
          
          const writeString = (view, offset, string) => {
            for (let i = 0; i < string.length; i++) {
              view.setUint8(offset + i, string.charCodeAt(i));
            }
          };
          
          writeString(view, 0, 'RIFF');
          view.setUint32(4, 36 + length * 2, true);
          writeString(view, 8, 'WAVE');
          writeString(view, 12, 'fmt ');
          view.setUint32(16, 16, true);
          view.setUint16(20, 1, true);
          view.setUint16(22, numberOfChannels, true);
          view.setUint32(24, sampleRate, true);
          view.setUint32(28, sampleRate * 2 * numberOfChannels, true);
          view.setUint16(32, 2 * numberOfChannels, true);
          view.setUint16(34, 16, true);
          writeString(view, 36, 'data');
          view.setUint32(40, length * 2, true);
          
          const channelData = audioBuffer.getChannelData(0);
          let offset = 44;
          for (let i = 0; i < length; i++, offset += 2) {
            const sample = Math.max(-1, Math.min(1, channelData[i]));
            view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
          }
          
          resolve(new Blob([view], { type: 'audio/wav' }));
        } catch (error) {
          reject(new Error('WAV conversion failed: ' + error.message));
        } finally {
          audioContext.close();
        }
      };
      
      fileReader.onerror = () => reject(new Error('FileReader error'));
      fileReader.readAsArrayBuffer(blob);
    });
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error('Base64 conversion failed'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const sendAudioToAPI = async (base64Audio, lang) => {
    try {
      const payload = {
        audio_base64: base64Audio,
        language: lang,
        allow_online_search: allowOnlineSearch
      };
      
      const response = await fetch('http://192.168.1.56:8004/voice/audio-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      
      const data = await response.json();
      console.log('Audio API response:', data);
      
      if (data.status === 'speech_recognition_failed') {
        appendMessage('AI Assistant', 'Speech recognition failed. Please speak clearly and ensure your microphone is working.');
      } else {
        const answerText = lang === 'en' ? data.answer_english : data.answer_translated;
        if (data.audio_url_english) {
          const audioBlob = base64ToBlob(data.audio_url_english, 'audio/webm');
          if (audioBlob) {
            const audioUrl = URL.createObjectURL(audioBlob);
            appendAudioMessage('AI Assistant', audioUrl, answerText);
          }
        } else if (answerText) {
          appendMessage('AI Assistant', answerText);
        }
      }
    } catch (error) {
      console.error('Audio API error:', error.message);
      appendMessage('AI Assistant', `Error: ${error.message}`);
    }
  };

  const startRecording = async () => {
    try {
      if (!mediaStreamRef.current) {
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ 
          audio: { 
            sampleRate: 16000, 
            channelCount: 1, 
            echoCancellation: true, 
            noiseSuppression: true 
          } 
        });
      }
      
      mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current, { mimeType: 'audio/webm;codecs=opus' });
      audioChunksRef.current = [];
      const startTime = Date.now();
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0 && isRecording) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const duration = (Date.now() - startTime) / 1000;
        
        if (audioChunksRef.current.length > 0 && !isRecording && duration >= 3) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
          
          if (audioBlob.size > 1000) {
            try {
              const audioUrl = URL.createObjectURL(audioBlob);
              appendAudioMessage('User', audioUrl);
              const wavBlob = await convertToWav(audioBlob);
              const base64Audio = await blobToBase64(wavBlob);
              await sendAudioToAPI(base64Audio, language);
            } catch (error) {
              appendMessage('AI Assistant', 'Error processing audio: ' + error.message);
            }
          } else {
            appendMessage('AI Assistant', 'Audio is too short or silent. Please speak clearly for at least 3 seconds.');
          }
        } else if (duration < 3) {
          appendMessage('AI Assistant', 'Recording is too short. Please record for at least 3 seconds.');
        }
        
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
        }
        mediaRecorderRef.current = null;
        audioChunksRef.current = [];
      };
      
      mediaRecorderRef.current.start(100);
    } catch (error) {
      console.error('Recording error:', error);
      appendMessage('AI Assistant', 'Error starting audio recording: ' + error.message);
      setIsRecording(false);
    }
  };

  const stopRecording = useCallback((cancelled = false) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const appendMessage = (sender, message) => {
    setChatMessages(prev => [...prev, { 
      id: Date.now(), 
      sender, 
      message, 
      type: 'text' 
    }]);
    
    setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, 100);
  };

  const appendAudioMessage = (sender, audioUrl, text = '') => {
    setChatMessages(prev => [...prev, { 
      id: Date.now(), 
      sender, 
      audioUrl, 
      text, 
      type: 'audio' 
    }]);
    
    setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, 100);
  };

  const checkMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 48000, channelCount: 1 } });
      mediaStreamRef.current = stream;
      return true;
    } catch (error) {
      appendMessage('AI Assistant', 'Microphone access is denied. Please allow microphone access.');
      return false;
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = chatInput.trim();
    if (message) {
      appendMessage('User', message);
      sendTextToAPI(message);
      setChatInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const message = chatInput.trim();
      if (message) {
        appendMessage('User', message);
        sendTextToAPI(message);
        setChatInput('');
      }
    }
  };

  const handleMicMouseDown = async () => {
    if (!isRecording) {
      const hasPermission = await checkMicPermission();
      if (hasPermission) {
        setIsRecording(true);
        await startRecording();
      }
    }
  };

  const handleMicMouseUp = () => {
    if (isRecording) {
      setIsRecording(false);
      stopRecording();
    }
  };

  const handleCancelRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      audioChunksRef.current = [];
      stopRecording(true);
    }
  };

  const resetSearch = () => {
    setCurrentHighlightIndex(-1);
    setHighlights([]);
  };

  const faqData = [
    {
      q: "What is Advocate AI Master's primary mission?",
      a: "Advocate AI Master's primary mission is to empower legal professionals by providing a platform that integrates seamlessly into their practice. The goal is to simplify case management, client handling, and document organization through cutting-edge AI tools, making the legal industry more efficient, accurate, and accessible."
    },
    {
      q: "How does Our AI's Client Management feature benefit legally?",
      a: "The Client Management feature allows legal professionals to easily manage and access client information, helping them track and update client details efficiently. This tool streamlines the management of the entire client database, ensuring organized and effective client handling."
    },
    {
      q: "What role does the Indian Laws Chatbot play in legal research?",
      a: "The Indian Laws Chatbot is an AI-powered tool that provides instant answers to legal queries related to Indian laws. It simplifies legal research by allowing professionals to ask questions directly to the chatbot, offering quick and accurate responses that save time and effort."
    },
    {
      q: "How can the Document Translator feature assist legal professionals?",
      a: "The Document Translator feature enables legal professionals to translate legal documents into multiple languages with ease. This tool helps break language barriers, ensuring clear communication with clients and colleagues, regardless of the language in which the original documents are written."
    },
    {
      q: "What role does the Indian Laws Chatbot play in legal research?",
      a: "The Indian Laws Chatbot is an AI-powered tool that provides instant answers to legal queries related to Indian laws. It simplifies legal research by allowing professionals to ask questions directly to the chatbot, offering quick and accurate responses that save time and effort."
    },
    {
      q: "How can the Document Translator feature assist legal professionals?",
      a: "The Document Translator feature enables legal professionals to translate legal documents into multiple languages with ease. This tool helps break language barriers, ensuring clear communication with clients and colleagues, regardless of the language in which the original documents are written."
    }
  ];

  const featuresData = [
    { img: "/src/assets/Images/index/image/client-management.jpeg", title: "Client Management", desc: "Easily manage and access your clients' information. The Clients section allows you to track and update client details efficiently. Manage your entire client database effectively." },
    { img: "/src/assets/Images/index/image/Indian-law-chatbot.jpg", title: "Indian Laws Chatbot", desc: "Get instant answers to legal queries through our AI-powered chatbot that is well-versed in Indian laws. Simplify your legal research by asking questions directly to the chatbot." },
    { img: "/src/assets/Images/index/image/langauge-translate.jpg", title: "Document Translator", desc: "Translate legal documents into multiple languages with our built-in translation tool. Break language barriers by converting documents into your preferred language." },
    { img: "/src/assets/Images/index/image/law-document.jpg", title: "E-Document Library", desc: "E-Document Library provides secure storage and organization of legal documents electronically, including contracts, agreements, and case files, with categorized access for easy retrieval." },
    { img: "/src/assets/Images/index/image/Calendar.jpg", title: "Meeting Calendar Schedule", desc: "Meeting Calendar Schedule allows you to schedule and manage meetings with clients and other parties, setting reminders and notifications for upcoming meetings and deadlines." },
    { img: "/src/assets/Images/index/image/case paper.jpg", title: "Case Paper AI Analysis", desc: "Case Paper AI Analysis uses AI to examine case papers and documents, offering insights and recommendations tailored to the specific needs of each client." }
  ];

  const chooseUsData = [
    { icon: "fa-regular fa-clock", title: "24/7 Accessibility", desc: "Access your legal tools and documents anytime, anywhere, from any device—because legal work doesn't stop at 5 PM." },
    { icon: "fa-solid fa-scale-balanced", title: "Efficiency & Trust", desc: "Automate routine tasks and focus on what matters most—your clients. Safeguard your sensitive data with advanced encryption and security protocols." },
    { icon: "fa-regular fa-face-smile", title: "User-Friendly Interface", desc: "Navigate through a sleek, intuitive dashboard that makes managing your legal work effortless, even for those who aren't tech-savvy." }
  ];

  return (
    <div className="bg-black text-white font-sans overflow-x-hidden">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full z-50 shadow-[0_5px_10px_rgba(128,128,128,0.5)]">
        <div className="h-[50px] bg-black">
          <div className="container mx-auto px-4 h-full">
            <div className="flex justify-between items-center h-full">
              <img src="/src/assets/Images/logo_vlc.png" alt="Logo" className="max-h-10" />
              <a 
                href="Login_registration.php" 
                className="px-2 py-1 text-xs font-medium uppercase text-[#cfb587] border border-transparent rounded transition-colors duration-300 hover:text-white"
                style={{ 
                  background: 'linear-gradient(#000, #000) padding-box, linear-gradient(270deg, #806633 4%, #ffd47f 50%, #806633 96%) border-box'
                }}
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative w-full h-screen mt-[50px] overflow-hidden">
        <div className="relative w-full h-full">
          {/* Carousel Indicators */}
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                  index === currentSlide ? 'bg-[#aa9166]' : 'bg-white/50'
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slides */}
          {carouselSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img 
                src={slide.img} 
                alt={`Slide ${index + 1}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/src/assets/Images/index/image/carousel-1.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black/30"></div>
              
              {/* Caption */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-white text-4xl md:text-6xl font-bold mb-5 font-['EB_Garamond',serif] animate-[fadeInLeft_1.5s_ease]">
                  {slide.title}
                </h1>
                <p className="text-white text-xl md:text-2xl mb-6 animate-[fadeInRight_1.5s_ease] max-w-3xl">
                  {slide.description}
                </p>
                <a 
                  href={slide.buttonLink}
                  className="px-4 py-2 text-lg font-medium uppercase text-[#cfb587] border border-transparent rounded transition-colors duration-300 hover:text-black animate-[fadeInUp_1.5s_ease]"
                  style={{ 
                    background: 'linear-gradient(#000, #000) padding-box, linear-gradient(270deg, #806633 4%, #ffd47f 50%, #806633 96%) border-box'
                  }}
                >
                  {slide.buttonText}
                </a>
              </div>
            </div>
          ))}

          {/* Controls */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-30 focus:outline-none"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <span className="text-2xl">‹</span>
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-30 focus:outline-none"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <span className="text-2xl">›</span>
          </button>
        </div>
      </div>

      {/* About Us */}
      <div id="aboutus" className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 relative">
            <h2 className="text-4xl md:text-5xl font-bold font-['EB_Garamond',serif] relative z-10 inline-block px-4 bg-black">
              About Us
            </h2>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] bg-[#aa9166]"></div>
            </div>
          </div>
          
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-5/12 md:w-6/12 px-4 mb-8 md:mb-0">
              <div className="relative top-2.5 h-full p-2.5 bg-[#121518] border-4 border-[#aa9166]/50">
                <img 
                  src="/src/assets/Images/index/image/about-us.jpg" 
                  alt="About Us" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/src/assets/Images/index/image/about-us.jpg';
                  }}
                />
              </div>
            </div>
            <div className="w-full lg:w-7/12 md:w-6/12 px-4">
              <div className="text-justify">
                <p className="mb-4 text-base">
                  At Advocate AI Master, we're dedicated to empowering legal professionals with cutting-edge AI tools that simplify and enhance their work. Our mission is to provide a platform that integrates seamlessly into your practice, helping you manage cases, clients, and documents with ease. We believe in the power of technology to transform the legal industry, making it more efficient, accurate, and accessible.
                </p>
                <p className="text-base">
                  With a focus on innovation and user experience, we continuously strive to offer solutions that meet the evolving needs of today's legal professionals. Join us in shaping the future of legal practice with Advocate AI Master. We understand the challenges legal professionals face and are here to support you every step of the way. At Advocate AI, your success is our priority, and we're driven by a passion for excellence in legal technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 relative">
            <h2 className="text-4xl md:text-5xl font-bold font-['EB_Garamond',serif] relative z-10 inline-block px-4 bg-black">
              Our Features
            </h2>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] bg-[#aa9166]"></div>
            </div>
          </div>

          <div className="flex flex-wrap -mx-4">
            {featuresData.map((feature, index) => (
              <div key={index} className="w-full lg:w-4/12 md:w-6/12 px-4 mb-8 flex">
                <div className="w-full border-4 border-[#aa9166]/50 text-center bg-[#121518] transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="relative">
                    <img 
                      src={feature.img} 
                      alt={feature.title} 
                      className="w-full h-[225px] object-cover"
                      onError={(e) => {
                        e.target.src = '/src/assets/Images/index/image/client-management.jpeg';
                      }}
                    />
                  </div>
                  <h3 className="m-0 p-4 text-2xl font-semibold bg-gradient-to-r from-[#806633] via-[#ffd47f] to-[#806633] text-black">
                    {feature.title}
                  </h3>
                  <p className="m-0 p-6 text-justify text-white text-base">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div id="chooseus" className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-7/12 px-4">
              <div className="mb-12 relative">
                <h2 className="text-4xl md:text-5xl font-bold font-['EB_Garamond',serif] relative z-10 inline-block px-4 bg-black">
                  Why Choose Us
                </h2>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-[1px] bg-[#aa9166]"></div>
                </div>
              </div>

              {chooseUsData.map((item, index) => (
                <div key={index} className="flex items-center mb-8">
                  <div className="w-5/12 pr-4">
                    <div className="h-[180px] flex items-center justify-center bg-[#121518] border-4 border-[#aa9166]">
                      <i className={`${item.icon} text-6xl text-[#aa9166] bg-black p-5 rounded-full transition-all duration-500 hover:mr-[-15px]`}></i>
                    </div>
                  </div>
                  <div className="w-7/12">
                    <h3 className="text-3xl font-semibold mb-4 pb-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-[50px] after:h-[2px] after:bg-[#aa9166]">
                      {item.title}
                    </h3>
                    <p className="text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full md:w-5/12 px-4">
              <div className="h-full p-2.5 bg-[#121518]">
                <img 
                  src="/src/assets/Images/index/image/law-feature.jpg" 
                  alt="Feature" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/src/assets/Images/index/image/law-feature.jpg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div id="faqs" className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-5/12 px-4 mb-8 md:mb-0">
              <div className="h-full p-2.5 bg-[#121518]">
                <img 
                  src="/src/assets/Images/index/image/faqs.jpg" 
                  alt="FAQs" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/src/assets/Images/index/image/faqs.jpg';
                  }}
                />
              </div>
            </div>
            <div className="w-full md:w-7/12 px-4">
              <div className="text-center mb-12 relative">
                <h2 className="text-4xl md:text-5xl font-bold font-['EB_Garamond',serif] relative z-10 inline-block px-4 bg-black">
                  Have A Questions?
                </h2>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-[1px] bg-[#aa9166]"></div>
                </div>
              </div>

              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="border border-[#aa9166]">
                    <div className="bg-gradient-to-r from-[#806633] via-[#ffd47f] to-[#806633]">
                      <button 
                        className="w-full text-left px-4 py-2 text-black text-lg flex items-center hover:opacity-90 transition-opacity focus:outline-none"
                        onClick={() => toggleFaq(index)}
                      >
                        <span className="inline-flex items-center justify-center w-10 h-10 mr-2.5 text-center bg-[#806633] text-black font-bold">
                          {index + 1}
                        </span>
                        <span className="flex-1">{faq.q}</span>
                        <span className="ml-auto">
                          <i className={`fas ${faqOpenStates[index] ? 'fa-chevron-up' : 'fa-chevron-down'} text-black`}></i>
                        </span>
                      </button>
                    </div>
                    {faqOpenStates[index] && (
                      <div className="p-4 bg-black text-base border-t border-[#aa9166]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-[#aa9166] my-8" />

      {/* Footer */}
      <div className="py-8 px-5 shadow-[0_-5px_10px_rgba(128,128,128,0.5)]">
        <div className="container mx-auto">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-6/12 lg:w-4/12 px-4 mb-8">
              <h2 className="text-2xl font-semibold text-[#aa9166] mb-8">About Us</h2>
              <p className="text-justify text-white text-base">
                At Advocate AI Master, we are passionate about revolutionizing the legal industry through the power of artificial intelligence. Founded on the belief that technology can enhance and simplify the work of legal professionals, our mission is to deliver innovative solutions that seamlessly integrate into your practice, empowering you to manage cases, clients, and documents with unprecedented efficiency and accuracy.
              </p>
            </div>
            <div className="w-full md:w-6/12 lg:w-8/12 px-4">
              <div className="flex flex-wrap">
                <div className="w-full md:w-6/12 lg:w-4/12 px-4 mb-8">
                  <h2 className="text-2xl font-semibold text-[#aa9166] mb-8">E-Books</h2>
                  <div className="space-y-2">
                    <a href="PDF/Indian_Penal_Code.pdf" target="_blank" rel="noopener noreferrer" className="block text-white hover:text-[#aa9166] transition-colors before:content-['\\f105'] before:font-['Font_Awesome_5_Free'] before:mr-2.5">Indian_Penal_Code</a>
                    <a href="PDF/Bharatiya_Sakshya_Adhiniyam_2023.pdf" target="_blank" rel="noopener noreferrer" className="block text-white hover:text-[#aa9166] transition-colors before:content-['\\f105'] before:font-['Font_Awesome_5_Free'] before:mr-2.5">Bharatiya_Sakshya_Adhiniyam</a>
                    <a href="PDF/Bharatiya_Nagarik_Suraksha_Sanhita,_2023.pdf" target="_blank" rel="noopener noreferrer" className="block text-white hover:text-[#aa9166] transition-colors before:content-['\\f105'] before:font-['Font_Awesome_5_Free'] before:mr-2.5">Bharatiya_Nagarik_Suraksha_Sanhita</a>
                    <a href="PDF/Bharatiya_Nyaya_Sanhita_2023.pdf" target="_blank" rel="noopener noreferrer" className="block text-white hover:text-[#aa9166] transition-colors before:content-['\\f105'] before:font-['Font_Awesome_5_Free'] before:mr-2.5">Bharatiya_Nyaya_Sanhita</a>
                    <a href="PDF/Constitution_of_India.pdf" target="_blank" rel="noopener noreferrer" className="block text-white hover:text-[#aa9166] transition-colors before:content-['\\f105'] before:font-['Font_Awesome_5_Free'] before:mr-2.5">Constitution_of_India</a>
                  </div>
                </div>
                <div className="w-full md:w-6/12 lg:w-4/12 px-4 mb-8 lg:ml-10">
                  <h2 className="text-2xl font-semibold text-[#aa9166] mb-8">Useful Pages</h2>
                  <div className="space-y-2">
                    <a href="#aboutus" className="block text-white hover:text-[#aa9166] transition-colors before:content-['\\f105'] before:font-['Font_Awesome_5_Free'] before:mr-2.5">About Us</a>
                    <a href="#features" className="block text-white hover:text-[#aa9166] transition-colors before:content-['\\f105'] before:font-['Font_Awesome_5_Free'] before:mr-2.5">Features</a>
                    <a href="faq.html" className="block text-white hover:text-[#aa9166] transition-colors before:content-['\\f105'] before:font-['Font_Awesome_5_Free'] before:mr-2.5">Faqs</a>
                    <a href="terms_condition.html" className="block text-white hover:text-[#aa9166] transition-colors before:content-['\\f105'] before:font-['Font_Awesome_5_Free'] before:mr-2.5">Terms and Conditions</a>
                    <a href="privacy_policy.html" className="block text-white hover:text-[#aa9166] transition-colors before:content-['\\f105'] before:font-['Font_Awesome_5_Free'] before:mr-2.5">Privacy Policy</a>
                  </div>
                </div>
                <div className="w-full md:w-6/12 lg:w-4/12 px-4">
                  <h2 className="text-2xl font-semibold text-[#aa9166] mb-8">Get In Touch</h2>
                  <div className="space-y-2">
                    <p className="flex items-start"><i className="fa fa-map-marker w-6 mt-1"></i><span>8th Floor, City Avenue, Wakad, Pune, Maharashtra.</span></p>
                    <p className="flex items-start"><i className="fa fa-phone w-6 mt-1"></i><span>+91 20 4600 9797<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+91 91 3008 9797</span></p>
                    <p className="flex items-start"><i className="fa fa-envelope w-6 mt-1"></i><a href="mailto:info@advocateaimaster.com" className="text-white no-underline hover:text-[#aa9166]" target="_blank">info@AdvocateAiMaster.com</a></p>
                    <div className="flex space-x-4 mt-5">
                      <a href="https://www.facebook.com/people/Advocate-ai-master/61565198202946/" target="_blank" rel="noopener noreferrer" className="text-[#aa9166] hover:text-gray-500"><i className="fab fa-facebook-f text-xl"></i></a>
                      <a href="https://www.instagram.com/advocateaimaster/" target="_blank" rel="noopener noreferrer" className="text-[#aa9166] hover:text-gray-500"><i className="fab fa-instagram text-xl"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="text-center py-4 border-t border-[#aa9166] mt-8">
            <p className="mb-0 text-white">© Advocate AI Master. All Rights Reserved 2025 by <a href="https://www.rajyugsolutions.com/" className="text-[#aa9166] hover:underline" target="_blank" rel="noopener noreferrer">Rajyug IT Solutions Pvt. Ltd.</a></p>
          </footer>
        </div>
      </div>

      {/* Back to Top */}
      <a 
        href="#" 
        className="back-to-top hidden fixed right-4 bottom-4 w-8 h-8 bg-gradient-to-r from-[#806633] via-[#ffd47f] to-[#806633] text-[#121518] text-center leading-8 text-2xl rounded-full z-50 hover:bg-[#282828] hover:text-[#aa9166] transition-colors"
        onClick={scrollToTop}
      >
        <i className="fa fa-chevron-up text-xl"></i>
      </a>

      {/* Chat Button */}
      <div 
        className="fixed bottom-4 left-4 w-12 h-12 bg-gradient-to-r from-[#806633] via-[#ffd47f] to-[#806633] text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg z-50 hover:bg-[#8a7546] transition-colors"
        onClick={toggleChat}
      >
        <i className="fas fa-comment"></i>
      </div>

      {/* Chat Window */}
      {chatWindowOpen && (
        <div className="fixed bottom-24 left-5 w-[300px] h-[400px] bg-white rounded-lg shadow-lg flex flex-col z-50">
          <div className="bg-gradient-to-r from-[#806633] via-[#ffd47f] to-[#806633] text-[#555] p-2 rounded-t-lg flex justify-between items-center relative">
            <select 
              className="bg-[#1b1b1b] text-white border border-[#aa9166] rounded px-1 py-0.5 text-xs mr-1 focus:outline-none"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
            
            <button 
              className={`w-6 h-6 rounded-full border border-black flex items-center justify-center cursor-pointer mr-1 transition-colors focus:outline-none ${allowOnlineSearch ? 'bg-[#ffd47f]/20' : ''}`}
              onClick={() => setAllowOnlineSearch(!allowOnlineSearch)}
              title="Toggle Internet Search"
            >
              <i className={`fas fa-globe text-base ${allowOnlineSearch ? 'text-green-500' : 'text-black'}`}></i>
            </button>
            
            <span className="font-bold text-black">AI Chat Assistant</span>
            
            <button 
              className="bg-transparent border-none text-black text-base cursor-pointer p-0 focus:outline-none" 
              onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>
            
            {menuDropdownOpen && (
              <div className="absolute top-8 right-8 text-white bg-black border border-gray-300 rounded shadow-lg z-50">
                <button 
                  className="block w-full px-2 py-1 text-sm bg-transparent border-none text-left text-white cursor-pointer hover:bg-gray-800 focus:outline-none" 
                  onClick={() => { 
                    setSearchBarOpen(true); 
                    setMenuDropdownOpen(false); 
                  }}
                >
                  Search Chat
                </button>
                <button 
                  className="block w-full px-2 py-1 text-sm bg-transparent border-none text-left text-white cursor-pointer hover:bg-gray-800 focus:outline-none" 
                  onClick={() => { 
                    setChatMessages([]); 
                    setMenuDropdownOpen(false); 
                    setSearchBarOpen(false); 
                    setSearchTerm(''); 
                    resetSearch(); 
                  }}
                >
                  Clear Chat
                </button>
              </div>
            )}
            
            {searchBarOpen && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#806633] via-[#ffd47f] to-[#806633] p-2.5 rounded-t-lg flex items-center z-50">
                <button 
                  className="bg-transparent border-none text-black cursor-pointer text-base mr-2 focus:outline-none" 
                  onClick={() => { 
                    setSearchBarOpen(false); 
                    setSearchTerm(''); 
                    resetSearch(); 
                  }}
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
                <input 
                  type="text" 
                  className="flex-1 p-1 border border-gray-300 rounded bg-[#1b1b1b] text-white mx-1 focus:outline-none" 
                  placeholder="Search messages..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-transparent border-none text-black cursor-pointer text-base focus:outline-none">
                  <i className="fas fa-arrow-up"></i>
                </button>
                <button className="bg-transparent border-none text-black cursor-pointer text-base focus:outline-none">
                  <i className="fas fa-arrow-down"></i>
                </button>
              </div>
            )}
            
            <button className="text-sm font-thin border-none shadow-none bg-transparent focus:outline-none" onClick={closeChat}>
              <i className="fa fa-close"></i>
            </button>
          </div>
          
          <div className="flex-1 p-2.5 overflow-y-auto bg-[#1b1b1b]" ref={chatBodyRef}>
            {chatMessages.map((msg) => (
              <div key={msg.id} className="mb-2">
                {msg.type === 'text' ? (
                  <div className={`p-2 px-3 rounded-lg max-w-[85%] break-words ${
                    msg.sender === 'AI Assistant' 
                      ? 'bg-black border border-white text-white mr-auto' 
                      : 'bg-transparent border border-transparent text-white ml-auto'
                  }`}
                  style={msg.sender !== 'AI Assistant' ? { 
                    background: 'linear-gradient(#000, #000) padding-box, linear-gradient(270deg, #806633 4%, #ffd47f 50%, #806633 96%) border-box',
                    width: 'fit-content'
                  } : {}}
                  >
                    <span className="message-content">{msg.message}</span>
                  </div>
                ) : (
                  <div className={`p-2 px-3 rounded-lg max-w-[85%] break-words ${
                    msg.sender === 'AI Assistant' 
                      ? 'bg-black border border-white text-white mr-auto' 
                      : 'bg-transparent border border-transparent text-white ml-auto'
                  }`}
                  style={msg.sender !== 'AI Assistant' ? { 
                    background: 'linear-gradient(#000, #000) padding-box, linear-gradient(270deg, #806633 4%, #ffd47f 50%, #806633 96%) border-box',
                    width: 'fit-content'
                  } : {}}
                  >
                    {msg.text && <span className="message-content block mb-1">{msg.text}</span>}
                    <audio controls className="w-[200px] h-[30px] align-middle">
                      <source src={msg.audioUrl} type="audio/webm" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="bg-[#1b1b1b] flex items-center p-2.5 border-t border-gray-300">
            <input 
              type="text" 
              className="flex-1 p-2 border border-gray-300 rounded mr-1 text-white bg-[#1b1b1b] focus:outline-none" 
              placeholder="Type your message..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className={`bg-transparent border-none cursor-pointer ml-1 focus:outline-none ${isRecording ? 'recording' : ''}`}
              onMouseDown={handleMicMouseDown}
              onMouseUp={handleMicMouseUp}
              onTouchStart={handleMicMouseDown}
              onTouchEnd={handleMicMouseUp}
            >
              <i className={`fas fa-microphone text-xl ${isRecording ? 'text-red-500' : 'text-[#b39658]'}`}></i>
            </button>
            <button className="bg-transparent border-none cursor-pointer text-[#b39658] hover:bg-white rounded p-1 transition-colors focus:outline-none" onClick={handleSendMessage}>
              <i className="fa fa-send"></i>
            </button>
            
            {isRecording && (
              <button 
                className="ml-1 bg-black text-white border-none py-1 px-2 rounded cursor-pointer text-xl hover:bg-gray-800 transition-colors focus:outline-none"
                onClick={handleCancelRecording}
              >
                <i className="fa fa-trash"></i>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .recording {
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        
        .back-to-top.hidden {
          display: none;
        }
        
        .back-to-top:not(.hidden) {
          display: block;
        }
      `}</style>
    </div>
  );
};

export default Homepage;