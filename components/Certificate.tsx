import React, { useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

// This informs TypeScript that the htmlToImage library is available globally, loaded from the CDN in index.html.
declare var htmlToImage: any;

interface CertificateProps {
  name: string;
  avgWpm: number;
  avgAcc: number;
  totalTime: number;
  testsCompleted: number;
  quoteKey: string;
  onClose: () => void;
}

const CertificateBorder = () => (
    <svg className="absolute inset-0 w-full h-full text-[#a88a38]" fill="none" xmlns="http://www.w.org/2000/svg" preserveAspectRatio="none">
        <defs>
            <g id="corner-flourish">
                <path d="M 40 2 L 2 40" stroke="currentColor" strokeWidth="1" />
                <path d="M 2 2 L 50 2 C 20 2, 2 20, 2 50 L 2 2 Z" fill="currentColor" fillOpacity="0.05" />
                <path d="M 30 15 C 25 25, 25 35, 35 40" stroke="currentColor" strokeWidth="0.5" />
                <path d="M 15 30 C 25 25, 35 25, 40 35" stroke="currentColor" strokeWidth="0.5" />
            </g>
        </defs>
        
        {/* Main Frame */}
        <rect x="1%" y="1%" width="98%" height="98%" stroke="currentColor" strokeWidth="3" />
        <rect x="1.5%" y="1.5%" width="97%" height="97%" stroke="currentColor" strokeWidth="0.5" />

        {/* Corners using the defined flourish */}
        <use href="#corner-flourish" x="1.5%" y="1.5%" />
        <use href="#corner-flourish" transform="translate(98.5%, 1.5%) scale(-1, 1)" />
        <use href="#corner-flourish" transform="translate(1.5%, 98.5%) scale(1, -1)" />
        <use href="#corner-flourish" transform="translate(98.5%, 98.5%) scale(-1, -1)" />
    </svg>
);


const Watermark = () => (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <span 
            className="font-script text-[12rem] text-[#4a4a4a]/[0.04] -translate-y-4 select-none transform -rotate-30 whitespace-nowrap"
            aria-hidden="true"
        >
            TypingTest.App
        </span>
    </div>
);

const Seal = () => {
    // Dynamically creates a path for a circle with a serrated edge.
    const createSerratedEdge = (cx: number, cy: number, r: number, points: number): string => {
        let path = "M ";
        for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI) / points;
            const radius = i % 2 === 0 ? r : r - 3; // Alternate between outer and inner radius for the points
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            path += `${x},${y} `;
        }
        path += "Z";
        return path;
    };

    const serratedPath = createSerratedEdge(50, 50, 50, 36);

    return (
        <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Ribbon */}
            <div className="absolute w-20 h-24">
                <div className="absolute bottom-0 left-0 w-8 h-16 bg-[#a60000] transform -rotate-25 origin-bottom-left shadow-md"></div>
                <div className="absolute bottom-0 right-0 w-8 h-16 bg-[#800000] transform rotate-25 origin-bottom-right shadow-md"></div>
            </div>
            {/* Gold Foil Seal */}
            <svg className="relative w-24 h-24" viewBox="0 0 100 100">
                <defs>
                    <radialGradient id="gold_gradient_enhanced" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="50%" stopColor="#facc15" />
                        <stop offset="85%" stopColor="#ca8a04" />
                        <stop offset="100%" stopColor="#854d0e" />
                    </radialGradient>
                </defs>
                <path d={serratedPath} fill="url(#gold_gradient_enhanced)" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#b45309" strokeWidth="1" strokeOpacity="0.7" />
                <text x="50" y="58" textAnchor="middle" fontSize="40" fill="#fff" fontWeight="bold" className="font-mono drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">★</text>
            </svg>
        </div>
    );
};


