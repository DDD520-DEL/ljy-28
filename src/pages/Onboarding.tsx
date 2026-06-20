import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, PenLine, Image as ImageIcon, Lightbulb } from 'lucide-react';
import { saveToStorage, ONBOARDING_SHOWN_KEY } from '@/utils/storage';
import { cn } from '@/lib/utils';

interface OnboardingSlide {
  id: number;
  icon: typeof PenLine;
  title: string;
  description: string;
  gradient: string;
  illustration: JSX.Element;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    icon: PenLine,
    title: '记录改造过程',
    description: '用文字和照片记录每一次纸箱改造的灵感与步骤',
    gradient: 'from-kraft-400 to-kraft-500',
    illustration: (
      <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="150" cy="150" r="120" fill="#F5E6D3" />
        <g transform="translate(60, 70)">
          <rect x="20" y="30" width="140" height="110" rx="8" fill="#D4A574" />
          <path d="M20 30 L90 0 L160 30" fill="#C4956A" />
          <line x1="90" y1="0" x2="90" y2="30" stroke="#8B6914" strokeWidth="2" />
          <rect x="35" y="50" width="110" height="8" rx="2" fill="#F5E6D3" />
          <rect x="35" y="68" width="80" height="6" rx="2" fill="#E8D5C4" />
          <rect x="35" y="84" width="100" height="6" rx="2" fill="#E8D5C4" />
          <rect x="35" y="100" width="70" height="6" rx="2" fill="#E8D5C4" />
          <rect x="48" y="118" width="36" height="16" rx="4" fill="#8B5E34" />
          <circle cx="54" cy="126" r="3" fill="#F5E6D3" />
          <circle cx="66" cy="126" r="3" fill="#F5E6D3" />
          <circle cx="78" cy="126" r="3" fill="#F5E6D3" />
        </g>
        <g transform="translate(180, 40)">
          <rect x="0" y="0" width="50" height="70" rx="6" fill="#C4956A" />
          <rect x="8" y="10" width="34" height="4" rx="1" fill="#8B5E34" />
          <rect x="8" y="20" width="28" height="3" rx="1" fill="#8B5E34" opacity="0.6" />
          <rect x="8" y="28" width="30" height="3" rx="1" fill="#8B5E34" opacity="0.6" />
          <path d="M12 42 L25 55 L42 38" stroke="#6B8E23" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
        <g transform="translate(190, 180)" className="animate-float">
          <circle cx="25" cy="25" r="25" fill="#B07D4E" />
          <path d="M15 25 L22 32 L35 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </svg>
    ),
  },
  {
    id: 2,
    icon: ImageIcon,
    title: '对比前后变化',
    description: '滑动对比改造前后的照片，见证创意的魔力',
    gradient: 'from-forest-500 to-forest-600',
    illustration: (
      <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="150" cy="150" r="120" fill="#DCE8C8" />
        <g transform="translate(40, 60)">
          <rect x="0" y="0" width="90" height="140" rx="10" fill="#C4956A" stroke="#8B5E34" strokeWidth="2" />
          <rect x="10" y="15" width="70" height="50" rx="4" fill="#8B5E34" opacity="0.3" />
          <path d="M10 80 L30 95 L50 75 L70 90 L80 85" stroke="#8B5E34" strokeWidth="2" strokeLinecap="round" fill="none" />
          <rect x="10" y="100" width="70" height="4" rx="1" fill="#8B5E34" opacity="0.5" />
          <rect x="10" y="110" width="50" height="4" rx="1" fill="#8B5E34" opacity="0.5" />
          <rect x="10" y="120" width="60" height="4" rx="1" fill="#8B5E34" opacity="0.5" />
        </g>
        <g transform="translate(130, 60)">
          <rect x="0" y="0" width="90" height="140" rx="10" fill="#9CC46B" stroke="#527019" strokeWidth="2" />
          <rect x="10" y="15" width="70" height="50" rx="4" fill="#7DB347" />
          <path d="M45 25 L45 45 M35 35 L55 35" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <rect x="10" y="75" width="70" height="10" rx="3" fill="#527019" opacity="0.6" />
          <rect x="10" y="92" width="60" height="10" rx="3" fill="#527019" opacity="0.6" />
          <rect x="10" y="109" width="45" height="10" rx="3" fill="#527019" opacity="0.6" />
          <rect x="10" y="126" width="55" height="6" rx="2" fill="#527019" opacity="0.4" />
        </g>
        <g transform="translate(100, 210)">
          <rect x="0" y="0" width="100" height="40" rx="20" fill="white" />
          <rect x="4" y="4" width="44" height="32" rx="16" fill="#C4956A" />
          <rect x="52" y="4" width="44" height="32" rx="16" fill="#7DB347" />
          <circle cx="50" cy="20" r="14" fill="white" stroke="#C4956A" strokeWidth="2" />
          <path d="M44 20 L48 24 L56 16" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
        <g transform="translate(220, 160)" className="animate-float" style={{ animationDelay: '0.5s' }}>
          <circle cx="20" cy="20" r="20" fill="#6B8E23" />
          <path d="M10 20 L17 27 L30 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </svg>
    ),
  },
  {
    id: 3,
    icon: Lightbulb,
    title: '积累环保创意',
    description: '收集灵感，打造专属于你的环保创意宝库',
    gradient: 'from-kraft-500 to-forest-500',
    illustration: (
      <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="bulbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD93D" />
            <stop offset="100%" stopColor="#FF9F43" />
          </linearGradient>
        </defs>
        <circle cx="150" cy="150" r="120" fill="#FFF3CD" />
        <g transform="translate(80, 50)">
          <path d="M70 0 L90 20 L110 0 L130 20 L110 40 L90 20 L70 40 L50 20 Z" fill="#FFD93D" opacity="0.5" />
          <circle cx="90" cy="60" r="45" fill="url(#bulbGradient)" />
          <path d="M75 55 L90 70 L105 55" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M75 75 L90 60 L105 75" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          <rect x="72" y="100" width="36" height="8" rx="2" fill="#8B5E34" />
          <rect x="78" y="108" width="24" height="6" rx="1.5" fill="#6B4523" />
          <rect x="82" y="114" width="16" height="8" rx="2" fill="#4A2F18" />
        </g>
        <g transform="translate(30, 150)">
          <rect x="0" y="20" width="60" height="80" rx="6" fill="#D4A574" />
          <path d="M0 20 L30 0 L60 20" fill="#C4956A" />
          <line x1="30" y1="0" x2="30" y2="20" stroke="#8B6914" strokeWidth="1.5" />
          <rect x="10" y="35" width="40" height="5" rx="1.5" fill="#8B5E34" opacity="0.5" />
          <rect x="10" y="48" width="30" height="4" rx="1" fill="#8B5E34" opacity="0.4" />
          <rect x="10" y="60" width="35" height="4" rx="1" fill="#8B5E34" opacity="0.4" />
          <path d="M30 75 L35 85 L40 78 L45 88" stroke="#6B8E23" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
        <g transform="translate(180, 150)">
          <rect x="0" y="20" width="70" height="80" rx="6" fill="#9CC46B" />
          <rect x="10" y="10" width="50" height="15" rx="4" fill="#7DB347" />
          <circle cx="25" cy="17.5" r="3" fill="#527019" />
          <circle cx="45" cy="17.5" r="3" fill="#527019" />
          <rect x="10" y="40" width="50" height="6" rx="2" fill="#527019" opacity="0.6" />
          <rect x="10" y="54" width="40" height="6" rx="2" fill="#527019" opacity="0.6" />
          <rect x="10" y="68" width="45" height="6" rx="2" fill="#527019" opacity="0.6" />
          <path d="M35 82 L40 92 L45 85 L50 95" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
        <g transform="translate(220, 40)" className="animate-float" style={{ animationDelay: '1s' }}>
          <circle cx="20" cy="20" r="20" fill="#B07D4E" />
          <path d="M20 10 L20 15 M20 25 L20 30 M10 20 L15 20 M25 20 L30 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="20" r="6" fill="white" opacity="0.5" />
        </g>
        <g transform="translate(20, 40)" className="animate-float" style={{ animationDelay: '1.5s' }}>
          <circle cx="18" cy="18" r="18" fill="#6B8E23" />
          <path d="M10 18 L16 24 L26 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </svg>
    ),
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (isAnimating) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < slides.length - 1) {
        goToSlide(currentSlide + 1);
      } else if (diff < 0 && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    }
  };

  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index < 0 || index >= slides.length) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating]);

  const handleGetStarted = useCallback(() => {
    saveToStorage(ONBOARDING_SHOWN_KEY, true);
    navigate('/');
  }, [navigate]);

  const handleSkip = useCallback(() => {
    saveToStorage(ONBOARDING_SHOWN_KEY, true);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToSlide(currentSlide - 1);
      } else if (e.key === 'ArrowRight') {
        goToSlide(currentSlide + 1);
      } else if (e.key === 'Enter' && currentSlide === slides.length - 1) {
        handleGetStarted();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, goToSlide, handleGetStarted]);

  return (
    <div className="min-h-screen bg-paper-cream flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-corrugate opacity-60" />
      <div className="absolute inset-0 bg-paper-texture" />
      
      {currentSlide < slides.length - 1 && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-20 px-4 py-2 text-kraft-600 hover:text-kraft-800 font-medium transition-colors"
        >
          跳过
        </button>
      )}

      <div
        ref={containerRef}
        className="flex-1 flex flex-col relative z-10"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="container flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div
            className="w-full max-w-md"
            style={{
              transform: `translateX(${-currentSlide * 100}%)`,
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="flex">
              {slides.map((slide, index) => {
                const SlideIcon = slide.icon;
                return (
                  <div
                    key={slide.id}
                    className="w-full flex-shrink-0 flex flex-col items-center"
                    aria-hidden={index !== currentSlide}
                  >
                    <div className={cn(
                      'inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br shadow-paper mb-8',
                      slide.gradient
                    )}>
                      <SlideIcon className="w-8 h-8 text-white" />
                    </div>

                    <div className="w-64 h-64 md:w-80 md:h-80 mb-8 animate-float">
                      {slide.illustration}
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold font-display text-kraft-800 text-center mb-4">
                      {slide.title}
                    </h2>
                    <p className="text-kraft-600 text-center text-lg max-w-sm leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  index === currentSlide
                    ? 'w-8 bg-kraft-500'
                    : 'w-2 bg-kraft-300 hover:bg-kraft-400'
                )}
                aria-label={`跳转到第 ${index + 1} 页`}
              />
            ))}
          </div>
        </div>

        <div className="container pb-12 px-6">
          {currentSlide < slides.length - 1 ? (
            <div className="flex items-center justify-between max-w-md mx-auto">
              <button
                onClick={() => goToSlide(currentSlide - 1)}
                className={cn(
                  'px-6 py-3 rounded-xl font-medium transition-all duration-200',
                  currentSlide === 0
                    ? 'text-kraft-300 cursor-not-allowed'
                    : 'text-kraft-600 hover:bg-kraft-100'
                )}
                disabled={currentSlide === 0}
              >
                上一步
              </button>
              <button
                onClick={() => goToSlide(currentSlide + 1)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-kraft-400 to-kraft-500 text-white rounded-xl font-medium shadow-paper hover:shadow-paper-hover hover:-translate-y-0.5 transition-all duration-200"
              >
                下一步
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGetStarted}
              className="w-full max-w-md mx-auto block py-4 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-2xl font-bold text-lg shadow-paper hover:shadow-paper-hover hover:-translate-y-0.5 transition-all duration-200 animate-breathe"
            >
              开始使用
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
