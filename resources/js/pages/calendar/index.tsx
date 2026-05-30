import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, CheckSquare, Users, DollarSign, Calendar as CalendarIcon, ArrowRight, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Event {
    id: string;
    title: string;
    date: Date;
    type: 'project' | 'task' | 'meeting' | 'invoice' | 'content_plan';
    description?: string;
    time?: string;
    location?: string;
    priority?: 'high' | 'medium' | 'low';
    daysUntil?: number;
    platform?: string;
    content_type?: string;
}

const getEventIcon = (type: string) => {
    switch (type) {
        case 'project':
            return <CheckSquare className="h-4 w-4" />;
        case 'task':
            return <Clock className="h-4 w-4" />;
        case 'meeting':
            return <Users className="h-4 w-4" />;
        case 'invoice':
            return <DollarSign className="h-4 w-4" />;
        case 'content_plan':
            return <Megaphone className="h-4 w-4" />;
        default:
            return <CalendarIcon className="h-4 w-4" />;
    }
};

const getEventColor = (type: string) => {
    switch (type) {
        case 'project':
            return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
        case 'task':
            return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
        case 'meeting':
            return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
        case 'invoice':
            return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
        case 'content_plan':
            return 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
};

const getEventBadgeColor = (type: string) => {
    switch (type) {
        case 'project':
            return 'bg-blue-500';
        case 'task':
            return 'bg-green-500';
        case 'meeting':
            return 'bg-purple-500';
        case 'invoice':
            return 'bg-orange-500';
        case 'content_plan':
            return 'bg-pink-500';
        default:
            return 'bg-gray-500';
    }
};

export default function CalendarIndex({ events: initialEvents }: { events: any[] }) {
    const [viewMode, setViewMode] = useState<'monthly' | 'weekly' | 'agenda'>('monthly');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Convert backend events to frontend format
    const events: Event[] = initialEvents.map((event) => ({
        ...event,
        date: new Date(event.date),
    }));

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const getEventsForDate = (date: Date) => {
        return events.filter(
            (event) =>
                event.date.getDate() === date.getDate() &&
                event.date.getMonth() === date.getMonth() &&
                event.date.getFullYear() === date.getFullYear()
        );
    };

    const handleDateClick = (date: Date) => {
        const dateEvents = getEventsForDate(date);
        if (dateEvents.length > 0) {
            setSelectedDate(date);
            setSelectedEvents(dateEvents);
            setIsDialogOpen(true);
        }
    };

    const getWeekStart = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    };

    const getWeekDays = () => {
        const start = getWeekStart(currentDate);
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(start);
            date.setDate(date.getDate() + i);
            return date;
        });
    };

    const getUpcomingEvents = () => {
        return events.sort((a, b) => a.date.getTime() - b.date.getTime());
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const renderMonthlyView = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`empty-${i}`} className="aspect-square bg-muted/30"></div>
            );
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const events = getEventsForDate(date);
            const isToday = new Date().toDateString() === date.toDateString();

            days.push(
                <div
                    key={day}
                    title={date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    className={`aspect-square border rounded-lg p-2 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group relative ${
                        isToday ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-border'
                    }`}
                    onClick={() => handleDateClick(date)}
                >
                    <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-foreground'}`}>
                        {day}
                    </div>
                    <div className="space-y-1">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className={`text-xs px-2 py-1 rounded border ${getEventColor(event.type)}`}
                                title={event.title}
                            >
                                <div className="truncate font-medium">{event.title}</div>
                            </div>
                        ))}
                    </div>
                    {events.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-2 pt-1 border-t border-border">
                            {events.length} event{events.length > 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-7 gap-1 bg-card text-card-foreground rounded-lg border p-4">
                {dayNames.map((day) => (
                    <div key={day} className="text-center font-semibold text-muted-foreground py-2">
                        {day}
                    </div>
                ))}
                {days}
            </div>
        );
    };

    const renderWeeklyView = () => {
        const weekDays = getWeekDays();
        const startDate = weekDays[0];
        const endDate = weekDays[6];

        return (
            <div className="bg-card text-card-foreground rounded-lg border p-4">
                <div className="text-sm text-muted-foreground mb-4 flex items-center justify-between">
                    <div>
                        <div className="font-semibold text-foreground">
                            {startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {startDate.toLocaleDateString('en-US', { weekday: 'short' })} to {endDate.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((date, index) => {
                        const events = getEventsForDate(date);
                        const isToday = new Date().toDateString() === date.toDateString();

                        return (
                            <div
                                key={index}
                                className={`rounded-lg border p-3 min-h-[300px] overflow-y-auto ${
                                    isToday ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-border'
                                }`}
                            >
                                <div className="text-sm font-semibold mb-1 text-foreground">
                                    {dayNames[date.getDay()]}
                                </div>
                                <div className="text-lg font-bold text-foreground mb-1">
                                    {date.getDate()}
                                </div>
                                <div className="text-xs text-muted-foreground mb-3">
                                    {date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                                </div>
                                <div className="space-y-2">
                                    {events.map((event) => (
                                        <div
                                            key={event.id}
                                            className={`text-xs p-2 rounded-md border-l-4 ${getEventColor(event.type)}`}
                                        >
                                            <div className="font-medium mb-1">{event.title}</div>
                                            {event.description && (
                                                <div className="text-xs opacity-75">{event.description}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderAgendaView = () => {
        const upcomingEvents = getUpcomingEvents();

        return (
            <div className="bg-card text-card-foreground rounded-lg border p-4 space-y-3">
                {upcomingEvents.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        No upcoming events scheduled
                    </div>
                ) : (
                    upcomingEvents.map((event) => (
                        <div
                            key={event.id}
                            className={`flex items-start gap-4 p-4 rounded-lg border-l-4 ${getEventColor(event.type)} cursor-pointer hover:shadow-md transition-shadow`}
                        >
                            <div className="flex-shrink-0 mt-1">
                                {getEventIcon(event.type)}
                            </div>
                            <div className="flex-grow">
                                <div className="font-semibold text-foreground mb-1">{event.title}</div>
                                {event.description && (
                                    <div className="text-sm text-muted-foreground mb-2">{event.description}</div>
                                )}
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-muted-foreground">DATE:</span>
                                        <span>
                                            {event.date.toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    {event.time && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-xs">{event.time}</span>
                                        </div>
                                    )}
                                    {event.location && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-muted-foreground">LOCATION:</span>
                                            <span className="text-xs">{event.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex flex-col gap-2 items-end">
                                <Badge variant="outline">{event.type}</Badge>
                                {event.priority && (
                                    <Badge variant={event.priority === 'high' ? 'destructive' : event.priority === 'medium' ? 'default' : 'secondary'}>
                                        {event.priority}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        );
    };

    return (
        <>
            <Head title="Calendar" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
                        <p className="text-muted-foreground">Manage your deadlines, meetings, and tasks.</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between bg-card text-card-foreground rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const newDate = new Date(currentDate);
                                if (viewMode === 'monthly') {
                                    newDate.setMonth(newDate.getMonth() - 1);
                                } else if (viewMode === 'weekly') {
                                    newDate.setDate(newDate.getDate() - 7);
                                }
                                setCurrentDate(newDate);
                            }}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="text-lg font-semibold min-w-[300px]">
                            {viewMode === 'monthly' && (
                                <div>
                                    <div>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {events.filter(e => e.date.getMonth() === currentDate.getMonth() && e.date.getFullYear() === currentDate.getFullYear()).length} events this month
                                    </div>
                                </div>
                            )}
                            {viewMode === 'weekly' && (
                                <div>
                                    <div>Week of {getWeekStart(currentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(getWeekStart(currentDate).getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {events.filter(e => {
                                            const eDate = e.date.getTime();
                                            const weekStart = getWeekStart(currentDate).getTime();
                                            const weekEnd = weekStart + 7 * 24 * 60 * 60 * 1000;
                                            return eDate >= weekStart && eDate < weekEnd;
                                        }).length} events this week
                                    </div>
                                </div>
                            )}
                            {viewMode === 'agenda' && (
                                <div>
                                    <div>Upcoming Events</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {events.length} total events scheduled
                                    </div>
                                </div>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const newDate = new Date(currentDate);
                                if (viewMode === 'monthly') {
                                    newDate.setMonth(newDate.getMonth() + 1);
                                } else if (viewMode === 'weekly') {
                                    newDate.setDate(newDate.getDate() + 7);
                                }
                                setCurrentDate(newDate);
                            }}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentDate(new Date())}
                        >
                            Today
                        </Button>
                    </div>

                    <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select view" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="agenda">Agenda</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 bg-card text-card-foreground rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-blue-500"></div>
                        <span className="text-sm">Project Deadline</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-500"></div>
                        <span className="text-sm">Task</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-purple-500"></div>
                        <span className="text-sm">Meeting</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-orange-500"></div>
                        <span className="text-sm">Invoice Due</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-pink-500"></div>
                        <span className="text-sm">Content Plan</span>
                    </div>
                </div>

                {/* Calendar View */}
                <div>
                    {viewMode === 'monthly' && renderMonthlyView()}
                    {viewMode === 'weekly' && renderWeeklyView()}
                    {viewMode === 'agenda' && renderAgendaView()}
                </div>

                {/* Event Details Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {selectedDate?.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </DialogTitle>
                            <DialogDescription>
                                {selectedEvents.length} event{selectedEvents.length > 1 ? 's' : ''} scheduled
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 mt-4">
                            {selectedEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className={`p-4 rounded-lg border-l-4 ${getEventColor(event.type)}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getEventIcon(event.type)}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="font-semibold text-foreground mb-1">
                                                {event.title}
                                            </div>
                                            {event.description && (
                                                <div className="text-sm text-muted-foreground mb-2">
                                                    {event.description}
                                                </div>
                                            )}
                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                {event.time && (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{event.time}</span>
                                                    </div>
                                                )}
                                                {event.location && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold">LOCATION:</span>
                                                        <span className="text-xs">{event.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Badge variant="outline">{event.type}</Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t flex gap-4">
                            <Link href="/tasks" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                Lihat Semua Tasks
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="/content-plans" className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors">
                                Lihat Semua Content Plans
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

CalendarIndex.layout = {
    breadcrumbs: [
        {
            title: 'Calendar',
            href: '/calendar',
        },
    ],
};