const Certificate: React.FC<CertificateProps> = ({ name, avgWpm, avgAcc, testsCompleted, quoteKey, onClose }) => {
  const { t } = useLanguage();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = async () => {
    const node = certificateRef.current;
    if (!node || isDownloading) {
        return;
    }
    setIsDownloading(true);

    const filter = (node: HTMLElement) => {
        if (node.tagName === 'LINK' && node.getAttribute('rel') === 'stylesheet' && node.getAttribute('href')?.startsWith('https://fonts.googleapis.com')) {
            return false;
        }
        return true;
    };

    try {
        // Only fetch the fonts necessary for the certificate itself to be efficient.
        const FONT_URL = "https://fonts.googleapis.com/css2?family=Great+Vibes&family=EB+Garamond:ital,wght@0,400;0,700;1,400&display=swap";

        // This function fetches font files referenced in a stylesheet and converts them to embeddable data URIs.
        const embedFonts = async (cssText: string): Promise<string> => {
            const fontUrls = cssText.match(/url\(https?:\/\/[^)]+\)/g) || [];
            const fontPromises = fontUrls.map(async (url) => {
                // Extract the clean URL from the CSS `url(...)` syntax.
                const fontUrl = url.replace(/url\((['"])?(.*?)\1\)/, '$2');
                try {
                    const response = await fetch(fontUrl);
                    if (!response.ok) throw new Error(`Failed to fetch ${fontUrl}: ${response.statusText}`);
                    const blob = await response.blob();
                    return new Promise<[string, string]>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve([url, `url(${reader.result})`]);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                } catch (e) {
                    console.error('Failed to fetch and embed font:', fontUrl, e);
                    return [url, url]; // Fallback to the original URL on error.
                }
            });
            const fontDataUris = await Promise.all(fontPromises);
            let newCssText = cssText;
            fontDataUris.forEach(([originalUrl, dataUri]) => {
                newCssText = newCssText.replace(originalUrl, dataUri);
            });
            return newCssText;
        };
        
        const fontCssResponse = await fetch(FONT_URL);
        if (!fontCssResponse.ok) throw new Error(`Failed to fetch font stylesheet: ${fontCssResponse.statusText}`);
        const fontCssText = await fontCssResponse.text();
        const embeddedFontCss = await embedFonts(fontCssText);

        const dataUrl = await htmlToImage.toPng(node, {
            pixelRatio: 2,
            fontEmbedCss: embeddedFontCss,
            width: node.offsetWidth,
            height: node.offsetHeight,
            backgroundColor: '#fdfbf2',
            filter: filter,
        });

        const link = document.createElement('a');
        link.download = `Typing-Certificate-${name.replace(/\s+/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Error generating certificate image with embedded fonts, trying fallback:', error);
        // Fallback to the simpler download method if font embedding fails for any reason.
        try {
            if (certificateRef.current) {
                const dataUrl = await htmlToImage.toPng(certificateRef.current, { pixelRatio: 2, filter: filter });
                const link = document.createElement('a');
                link.download = `Typing-Certificate-${name.replace(/\s+/g, '-')}.png`;
                link.href = dataUrl;
                link.click();
            }
        } catch (fallbackError) {
             console.error('Fallback download method also failed:', fallbackError);
        }
    } finally {
        setIsDownloading(false);
    }
  };

  const getAchievementRank = (wpm: number): string => {
    if (wpm >= 80) return t('certificate.rank.virtuoso');
    if (wpm >= 60) return t('certificate.rank.expert');
    if (wpm >= 40) return t('certificate.rank.proficient');
    return t('certificate.rank.dedicated');
  };

  const rank = getAchievementRank(avgWpm);
  const quote = t(quoteKey);

  const statsText = t('certificate.statsLine')
    .replace('{{wpm}}', `<strong class="text-[#b8860b]">${avgWpm}</strong>`)
    .replace('{{accuracy}}', `<strong class="text-[#b8860b]">${avgAcc}</strong>`)
    .replace('{{tests}}', `<strong class="text-[#b8860b]">${testsCompleted}</strong>`);

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in print-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-title"
    >
      <div 
        ref={certificateRef}
        className="bg-[#fdfbf2] text-[#4a4a4a] p-4 rounded-lg shadow-2xl max-w-4xl w-[95%] aspect-[1.414/1] relative font-serif-cert print-certificate"
        style={{ backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)` }}
        onClick={e => e.stopPropagation()} 
      >
        <CertificateBorder />
        <Watermark />
        <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8">
            
            <div className="absolute top-2 right-2 no-print">
                 <button 
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
                  aria-label={t('certificate.close')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            </div>

            <h1 id="certificate-title" className="text-4xl md:text-5xl font-bold text-[#4a4a4a]">
              {t('certificate.title')}
            </h1>
            <p className="mt-4 text-lg text-gray-600">{t('certificate.certifyLine')}</p>

            <p className="text-5xl md:text-7xl font-script text-[#b8860b] my-4 md:my-6 tracking-wide">
                {name}
            </p>

            <p className="text-lg text-gray-600">{t('certificate.achievedRankLine')}</p>
            <p className="text-2xl md:text-3xl font-bold text-[#4a4a4a] my-2">{rank}</p>

            <p 
                className="max-w-xl mx-auto my-2 text-base text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: statsText }}
            />
            
            <blockquote className="mt-4 border-l-4 border-[#b8860b]/50 pl-4 italic text-gray-600 max-w-lg">
                <p>{quote}</p>
            </blockquote>
            
            <div className="mt-auto flex justify-between items-center w-full pt-4">
                <div className="text-center w-48">
                    <p className="text-md text-gray-600 h-6">{new Date().toLocaleDateString()}</p>
                    <div className="border-b-2 border-gray-400 mt-1"></div>
                    <p className="text-sm text-gray-700 font-bold pt-1">{t('certificate.dateOfIssue')}</p>
                </div>
                
                <Seal />
                
                <div className="text-center w-48">
                    <p className="text-md text-gray-600 font-script text-2xl h-6">{t('certificate.signatureName')}</p>
                    <div className="border-b-2 border-gray-400 mt-1"></div>
                    <p className="text-sm text-gray-700 font-bold pt-1">{t('certificate.signature')}</p>
                </div>
            </div>
        </div>
      </div>
       <div className="absolute bottom-4 right-4 flex gap-4 no-print">
            <button 
                onClick={handleDownload}
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors shadow-lg disabled:bg-blue-400 disabled:cursor-wait w-36 text-center"
                disabled={isDownloading}
            >
                {isDownloading ? t('certificate.downloading') : t('certificate.download')}
            </button>
            <button 
                onClick={handlePrint}
                className="px-6 py-2 bg-white text-gray-800 font-bold rounded-md hover:bg-gray-200 transition-colors shadow-lg"
            >
                {t('certificate.print')}
            </button>
      </div>
    </div>
  );
};

export default Certificate;