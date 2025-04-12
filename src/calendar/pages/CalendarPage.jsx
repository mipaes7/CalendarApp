import { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { NavBar, CalendarEvent, CalendarModal, FabAddNew, FabDelete } from '../';

import { localizer } from '../../helpers';
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks';

// const events = [
//   {
//     title: 'switch 2 launch',
//     notes: 'drop the price',
//     start: new Date(),
//     end: addHours(new Date(), 2),
//     bgColor: '#fafafa',
//     user: {
//       _id: '77',
//       name: 'Miguel'
//     }
//   }
// ];

export const CalendarPage = () => {

  const { user } = useAuthStore()
  const {openDateModal} = useUiStore();
  const {events, setActiveEvent, setDeactiveEvent, startLoadingEvents} = useCalendarStore();

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');

  const eventStyleGetter = (event, start, end, isSelected) => {

    const isMyEvent = (user.uid === event.user.uid) || (user.uid === event.user._id);

    const style = {
      backgroundColor: isMyEvent ? '#347CF7' : '#465660',
      opacity: isSelected ? 1 : 0.8,
      border: isSelected ? '2px solid black' : 'none',
      borderRadius: 3,
      color: 'white'
    };

    return {
      style
    };

  };

  const onDoubleClick = (event) => {
    openDateModal();
  };

  const onSelect = (event) => {
    setActiveEvent(event);
  };

  const onViewChanged = (event) => {
    localStorage.setItem('lastView', event);
    setLastView(event);
  };

  const onDeselectEvent = () => {
    setDeactiveEvent();
  };

  useEffect(() => {
    startLoadingEvents();
  }, []);

  return (
    <>
      <NavBar />

      <Calendar
        localizer={localizer}
        events={events}
        defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 80px)' }}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}
        onSelectSlot={onDeselectEvent}
        selectable={true}
      />
      <CalendarModal />
      <FabAddNew />
      <FabDelete />
    </>
  )
}