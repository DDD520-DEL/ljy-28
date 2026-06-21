import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
  ArrowRight,
  Star,
} from 'lucide-react';
import { useBoxStore } from '@/store/useBoxStore';
import { CATEGORY_LABELS, DIFFICULTY_LABELS, DIFFICULTY_ICONS } from '@/constants';
import type { BoxRecord } from '@/types';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function sameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default function CalendarView() {
  const navigate = useNavigate();
  const { records, init, isLoaded, isFavorite, toggleFavorite } = useBoxStore();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalRecords, setModalRecords] = useState<BoxRecord[]>([]);

  useEffect(() => {
    if (!isLoaded) {
      init();
    }
  }, [init, isLoaded]);

  const recordsByDate = useMemo(() => {
    const map: Record<string, BoxRecord[]> = {};
    records.forEach((record) => {
      const date = new Date(record.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(record);
    });
    return map;
  }, [records]);

  const calendarCells = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const cells: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(new Date(viewYear, viewMonth, day));
    }

    const remaining = 42 - cells.length;
    for (let i = 0; i < remaining; i++) {
      cells.push(null);
    }

    return cells;
  }, [viewYear, viewMonth]);

  const monthStats = useMemo(() => {
    let count = 0;
    records.forEach((r) => {
      const d = new Date(r.createdAt);
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        count++;
      }
    });
    return { count };
  }, [records, viewYear, viewMonth]);

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  const handleDateClick = (date: Date) => {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const dayRecords = recordsByDate[key] || [];
    setSelectedDate(date);
    setModalRecords(dayRecords);
  };

  const closeModal = () => {
    setSelectedDate(null);
    setModalRecords([]);
  };

  const monthLabel = `${viewYear}年${viewMonth + 1}月`;

  return (
    <div className="min-h-screen bg-paper-cream flex flex-col">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-kraft-100">
        <div className="container flex items-center gap-3 h-14">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-kraft-100 transition-colors text-kraft-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-kraft-500" />
            <h1 className="text-lg font-bold font-display text-kraft-800">日历视图</h1>
          </div>
        </div>
      </header>

      <main className="container py-6 pb-20 flex-1">
        <div className="card-kraft p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goPrevMonth}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-kraft-50 hover:bg-kraft-100 text-kraft-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold font-display text-kraft-800">
                {monthLabel}
              </h2>
              <p className="text-xs md:text-sm text-kraft-500 mt-0.5">
                本月记录 <span className="font-semibold text-kraft-700">{monthStats.count}</span> 条
              </p>
            </div>
            <button
              onClick={goNextMonth}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-kraft-50 hover:bg-kraft-100 text-kraft-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={goToday}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs md:text-sm font-medium text-kraft-600 bg-kraft-50 rounded-full hover:bg-kraft-100 transition-colors border border-kraft-200"
            >
              回到今天
            </button>
          </div>
        </div>

        <div className="card-kraft p-3 md:p-5 overflow-hidden">
          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-3">
            {WEEKDAYS.map((day, idx) => (
              <div
                key={day}
                className={cn(
                  'text-center text-xs md:text-sm font-medium py-2 rounded-lg',
                  idx === 0 || idx === 6
                    ? 'text-rose-500 bg-rose-50/60'
                    : 'text-kraft-600 bg-kraft-50/60'
                )}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {calendarCells.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
              const dayRecords = recordsByDate[key] || [];
              const hasRecords = dayRecords.length > 0;
              const firstRecord = dayRecords[0];
              const isToday = sameDay(date, today);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;

              return (
                <button
                  key={key}
                  onClick={() => hasRecords && handleDateClick(date)}
                  disabled={!hasRecords}
                  className={cn(
                    'aspect-square relative rounded-xl transition-all duration-200 overflow-hidden',
                    'flex flex-col items-center justify-start p-1 md:p-1.5',
                    hasRecords
                      ? 'cursor-pointer hover:shadow-paper-hover hover:-translate-y-0.5 bg-white border-2 border-kraft-200 hover:border-kraft-400'
                      : 'bg-kraft-50/40 border border-kraft-100',
                    isToday && !hasRecords && 'bg-kraft-100 border-kraft-300'
                  )}
                >
                  <span
                    className={cn(
                      'text-[10px] md:text-xs font-medium w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full mb-0.5 flex-shrink-0',
                      isToday
                        ? 'bg-kraft-500 text-white shadow-sm'
                        : isWeekend
                        ? 'text-rose-400'
                        : 'text-kraft-500'
                    )}
                  >
                    {date.getDate()}
                  </span>

                  {hasRecords && firstRecord && (
                    <div className="flex-1 w-full min-h-0 flex flex-col items-center justify-center gap-0.5">
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-kraft-100 flex-shrink-0 ring-1 ring-kraft-200">
                        <img
                          src={firstRecord.afterImage}
                          alt={firstRecord.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[9px] md:text-[10px] font-bold text-kraft-800 leading-none truncate w-full text-center px-0.5">
                        {firstRecord.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {dayRecords.length > 1 && (
                    <span className="absolute top-0.5 right-0.5 md:top-1 md:right-1 min-w-[16px] md:min-w-[18px] h-4 md:h-[18px] px-1 rounded-full bg-gradient-to-br from-kraft-400 to-kraft-500 text-white text-[9px] md:text-[10px] font-bold flex items-center justify-center shadow-sm">
                      +{dayRecords.length - 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 card-kraft p-4">
          <div className="flex items-center gap-3 flex-wrap text-xs md:text-sm text-kraft-500">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-kraft-500" />
              <span>今天</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-white border-2 border-kraft-300" />
              <span>有记录的日期</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-5 rounded-full bg-gradient-to-br from-kraft-400 to-kraft-500 text-[9px] text-white flex items-center justify-center font-bold">
                +2
              </div>
              <span>当日还有更多记录</span>
            </div>
          </div>
        </div>
      </main>

      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-t-3xl md:rounded-3xl shadow-xl w-full md:max-w-lg max-h-[85vh] md:max-h-[80vh] flex flex-col animate-slide-up">
            <div className="sticky top-0 bg-white rounded-t-3xl border-b border-kraft-100 px-5 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-lg font-bold font-display text-kraft-800">
                  {formatDate(selectedDate.toISOString())}
                </h3>
                <p className="text-xs text-kraft-500 mt-0.5">
                  共 <span className="font-semibold text-kraft-700">{modalRecords.length}</span> 条记录
                </p>
              </div>
              <button
                onClick={closeModal}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-kraft-50 hover:bg-kraft-100 text-kraft-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4">
              {modalRecords.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-kraft-100 flex items-center justify-center">
                    <CalendarIcon className="w-8 h-8 text-kraft-400" />
                  </div>
                  <p className="text-kraft-500">这一天还没有改造记录</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {modalRecords.map((record, idx) => {
                    const favorited = isFavorite(record.id);
                    return (
                      <div
                        key={record.id}
                        onClick={() => {
                          closeModal();
                          navigate(`/detail/${record.id}`);
                        }}
                        className="card-paper p-3 flex gap-3 cursor-pointer hover:shadow-paper-hover hover:-translate-y-0.5 transition-all duration-200"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-kraft-100 flex-shrink-0 ring-1 ring-kraft-200">
                          <img
                            src={record.afterImage}
                            alt={record.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-kraft-800 line-clamp-1 text-sm md:text-base">
                              {record.name}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(record.id);
                              }}
                              className={cn(
                                'flex-shrink-0 p-1 rounded-lg transition-colors',
                                favorited
                                  ? 'text-amber-500 hover:bg-amber-50'
                                  : 'text-kraft-400 hover:text-amber-500 hover:bg-amber-50'
                              )}
                            >
                              <Star
                                className={cn(
                                  'w-4 h-4 md:w-5 md:h-5',
                                  favorited && 'fill-current'
                                )}
                              />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-1.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-kraft-100 text-kraft-700">
                              {CATEGORY_LABELS[record.category]}
                            </span>
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-amber-50 text-amber-700">
                              <span className="text-[10px]">{DIFFICULTY_ICONS[record.difficulty]}</span>
                              {DIFFICULTY_LABELS[record.difficulty]}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-kraft-500 line-clamp-2 mb-auto">
                            {record.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] md:text-xs text-kraft-400">
                              {new Date(record.createdAt).toLocaleTimeString('zh-CN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span className="inline-flex items-center gap-0.5 text-[10px] md:text-xs font-medium text-kraft-600">
                              查看
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {modalRecords.length > 0 && (
              <div className="sticky bottom-0 bg-white border-t border-kraft-100 px-5 py-3 rounded-b-3xl">
                <button
                  onClick={() => {
                    closeModal();
                    navigate('/record');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-kraft-400 to-kraft-500 text-white rounded-2xl font-medium shadow-paper hover:shadow-paper-hover hover:-translate-y-0.5 transition-all duration-200"
                >
                  <CalendarIcon className="w-4 h-4" />
                  记录新的创意
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
