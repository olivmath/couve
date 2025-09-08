import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import LumaScraper from '../lib/lumaScraper';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  url: string;
  attendees?: number;
  category?: string;
  image?: string;
}

const MeridianEventsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Function to load events progressively
  const loadEventsProgressively = async () => {
    try {
      setLoading(true);
      setEvents([]);
      setLoadingProgress(0);
      setError(null);
      
      const eventGenerator = LumaScraper.getEventsProgressively();
      const loadedEvents: Event[] = [];
      
      for await (const event of eventGenerator) {
        loadedEvents.push(event);
        setEvents([...loadedEvents]);
        setLoadingProgress(loadedEvents.length);
        
        // If it's the first event, stop general loading
        if (loadedEvents.length === 1) {
          setLoading(false);
        }
      }
    } catch (err) {
      setError('Falha ao carregar eventos. Tente novamente.');
      console.error('Erro ao buscar eventos:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventsProgressively();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
      }, 5000); // Aumentei para 5 segundos

      return () => clearInterval(timer);
    }
  }, [events.length]);

  const handleEventClick = (url: string) => {
    window.open(url, '_blank');
  };

  // Creative random colors and shapes system
  const getRandomCardStyle = (eventId: string) => {
    // Use event ID as seed for consistency
    const seed = eventId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const gradients = [
      'from-pink-500 via-rose-500 to-orange-500',
      'from-purple-600 via-blue-600 to-cyan-500',
      'from-green-500 via-emerald-500 to-teal-500',
      'from-indigo-600 via-purple-600 to-pink-500',
      'from-yellow-500 via-orange-500 to-red-500',
      'from-blue-600 via-indigo-600 to-purple-700',
      'from-emerald-500 via-green-500 to-lime-500',
      'from-rose-500 via-pink-500 to-purple-500',
      'from-cyan-500 via-blue-500 to-indigo-600',
      'from-amber-500 via-yellow-500 to-orange-600'
    ];
    
    const patterns = [
      // Floating circles
      {
        elements: [
          { shape: 'circle', size: 'w-32 h-32', position: 'top-0 right-0 -translate-y-16 translate-x-16', opacity: 'opacity-20' },
          { shape: 'circle', size: 'w-24 h-24', position: 'bottom-0 left-0 translate-y-12 -translate-x-12', opacity: 'opacity-15' },
          { shape: 'circle', size: 'w-16 h-16', position: 'top-1/2 left-1/2 -translate-x-8 -translate-y-8', opacity: 'opacity-25' }
        ]
      },
      // Geometric shapes
      {
        elements: [
          { shape: 'square', size: 'w-28 h-28', position: 'top-0 right-0 -translate-y-14 translate-x-14 rotate-45', opacity: 'opacity-20' },
          { shape: 'triangle', size: 'w-20 h-20', position: 'bottom-0 left-0 translate-y-10 -translate-x-10', opacity: 'opacity-15' },
          { shape: 'diamond', size: 'w-12 h-12', position: 'top-1/3 right-1/3 rotate-12', opacity: 'opacity-30' }
        ]
      },
      // Ondas abstratas
      {
        elements: [
          { shape: 'wave', size: 'w-40 h-20', position: 'top-0 left-0 -translate-y-10 -translate-x-10 rotate-12', opacity: 'opacity-20' },
          { shape: 'wave', size: 'w-32 h-16', position: 'bottom-0 right-0 translate-y-8 translate-x-8 -rotate-12', opacity: 'opacity-15' },
          { shape: 'circle', size: 'w-6 h-6', position: 'top-1/4 left-1/4', opacity: 'opacity-40' }
        ]
      },
      // Hexagons
      {
        elements: [
          { shape: 'hexagon', size: 'w-24 h-24', position: 'top-0 right-0 -translate-y-12 translate-x-12', opacity: 'opacity-25' },
          { shape: 'hexagon', size: 'w-16 h-16', position: 'bottom-0 left-0 translate-y-8 -translate-x-8 rotate-30', opacity: 'opacity-20' },
          { shape: 'circle', size: 'w-8 h-8', position: 'top-2/3 right-1/3', opacity: 'opacity-35' }
        ]
      },
      // Stars and organic shapes
      {
        elements: [
          { shape: 'star', size: 'w-20 h-20', position: 'top-0 right-0 -translate-y-10 translate-x-10', opacity: 'opacity-25' },
          { shape: 'blob', size: 'w-28 h-28', position: 'bottom-0 left-0 translate-y-14 -translate-x-14', opacity: 'opacity-15' },
          { shape: 'circle', size: 'w-4 h-4', position: 'top-1/2 right-1/4', opacity: 'opacity-40' }
        ]
      }
    ];
    
    const gradientIndex = seed % gradients.length;
    const patternIndex = (seed * 3) % patterns.length;
    
    return {
      gradient: gradients[gradientIndex],
      pattern: patterns[patternIndex]
    };
  };
  
  const renderShape = (element: any, index: number) => {
     const animations = [
       'animate-pulse',
       'animate-bounce',
       'animate-spin',
       'animate-ping',
       ''
     ];
     
     const animationClass = animations[index % animations.length];
     const baseClasses = `absolute bg-white ${element.size} ${element.position} ${element.opacity} transition-all duration-1000 ${animationClass}`;
     
     switch (element.shape) {
       case 'circle':
         return <div key={index} className={`${baseClasses} rounded-full`} />;
       case 'square':
         return <div key={index} className={`${baseClasses} rounded-lg`} />;
       case 'triangle':
         return (
           <div key={index} className={`${baseClasses} rounded-sm`} 
                style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
         );
       case 'diamond':
         return (
           <div key={index} className={`${baseClasses} rounded-sm rotate-45`} />
         );
       case 'hexagon':
         return (
           <div key={index} className={`${baseClasses} rounded-sm`}
                style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' }} />
         );
       case 'star':
         return (
           <div key={index} className={`${baseClasses} rounded-sm`}
                style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
         );
       case 'wave':
         return (
           <div key={index} className={`${baseClasses} rounded-full`}
                style={{ borderRadius: '50% 20% 50% 20%' }} />
         );
       case 'blob':
         return (
           <div key={index} className={`${baseClasses}`}
                style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }} />
         );
       default:
         return <div key={index} className={`${baseClasses} rounded-full`} />;
     }
   };

  if (loading) {
    return (
      <div className="relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-2 animate-pulse"></div>
            <h3 className="text-base font-bold text-gray-800">Meridian 2025 Side Events</h3>
          </div>
          <div className="text-xs text-purple-600 font-medium">Rio de Janeiro 🇧🇷</div>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-purple-700 font-medium">Buscando eventos...</p>
          <p className="text-purple-600 text-sm mt-2">Preparando carregamento progressivo</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mr-2"></div>
            <h3 className="text-base font-bold text-gray-800">Meridian 2025 Side Events</h3>
          </div>
          <div className="text-xs text-purple-600 font-medium">Rio de Janeiro 🇧🇷</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 text-center border border-red-200">
          <p className="text-red-700 font-medium mb-4">{error}</p>
          <button 
            onClick={loadEventsProgressively}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <h3 className="text-lg font-bold text-gray-800">Meridian 2025 Side Events</h3>
          {loadingProgress > 0 && loadingProgress < 6 && (
            <div className="ml-3 flex items-center">
              <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full mr-2"></div>
              <span className="text-xs text-purple-600">Carregando mais...</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-purple-600 font-medium">Rio de Janeiro 🇧🇷</div>
          <div className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-semibold">
            {events.length} eventos{loadingProgress > events.length ? ` (${loadingProgress} carregados)` : ''}
          </div>
        </div>
      </div>
      
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {events.map((event) => {
          const cardStyle = getRandomCardStyle(event.id);
          return (
          <div key={event.id} className="w-full flex-shrink-0 pr-4">
            <Card 
              className={`bg-gradient-to-br ${cardStyle.gradient} border-0 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] transform-gpu overflow-hidden relative rounded-2xl group`}
              onClick={() => handleEventClick(event.url)}
            >
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              {/* Creative Random Background Pattern */}
              <div className="absolute inset-0">
                {cardStyle.pattern.elements.map((element, index) => renderShape(element, index))}
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              <CardContent className="p-6 relative z-10">
                <div className="flex flex-col h-full">
                  {/* Nome do Evento */}
                  <h4 className="font-bold text-white text-xl mb-4 leading-tight drop-shadow-sm">
                    {event.title}
                  </h4>
                  
                  {/* Data e Lugar */}
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center text-white/90 text-sm">
                      <Calendar className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center text-white/90 text-sm">
                      <MapPin className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="font-medium">{event.location}</span>
                    </div>
                  </div>
                  
                  {/* Registration Button */}
                  <div className="mt-auto">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event.url);
                      }}
                      className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>Se Inscrever</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          );
        })}
      </div>
      
      {/* Enhanced Navigation Dots */}
      <div className="flex justify-center items-center mt-8 space-x-2">
        {events.map((event, index) => (
          <button
            key={index}
            className={`group transition-all duration-500 rounded-full relative ${
              index === currentIndex 
                ? 'w-12 h-4 bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg' 
                : 'w-4 h-4 bg-purple-200 hover:bg-purple-300 hover:scale-110'
            }`}
            onClick={() => setCurrentIndex(index)}
            title={event.title}
          >
            {index === currentIndex && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse opacity-50"></div>
            )}
            <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-white/20 to-white/10' 
                : 'group-hover:bg-white/20'
            }`}></div>
          </button>
        ))}
      </div>
      

      
      {/* Event Counter */}
      <div className="text-center mt-3">
        <span className="text-xs text-purple-600 font-medium">
          {currentIndex + 1} de {events.length}
        </span>
      </div>
    </div>
  );
};

export default MeridianEventsCarousel;