import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  CloudRain, 
  CreditCard, 
  Trash2,
  Volume2
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { notificationService, AppNotification } from '../../services/notificationService';
import { speakAnnouncement } from '../../utils/speech';

interface FarmerNotificationsViewProps {
  language: LanguageCode;
  onNavigateToTab?: (tab: string) => void;
}

export const FarmerNotificationsView: React.FC<FarmerNotificationsViewProps> = ({
  language,
  onNavigateToTab
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => notificationService.getAll());

  useEffect(() => {
    const unsub = notificationService.subscribe(updated => setNotifications(updated));
    return unsub;
  }, []);

  const handleRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const handleSpeak = (notif: AppNotification) => {
    const text = language === 'hi' ? `${notif.titleHi}. ${notif.bodyHi}` : `${notif.title}. ${notif.body}`;
    speakAnnouncement(text, language === 'hi' ? 'hi' : 'en');
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'QUEUE_UPDATED':
      case 'ARRIVAL_REMINDER':
        return <Clock className="w-5 h-5 text-emerald-600" />;
      case 'LATE_STATUS':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'PAYMENT_UPDATED':
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'WEATHER_ALERT':
        return <CloudRain className="w-5 h-5 text-indigo-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-[#168A5B]" />;
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#D7E3DC]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#168A5B]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#063B2A]">
              {language === 'hi' ? 'सूचनाएं व अलर्ट (Notifications)' : 'Alerts & Notifications'}
            </h2>
            <p className="text-xs text-[#063B2A]/70">
              {language === 'hi' ? 'कतार, मौसम व भुगतान से जुड़ी महत्वपूर्ण जानकारी' : 'Queue updates, weather advisories & DBT payouts'}
            </p>
          </div>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={() => notificationService.markAllAsRead()}
            className="text-xs font-semibold text-[#168A5B] hover:underline px-2 py-1"
          >
            {language === 'hi' ? 'सभी पढ़ी चिह्नित करें' : 'Mark all as read'}
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {notifications.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-[#D7E3DC] text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-medium text-[#063B2A]/80">
              {language === 'hi' ? 'कोई नई सूचना नहीं है' : 'No new notifications'}
            </p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                notif.isRead 
                  ? 'bg-white border-[#D7E3DC]' 
                  : 'bg-[#F0FDF4] border-emerald-300 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-[#D7E3DC] shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#063B2A] truncate">
                      {language === 'hi' ? notif.titleHi : notif.title}
                    </h3>
                    <span className="text-[11px] text-[#063B2A]/60 shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-[#063B2A]/80 mt-1">
                    {language === 'hi' ? notif.bodyHi : notif.body}
                  </p>

                  <div className="flex items-center gap-3 mt-3 pt-2 border-t border-[#D7E3DC]/60">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(notif);
                      }}
                      className="text-xs font-semibold text-[#168A5B] hover:text-[#0B5D3B] flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'बोलकर सुनें' : 'Listen'}</span>
                    </button>

                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                      Channel: {notif.channel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
