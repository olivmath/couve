import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Calendar, MapPin, ExternalLink, Users } from 'lucide-react';
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

  // Função para buscar eventos usando o LumaScraper
  const fetchEventsFromLuma = async () => {
    try {
      // Usar o LumaScraper para buscar eventos dinamicamente
      const events = await LumaScraper.getEvents();
      return events;
    } catch (error) {
      console.error('Erro ao buscar eventos via scraping:', error);
      // Retorna dados mockados como fallback
      return [
        {
          id: '1',
          title: "Blendy's Night Out",
          date: 'Sep 15, 7:30 PM',
          location: 'Rio de Janeiro, RJ',
          description: 'Join us for an evening of networking and fun at Meridian 2025 side event.',
          url: 'https://luma.com/meridian-2025-side-events?k=c',
          attendees: 127,
          category: 'Networking',
          image: '/api/placeholder/400/200'
        },
        {
          id: '2', 
          title: 'A Normal Hike and Brazilian Cuisine',
          date: 'Sep 16, 10:00 AM',
          location: 'Christ the Redeemer',
          description: 'Experience Rio\'s beauty with fellow Stellar community members.',
          url: 'https://luma.com/meridian-2025-side-events?k=c',
          attendees: 89,
          category: 'Adventure',
          image: '/api/placeholder/400/200'
        },
        {
          id: '3',
          title: 'Sunset with Stellar Ambassadors', 
          date: 'Sep 16, 5:00 PM',
          location: 'Via 11',
          description: 'Watch the sunset while discussing the future of Stellar ecosystem.',
          url: 'https://luma.com/meridian-2025-side-events?k=c',
          attendees: 156,
          category: 'Community',
          image: '/api/placeholder/400/200'
        },
        {
          id: '4',
          title: 'Morning Miles in Rio',
          date: 'Sep 17, 8:15 AM', 
          location: 'Rio de Janeiro, RJ',
          description: 'Start your day with a refreshing run through Rio\'s scenic routes.',
          url: 'https://luma.com/meridian-2025-side-events?k=c',
          attendees: 73,
          category: 'Fitness',
          image: '/api/placeholder/400/200'
        },
        {
          id: '5',
          title: 'Meridian 2025 Conference',
          date: 'Sep 17-18',
          location: 'Copacabana Palace, Rio de Janeiro', 
          description: 'The main Stellar conference bringing together industry leaders and innovators.',
          url: 'https://meridian.stellar.org',
          attendees: 2500,
          category: 'Conference',
          image: '/api/placeholder/400/200'
        }
      ];
    }
  };

  // Função principal para buscar eventos
  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const eventsData = await fetchEventsFromLuma();
      setEvents(eventsData);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar eventos. Tente novamente.');
      console.error('Erro ao buscar eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
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

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Networking': return 'from-pink-500 to-rose-500';
      case 'Adventure': return 'from-green-500 to-emerald-500';
      case 'Community': return 'from-blue-500 to-cyan-500';
      case 'Fitness': return 'from-orange-500 to-amber-500';
      case 'Conference': return 'from-purple-600 to-indigo-600';
      default: return 'from-purple-600 to-blue-600';
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
          <p className="text-purple-700 font-medium">Carregando eventos...</p>
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
            onClick={fetchEvents}
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
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-purple-600 font-medium">Rio de Janeiro 🇧🇷</div>
          <div className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-semibold">
            {events.length} eventos
          </div>
        </div>
      </div>
      
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {events.map((event) => (
          <div key={event.id} className="w-full flex-shrink-0 pr-4">
            <Card 
              className={`bg-gradient-to-br ${getCategoryColor(event.category)} border-0 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] transform-gpu overflow-hidden relative rounded-2xl`}
              onClick={() => handleEventClick(event.url)}
            >
              {/* Enhanced Background Pattern */}
              <div className="absolute inset-0 opacity-15">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16"></div>
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12 opacity-50"></div>
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="inline-block bg-white/25 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-white text-xs font-bold tracking-wide">{event.category?.toUpperCase() || 'STELLAR EVENT'}</span>
                      </div>
                      {event.attendees && (
                        <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <Users className="h-3 w-3 mr-1 text-white" />
                          <span className="text-white text-xs font-semibold">{event.attendees}</span>
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-xl mb-3 leading-tight drop-shadow-sm">
                      {event.title}
                    </h4>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-white/90 text-sm">
                        <Calendar className="h-4 w-4 mr-3 flex-shrink-0" />
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <div className="flex items-center text-white/90 text-sm">
                        <MapPin className="h-4 w-4 mr-3 flex-shrink-0" />
                        <span className="font-medium truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/25 backdrop-blur-sm rounded-full p-3 hover:bg-white/35 transition-colors">
                    <ExternalLink className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-white/95 text-sm leading-relaxed mb-5 line-clamp-2">
                  {event.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="bg-white/25 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <span className="text-white text-xs font-bold tracking-wide">EVENTO GRATUITO</span>
                  </div>
                  <div className="flex items-center text-white/90 text-sm font-medium">
                    <span className="mr-2">Participar</span>
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
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