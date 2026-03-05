// pages/FAQPage.jsx
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { MapPin, Phone, Mail, Facebook, Instagram, ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";

const FAQPage = () => {
  const [currentPage1, setCurrentPage1] = useState(0);
  const [currentPage2, setCurrentPage2] = useState(0);
  const [currentPage3, setCurrentPage3] = useState(0);
  const [openAccordion1, setOpenAccordion1] = useState(null);
  const [openAccordion2, setOpenAccordion2] = useState(null);
  const [openAccordion3, setOpenAccordion3] = useState(null);
  
  const itemsPerPage = 5;

  // FAQ Data
  const faqSection1 = [
    { question: "What is legal technology?", answer: "Legal technology refers to software and tools that streamline legal services, enhancing efficiency, accuracy, and client satisfaction." },
    { question: "How is AI transforming the legal industry?", answer: "AI is revolutionizing law by automating tasks, enhancing research accuracy, and enabling predictive analytics, leading to more informed legal decisions." },
    { question: "What are AI-based legal solutions?", answer: "AI-based legal solutions automate tasks like document review, legal research, and compliance monitoring, boosting productivity and reducing errors." },
    { question: "What is legal automation?", answer: "Legal automation uses technology to handle routine legal tasks, freeing up lawyers for more complex work and improving overall efficiency." },
    { question: "Benefits of using AI in law firms?", answer: "AI reduces costs, improves accuracy, accelerates processes, and enhances decision-making in law firms." },
    { question: "How does legal tech improve efficiency?", answer: "Legal tech streamlines processes, automates repetitive tasks, and provides faster, more accurate data handling, leading to greater efficiency." },
    { question: "What are the latest trends in legal technology?", answer: "Key trends include AI-driven analytics, legal chatbots, blockchain for contracts, and cloud-based practice management." },
    { question: "How can AI assist in legal research?", answer: "AI quickly analyzes vast legal databases, identifying relevant cases and statutes, significantly speeding up research." },
    { question: "What is the future of AI in law?", answer: "AI will increasingly handle complex tasks, assist in decision-making, and improve legal service delivery." },
    { question: "What are the common challenges in adopting legal tech?", answer: "Challenges include high costs, data security concerns, and resistance to change within traditional law practices." },
    { question: "How does AI reduce legal costs?", answer: "AI automates labor-intensive tasks, reducing time spent and minimizing human errors, leading to lower overall costs." },
    { question: "What is document automation in legal tech?", answer: "Document automation uses AI to generate, review, and manage legal documents, ensuring accuracy and consistency." },
    { question: "How can AI help with case management?", answer: "AI organizes case data, tracks deadlines, and predicts outcomes, making case management more efficient." },
    { question: "What are AI-driven contract review tools?", answer: "These tools automatically analyze contracts for key terms, risks, and compliance issues, speeding up the review process." },
    { question: "How does AI improve legal accuracy?", answer: "AI reduces human errors by cross-referencing vast data sets, ensuring more precise and reliable legal work." }
  ];

  const faqSection2 = [
    { question: "What are the best AI-based legal tech solutions?", answer: "Top solutions include AI-driven contract analysis, legal research tools, and document automation platforms, enhancing efficiency and accuracy." },
    { question: "How to choose the right legal tech platform?", answer: "Evaluate based on features, scalability, integration ease, user experience, and vendor support to match your firm's needs." },
    { question: "What is the cost of implementing AI in law firms?", answer: "Costs vary widely; consider initial setup, licensing fees, and ongoing maintenance, balanced against potential productivity gains." },
    { question: "How to integrate AI into existing legal workflows?", answer: "Start with pilot projects, ensure compatibility with current systems, and train staff to seamlessly incorporate AI tools." },
    { question: "What are the challenges of implementing AI in law practices?", answer: "Challenges include high costs, data privacy concerns, and resistance to change among traditional practices." },
    { question: "How secure are AI-based legal solutions?", answer: "Modern AI solutions use robust encryption and compliance measures, but constant vigilance and updates are essential for security." },
    { question: "What is the ROI of investing in legal tech?", answer: "ROI is typically seen in increased efficiency, reduced errors, and cost savings, improving overall firm profitability." },
    { question: "How to train legal teams on AI tools?", answer: "Provide comprehensive training programs, hands-on practice, and ongoing support to ensure effective use of AI tools." },
    { question: "What is the implementation timeline for AI in legal firms?", answer: "Implementation can range from a few months to over a year, depending on the complexity and scale of the solution." },
    { question: "How does AI compare to traditional legal research methods?", answer: "AI accelerates research, offers precise results, and handles large data sets more efficiently than traditional methods." },
    { question: "What are the top features of AI-based legal platforms?", answer: "Key features include natural language processing, automated document review, predictive analytics, and user-friendly interfaces." },
    { question: "How does AI improve client retention in law firms?", answer: "AI enhances service quality through faster responses, personalized interactions, and efficient case management, boosting client satisfaction." },
    { question: "What are the compliance requirements for AI in law?", answer: "Compliance involves adhering to data protection laws, ensuring transparency in AI processes, and maintaining ethical standards." },
    { question: "How to evaluate AI legal tech vendors?", answer: "Assess vendor reputation, product features, customer support, scalability, and integration capabilities through demos and references." },
    { question: "What are the integration capabilities of AI in legal tech?", answer: "AI platforms typically offer APIs and integration options with existing legal software, enabling seamless workflow integration." }
  ];

  const faqSection3 = [
    { question: "What are the best AI-based legal tech solutions?", answer: "Top solutions include AI-driven contract analysis, legal research tools, and document automation platforms, enhancing efficiency and accuracy." },
    { question: "How to choose the right legal tech platform?", answer: "Evaluate based on features, scalability, integration ease, user experience, and vendor support to match your firm's needs." },
    { question: "How does AI enhance legal research?", answer: "AI legal research tools use algorithms to analyze large datasets, providing precise case law, statutes, and legal documents faster than traditional methods." },
    { question: "What is the impact of AI on legal document automation?", answer: "AI automates document drafting and review, reducing time spent on repetitive tasks, minimizing errors, and ensuring compliance with legal standards." },
    { question: "How secure is AI in legal tech applications?", answer: "AI in legal tech is designed with strong encryption, compliance with data protection laws, and regular security updates to ensure data privacy and integrity." },
    { question: "Can AI replace lawyers in the future?", answer: "AI complements legal work by automating routine tasks, but the nuanced understanding and strategic thinking required in law ensure that AI won't replace lawyers entirely." },
    { question: "What are the ethical concerns with AI in law?", answer: "Key concerns include bias in AI algorithms, the potential for reduced human oversight, and challenges in ensuring accountability for AI-driven decisions." },
    { question: "How does AI help with contract management?", answer: "AI streamlines contract management by automating contract creation, analysis, and compliance tracking, leading to faster and more accurate contract handling." },
    { question: "What is predictive analytics in legal tech?", answer: "Predictive analytics uses data, statistical algorithms, and AI to identify the likelihood of future outcomes, aiding legal professionals in decision-making and case strategy." },
    { question: "How can law firms integrate AI into their practice?", answer: "Law firms can integrate AI by adopting AI-powered tools for research, document management, case analysis, and client communication to improve efficiency and client service." },
    { question: "What is the role of AI in dispute resolution?", answer: "AI assists in dispute resolution by analyzing case data, predicting outcomes, and even facilitating online dispute resolution processes through AI-driven mediation platforms." },
    { question: "What is the customer service like for Advocate AI?", answer: "Top-tier, responsive service with dedicated account managers." },
    { question: "How does Advocate AI ensure data security for law firms?", answer: "Advocate AI uses advanced encryption and complies with all legal data protection regulations." },
    { question: "What are the contract terms for Advocate AI?", answer: "Flexible contracts with options for customization to fit your firm's needs." },
    { question: "How to migrate from existing legal tech to Advocate AI?", answer: "Advocate AI offers expert assistance for smooth, disruption-free migration." }
  ];

  // Toggle accordion functions
  const toggleAccordion1 = (index) => {
    setOpenAccordion1(openAccordion1 === index ? null : index);
  };

  const toggleAccordion2 = (index) => {
    setOpenAccordion2(openAccordion2 === index ? null : index);
  };

  const toggleAccordion3 = (index) => {
    setOpenAccordion3(openAccordion3 === index ? null : index);
  };

  // Get current items for pagination
  const getCurrentItems = (section, currentPage) => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return section.slice(start, end);
  };

  // Pagination handlers
  const handlePrev = (section, setCurrentPage, currentPage) => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      // Reset accordion when changing page
      if (section === 'section1') setOpenAccordion1(null);
      if (section === 'section2') setOpenAccordion2(null);
      if (section === 'section3') setOpenAccordion3(null);
      window.scrollTo({ top: document.getElementById(section).offsetTop - 100, behavior: 'smooth' });
    }
  };

  const handleNext = (section, setCurrentPage, currentPage, totalItems) => {
    if ((currentPage + 1) * itemsPerPage < totalItems) {
      setCurrentPage(currentPage + 1);
      // Reset accordion when changing page
      if (section === 'section1') setOpenAccordion1(null);
      if (section === 'section2') setOpenAccordion2(null);
      if (section === 'section3') setOpenAccordion3(null);
      window.scrollTo({ top: document.getElementById(section).offsetTop - 100, behavior: 'smooth' });
    }
  };

  // Back to top function
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show/hide back to top button
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

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Advocate AI Master – The future of legal tech..</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="AI Legal Tech, Legal AI Solutions, AI in Legal Industry, AI for Legal Advocacy, Advocate AI Software, Artificial Intelligence Lawyers, AI for Lawyers, AI Legal Assistance, AI Technology for Lawyers, AI for Legal Professionals, Legaltech AI Platforms, AI in Legal Analysis, AI-Based Legal Advisor, Automated Legal Advocacy, AI for Legal Research, Legal Document Automation AI, AI Legal Predictions, AI for Legal Document Review, Legal Case Prediction AI, AI Legal Consultation, AI and Law Technology, Artificial Intelligence in Courtrooms, Legal Practice AI Tools, AI for Contract Analysis, AI Legal Proceedings, Artificial Intelligence for Legal Professionals, AI in Legal Education, Legal Dispute AI Solutions, AI Case Law Analysis, AI for Legal Compliance, Artificial Intelligence Legal Ethics, AI Lawyer Chabot, AI Legal Innovations, lawyer ai app, advocate price, senior ai advocate, advocate assistant job description, lawyer ai case, ai lawyer salary, ai lawyer website, ai advocate job, advocacy about ai, advocate for ai, advocate guardian jobs, ai lawyer linkedin, Artificial Intelligence in Advocacy" />
        <meta name="description" content="Advocate AI Master is revolutionizing the legal industry with cutting-edge AI technology. Our platform offers advanced AI solutions for legal advocacy, including automated legal research, document review, and case predictions. Experience efficient, cost-effective legal support designed for both clients and professionals. Discover how our AI-powered tools can transform your legal practice." />
        <link rel="icon" href="/assets/images/law.png" type="image/png" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Material+Icons+Outlined" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
      </Helmet>

      {/* Top Header */}
      <div className="fixed top-0 left-0 w-full z-50 shadow-[0_5px_10px_rgba(128,128,128,0.5)]">
        <div className="h-[50px] bg-black">
          <div className="container-fluid px-4 h-full">
            <div className="flex justify-between items-center h-full">
              <img src="/src/assets/Images/logo_vlc.png" alt="Logo" className="max-h-10" />
              <a 
                className="px-4 py-2 text-xs font-medium uppercase text-[#cfb587] border border-transparent rounded transition-colors duration-300 hover:text-white" 
                href="/"
                style={{ background: 'linear-gradient(#000, #000) padding-box, linear-gradient(270deg, #806633 4%, #ffd47f 50%, #806633 96%) border-box' }}
              >
                Back
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow mt-[50px]">
        <div className="container-fluid px-4 py-8 max-w-7xl mx-auto">
          
          {/* First FAQ Section */}
          <div className="flex flex-wrap -mx-4 mb-8" id="section1">
            <div className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
              <img 
                src="/src/assets/Images/index/image/faqs.jpg" 
                alt="Scales of Justice" 
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=FAQ+Image';
                }}
              />
            </div>
            <div className="w-full md:w-2/3 px-4">
              <div className="bg-black/80 p-5 rounded-lg border border-[#aa9166]/30">
                <div className="text-center mb-4">
                  <h5 className="text-[#e3c785] text-xl font-semibold uppercase">LegalTech Spotlight (FAQ<span className="lowercase">s</span>)</h5>
                  <hr className="border-t-2 border-[#aa9166] w-24 mx-auto mt-2" />
                </div>
                
                <div className="space-y-3">
                  {getCurrentItems(faqSection1, currentPage1).map((faq, idx) => {
                    const actualIndex = currentPage1 * itemsPerPage + idx;
                    return (
                      <div key={idx} className="border border-[#aa9166]/50 rounded-lg overflow-hidden">
                        <button 
                          className="w-full text-left px-4 py-3 bg-gradient-to-r from-[#806633] via-[#ffd47f] to-[#806633] text-black font-bold flex items-center justify-between hover:opacity-90 transition-all"
                          onClick={() => toggleAccordion1(actualIndex)}
                        >
                          <div className="flex items-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 mr-3 bg-[#806633] text-black font-bold rounded">
                              {actualIndex + 1}
                            </span>
                            <span className="flex-1">{faq.question}</span>
                          </div>
                          {openAccordion1 === actualIndex ? (
                            <ChevronUp className="w-5 h-5 text-black" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-black" />
                          )}
                        </button>
                        
                        {openAccordion1 === actualIndex && (
                          <div className="p-4 bg-[#1a1a1a] text-white border-t border-[#aa9166]/50">
                            <p className="text-sm leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Pagination Buttons */}
                  <div className="flex justify-center gap-3 mt-6">
                    <button 
                      className={`px-4 py-2 text-xs font-medium uppercase rounded transition-all duration-300 ${
                        currentPage1 === 0 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:text-white'
                      }`}
                      style={{ 
                        background: 'linear-gradient(#000, #000) padding-box, linear-gradient(270deg, #806633 4%, #ffd47f 50%, #806633 96%) border-box',
                        border: '1px solid transparent',
                        color: '#cfb587'
                      }}
                      onClick={() => handlePrev('section1', setCurrentPage1, currentPage1)}
                      disabled={currentPage1 === 0}
                    >
                      <ChevronLeft size={16} className="inline" /> Previous
                    </button>
                    <button 
                      className={`px-4 py-2 text-xs font-medium uppercase rounded transition-all duration-300 ${
                        (currentPage1 + 1) * itemsPerPage >= faqSection1.length 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:text-white'
                      }`}
                      style={{ 
                        background: 'linear-gradient(#000, #000) padding-box, linear-gradient(270deg, #806633 4%, #ffd47f 50%, #806633 96%) border-box',
                        border: '1px solid transparent',
                        color: '#cfb587'
                      }}
                      onClick={() => handleNext('section1', setCurrentPage1, currentPage1, faqSection1.length)}
                      disabled={(currentPage1 + 1) * itemsPerPage >= faqSection1.length}
                    >
                      Next <ChevronRight size={16} className="inline" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-t-2 border-[#AA9166] my-8" />

          {/* Second FAQ Section */}
          <div className="flex flex-wrap -mx-4 mb-8" id="section2">
            <div className="w-full md:w-2/3 px-4 mb-8 md:mb-0">
              <div className="bg-black/80 p-5 rounded-lg border border-[#aa9166]/30">
                <div className="text-center mb-4">
                  <h5 className="text-[#e3c785] text-xl font-semibold uppercase">Case Studies: AI in Action (FAQ<span className="lowercase">s</span>)</h5>
                  <hr className="border-t-2 border-[#aa9166] w-24 mx-auto mt-2" />
                </div>
                
                <div className="space-y-3">
                  {getCurrentItems(faqSection2, currentPage2).map((faq, idx) => {
                    const actualIndex = currentPage2 * itemsPerPage + idx;
                    return (
                      <div key={idx} className="border border-[#aa9166]/50 rounded-lg overflow-hidden">
                        <button 
                          className="w-full text-left px-4 py-3 bg-gradient-to-r from-[#806633] via-[#ffd47f] to-[#806633] text-black font-bold flex items-center justify-between hover:opacity-90 transition-all"
                          onClick={() => toggleAccordion2(actualIndex)}
                        >
                          <div className="flex items-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 mr-3 bg-[#806633] text-black font-bold rounded">
                              {actualIndex + 1}
                            </span>
                            <span className="flex-1">{faq.question}</span>
                          </div>
                          {openAccordion2 === actualIndex ? (
                            <ChevronUp className="w-5 h-5 text-black" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-black" />
                          )}
                        </button>
                        
                        {openAccordion2 === actualIndex && (
                          <div className="p-4 bg-[#1a1a1a] text-white border-t border-[#aa9166]/50">
                            <p className="text-sm leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Pagination Buttons */}
                  <div className="flex justify-center gap-3 mt-6">
                    <button 
                      className={`px-4 py-2 text-xs font-medium uppercase rounded transition-all duration-300 ${
                        currentPage2 === 0 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:text-white'
                      }`}
                      style={{ 
                        background: 'linear-gradient(#000, #000) padding-box, linear-gradient(270deg, #806633 4%, #ffd47f 50%, #806633 96%) border-box',
                        border: '1px solid transparent',
                        color: '#cfb587'
                      }}
                      onClick={() => handlePrev('section2', setCurrentPage2, currentPage2)}
                      disabled={currentPage2 === 0}
                    >
                      <ChevronLeft size={16} className="inline" /> Previous
                    </button>
                    <button 
                      className={`px-4 py-2 text-xs font-medium uppercase rounded transition-all duration-300 ${
                        (currentPage2 + 1) * itemsPerPage >= faqSection2.length 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:text-white'
                      }`}
                      style={{ 
                        background: 'linear-gradient(#000, #000) padding-box, linear-gradient(270deg, #806633 4%, #ffd47f 50%, #806633 96%) border-box',
                        border: '1px solid transparent',
                        color: '#cfb587'
                      }}
                      onClick={() => handleNext('section2', setCurrentPage2, currentPage2, faqSection2.length)}
                      disabled={(currentPage2 + 1) * itemsPerPage >= faqSection2.length}
                    >
                      Next <ChevronRight size={16} className="inline" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full  md:w-1/3 px-4">
              <img 
                src="src/assets/Images/index/image/carousel-2.jpg" 
                alt="Scales of Justice" 
                className="w-full h-[500px] rounded-lg "
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Case+Studies';
                }}
              />
            </div>
          </div>

          <hr className="border-t-2 border-[#AA9166] my-8" />

          {/* Third FAQ Section */}
          <div className="flex flex-wrap -mx-4 mb-8" id="section3">
            <div className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
              <img 
                src="src/assets/Images/index/image/law-feature.jpg" 
                alt="Scales of Justice" 
                className="w-full h-auto rounded-lg "
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Implementation+Guide';
                }}
              />
            </div>
            <div className="w-full md:w-2/3 px-4">
              <div className="bg-black/80 p-5 rounded-lg border border-[#aa9166]/30">
                <div className="text-center mb-4">
                  <h5 className="text-[#e3c785] text-xl font-semibold uppercase">Advocate AI Implementation Guide (FAQ<span className="lowercase">s</span>)</h5>
                  <hr className="border-t-2 border-[#aa9166] w-24 mx-auto mt-2" />
                </div>
                
                <div className="space-y-3">
                  {getCurrentItems(faqSection3, currentPage3).map((faq, idx) => {
                    const actualIndex = currentPage3 * itemsPerPage + idx;
                    return (
                      <div key={idx} className="border border-[#aa9166]/50 rounded-lg overflow-hidden">
                        <button 
                          className="w-full text-left px-4 py-3 bg-gradient-to-r from-[#806633] via-[#ffd47f] to-[#806633] text-black font-bold flex items-center justify-between hover:opacity-90 transition-all"
                          onClick={() => toggleAccordion3(actualIndex)}
                        >
                          <div className="flex items-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 mr-3 bg-[#806633] text-black font-bold rounded">
                              {actualIndex + 1}
                            </span>
                            <span className="flex-1">{faq.question}</span>
                          </div>
                          {openAccordion3 === actualIndex ? (
                            <ChevronUp className="w-5 h-5 text-black" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-black" />
                          )}
                        </button>
                        
                        {openAccordion3 === actualIndex && (
                          <div className="p-4 bg-[#1a1a1a] text-white border-t border-[#aa9166]/50">
                            <p className="text-sm leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Pagination Buttons */}
                  <div className="flex justify-center gap-3 mt-6">
                    <button 
                      className={`px-4 py-2 text-xs font-medium uppercase rounded transition-all duration-300 ${
                        currentPage3 === 0 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:text-white'
                      }`}
                      style={{ 
                        background: 'linear-gradient(#000, #000) padding-box, linear-gradient(270deg, #806633 4%, #ffd47f 50%, #806633 96%) border-box',
                        border: '1px solid transparent',
                        color: '#cfb587'
                      }}
                      onClick={() => handlePrev('section3', setCurrentPage3, currentPage3)}
                      disabled={currentPage3 === 0}
                    >
                      <ChevronLeft size={16} className="inline" /> Previous
                    </button>
                    <button 
                      className={`px-4 py-2 text-xs font-medium uppercase rounded transition-all duration-300 ${
                        (currentPage3 + 1) * itemsPerPage >= faqSection3.length 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:text-white'
                      }`}
                      style={{ 
                        background: 'linear-gradient(#000, #000) padding-box, linear-gradient(270deg, #806633 4%, #ffd47f 50%, #806633 96%) border-box',
                        border: '1px solid transparent',
                        color: '#cfb587'
                      }}
                      onClick={() => handleNext('section3', setCurrentPage3, currentPage3, faqSection3.length)}
                      disabled={(currentPage3 + 1) * itemsPerPage >= faqSection3.length}
                    >
                      Next <ChevronRight size={16} className="inline" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-[#aa9166]/30 shadow-[0_-5px_10px_rgba(128,128,128,0.5)]">
        <div className="container-fluid px-4 py-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-1/3 px-4 mb-8">
              <h2 className="text-2xl font-semibold text-[#aa9166] mb-4">About Us</h2>
              <p className="text-justify text-white/90 text-sm leading-relaxed">
                At Advocate AI Master, we are passionate about revolutionizing the legal industry
                through the power of artificial intelligence. Founded on the belief that technology can
                enhance and simplify the work of legal professionals, our mission is to deliver
                innovative solutions that seamlessly integrate into your practice, empowering you to
                manage cases, clients, and documents with unprecedented efficiency and accuracy.
              </p>
            </div>
            
            <div className="w-full lg:w-2/3 px-4">
              <div className="flex flex-wrap -mx-4">
                <div className="w-full  md:w-1/3 px-4 mb-8">
                  <h2 className="text-2xl font-semibold text-[#aa9166] mb-4">E-Books</h2>
                  <div className="space-y-2">
                    <a href="/PDF/Indian_Penal_Code.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center text-white/80 hover:text-[#aa9166] transition-colors text-sm group">
                      <ChevronRight size={14} className="mr-2 text-[#aa9166] group-hover:translate-x-1 transition-transform" />
                      Indian Penal Code
                    </a>
                    <a href="/PDF/Bharatiya_Sakshya_Adhiniyam_2023.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center text-white/80 hover:text-[#aa9166] transition-colors text-sm group">
                      <ChevronRight size={14} className="mr-2 text-[#aa9166] group-hover:translate-x-1 transition-transform" />
                      Bharatiya Sakshya Adhiniyam
                    </a>
                    <a href="/PDF/Bharatiya_Nagarik_Suraksha_Sanhita,_2023.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center text-white/80 hover:text-[#aa9166] transition-colors text-sm group">
                      <ChevronRight size={14} className="mr-2 text-[#aa9166] group-hover:translate-x-1 transition-transform" />
                      Bharatiya Nagarik Suraksha
                    </a>
                    <a href="/PDF/Bharatiya_Nyaya_Sanhita_2023.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center text-white/80 hover:text-[#aa9166] transition-colors text-sm group">
                      <ChevronRight size={14} className="mr-2 text-[#aa9166] group-hover:translate-x-1 transition-transform" />
                      Bharatiya Nyaya Sanhita
                    </a>
                    <a href="/PDF/Constitution_of_India.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center text-white/80 hover:text-[#aa9166] transition-colors text-sm group">
                      <ChevronRight size={14} className="mr-2 text-[#aa9166] group-hover:translate-x-1 transition-transform" />
                      Constitution of India
                    </a>
                  </div>
                </div>
                
                <div className="w-full md:w-1/3 px-4 mb-8">
                  <h2 className="text-2xl font-semibold text-[#aa9166] mb-4">Useful Pages</h2>
                  <div className="space-y-2">
                    <a href="/#aboutus" className="flex items-center text-white/80 hover:text-[#aa9166] transition-colors text-sm group">
                      <ChevronRight size={14} className="mr-2 text-[#aa9166] group-hover:translate-x-1 transition-transform" />
                      About Us
                    </a>
                    <a href="/#features" className="flex items-center text-white/80 hover:text-[#aa9166] transition-colors text-sm group">
                      <ChevronRight size={14} className="mr-2 text-[#aa9166] group-hover:translate-x-1 transition-transform" />
                      Features
                    </a>
                    <a href="/faq" className="flex items-center text-white/80 hover:text-[#aa9166] transition-colors text-sm group">
                      <ChevronRight size={14} className="mr-2 text-[#aa9166] group-hover:translate-x-1 transition-transform" />
                      FAQs
                    </a>
                    <a href="/terms_condition" className="flex items-center text-white/80 hover:text-[#aa9166] transition-colors text-sm group">
                      <ChevronRight size={14} className="mr-2 text-[#aa9166] group-hover:translate-x-1 transition-transform" />
                      Terms and Conditions
                    </a>
                    <a href="/privacy_policy" className="flex items-center text-white/80 hover:text-[#aa9166] transition-colors text-sm group">
                      <ChevronRight size={14} className="mr-2 text-[#aa9166] group-hover:translate-x-1 transition-transform" />
                      Privacy Policy
                    </a>
                  </div>
                </div>
                
                <div className="w-full md:w-1/3 px-4 mb-8">
                  <h2 className="text-2xl font-semibold text-[#aa9166] mb-4">Get In Touch</h2>
                  <div className="space-y-3">
                    <p className="flex items-start text-white/80 text-sm">
                      <MapPin size={16} className="mr-2 mt-1 text-[#aa9166] flex-shrink-0" />
                      <span>8th Floor, City Avenue, Wakad, Pune, Maharashtra.</span>
                    </p>
                    <p className="flex items-start text-white/80 text-sm">
                      <Phone size={16} className="mr-2 mt-1 text-[#aa9166] flex-shrink-0" />
                      <span>
                        +91 20 4600 9797<br />
                        <span className="ml-6">+91 91 3008 9797</span>
                      </span>
                    </p>
                    <p className="flex items-start text-white/80 text-sm">
                      <Mail size={16} className="mr-2 mt-1 text-[#aa9166] flex-shrink-0" />
                      <a href="mailto:info@advocateaimaster.com" className="hover:text-[#aa9166] transition-colors" target="_blank" rel="noopener noreferrer">
                        info@AdvocateAiMaster.com
                      </a>
                    </p>
                    <div className="flex space-x-4 mt-4">
                      <a href="https://www.facebook.com/people/Advocate-ai-master/61565198202946/" target="_blank" rel="noopener noreferrer" className="text-[#aa9166] hover:text-white transition-colors">
                        <Facebook size={20} />
                      </a>
                      <a href="https://www.instagram.com/advocateaimaster/" target="_blank" rel="noopener noreferrer" className="text-[#aa9166] hover:text-white transition-colors">
                        <Instagram size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center py-4 border-t border-[#aa9166]/30">
          <p className="text-white/80 text-sm">
            © Advocate AI Master. All Rights Reserved 2025 by{' '}
            <a href="https://www.rajyugsolutions.com/" className="text-[#aa9166] hover:underline" target="_blank" rel="noopener noreferrer">
              Rajyug IT Solutions Pvt. Ltd.
            </a>
          </p>
        </div>  
      </footer>

      {/* Back to Top */}
      <a 
        href="#" 
        className="back-to-top hidden fixed right-4 bottom-4 w-10 h-10 bg-gradient-to-r from-[#806633] via-[#ffd47f] to-[#806633] text-black rounded-full flex items-center justify-center text-2xl z-50 hover:scale-110 transition-all duration-300 shadow-lg"
        onClick={scrollToTop}
      >
        ^
      </a>

      <style jsx>{`
        .back-to-top.hidden {
          display: none;
        }
        .back-to-top:not(.hidden) {
          display: flex;
        }
        
        @media (max-width: 768px) {
          .container-fluid {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FAQPage;