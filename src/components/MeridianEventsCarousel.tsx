import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  url: string;
}

const MeridianEventsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const events: Event[] = [
    {
      id: '1',
      title: "Blendy's Night Out",
      date: 'Sep 15, 7:30 PM',
      location: 'Rio de Janeiro, RJ',
      description: 'Join us for an evening of networking and fun at Meridian 2025 side event.',
      url: 'https://luma.com/meridian-2025-side-events?k=c'
    },
    {
      id: '2', 
      title: 'A Normal Hike and Brazilian Cuisine',
      date: 'Sep 16, 10:00 AM',
      location: 'Christ the Redeemer',
      description: 'Experience Rio\'s beauty with fellow Stellar community members.',
      url: 'https://luma.com/meridian-2025-side-events?k=c'
    },
    {
      id: '3',
      title: 'Sunset with Stellar Ambassadors', 
      date: 'Sep 16, 5:00 PM',
      location: 'Via 11',
      description: 'Watch the sunset while discussing the future of Stellar ecosystem.',
      url: 'https://luma.com/meridian-2025-side-events?k=c'
    },
    {
      id: '4',
      title: 'Morning Miles in Rio',
      date: 'Sep 17, 8:15 AM', 
      location: 'Rio de Janeiro, RJ',
      description: 'Start your day with a refreshing run through Rio\'s scenic routes.',
      url: 'https://luma.com/meridian-2025-side-events?k=c'
    },
    {
      id: '5',
      title: 'Meridian 2025 Conference',
      date: 'Sep 17-18',
      location: 'Rio de Janeiro, RJ', 
      description: 'The main Stellar conference bringing together industry leaders and innovators.',
      url: 'https://meridian.stellar.org'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [events.length]);

  const handleEventClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-2 animate-pulse"></div>
          <h3 className="text-base font-bold text-gray-800">Meridian 2025 Side Events</h3>
        </div>
        <div className="text-xs text-purple-600 font-medium">Rio de Janeiro 🇧🇷</div>
      </div>
      
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {events.map((event) => (
          <div key={event.id} className="w-full flex-shrink-0 pr-3">
            <Card 
              className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 border-0 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] transform-gpu overflow-hidden relative"
              onClick={() => handleEventClick(event.url)}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
              </div>
              
              <CardContent className="p-5 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
                      <span className="text-white text-xs font-semibold">STELLAR EVENT</span>
                    </div>
                    <h4 className="font-bold text-white text-lg mb-2 leading-tight">
                      {event.title}
                    </h4>
                    <div className="flex items-center text-purple-100 text-sm mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center text-purple-100 text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="font-medium truncate">{event.location}</span>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <ExternalLink className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-purple-50 text-sm leading-relaxed mb-4">
                  {event.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-white text-xs font-semibold">FREE EVENT</span>
                  </div>
                  <div className="text-white text-xs font-medium opacity-80">
                    Tap to join →
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      
      {/* Enhanced Dots indicator */}
      <div className="flex justify-center mt-6 space-x-3">
        {events.map((_, index) => (
          <button
            key={index}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? 'w-8 h-3 bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg' 
                : 'w-3 h-3 bg-purple-200 hover:bg-purple-300'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default MeridianEventsCarousel;