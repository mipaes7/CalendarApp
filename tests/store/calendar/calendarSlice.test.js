import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice";
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../__fixtures/calendarStates";

describe('tests on calendarSlice', () => {
  
    test('should return default state', () => {
      
        expect(calendarSlice.getInitialState()).toEqual(initialState);

    });
    
    test('should set event to active', () => {
        
        const state = calendarSlice.reducer(calendarWithActiveEventState, onSetActiveEvent(events[0]));
        expect(state.activeEvent).toEqual(events[0]);

    });
    
    test('should add new event', () => {
        
        const eventToAdd = events[1];
        const state = calendarSlice.reducer(initialState, onAddNewEvent(eventToAdd));
        expect(state.events.length).toBe(1);
        expect(state.events[0]).toEqual(events[1]);

    });
    
    test('should update event', () => {
        
        const eventToUpdate = {
            id: '11',
            title: 'updated',
            notes: 'asdf',
            start: new Date('2025-07-21 14:00:00'),
            end: new Date('2025-07-21 16:00:00'),
            bgColor: '#fafafa',
        };
        const state = calendarSlice.reducer(calendarWithEventsState, onUpdateEvent(eventToUpdate));
        expect(state.events).toContain(eventToUpdate);
        
    });
    
    test('should delete event', () => {
        
        const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent());
        expect(state.events).not.toContain(events[0]);
        expect(state.activeEvent).toBe(null);

    });
    
    test('should load events', () => {
        
        const state = calendarSlice.reducer(initialState, onLoadEvents(events));
        expect(state).toEqual(calendarWithEventsState);

    });
    
    test('should clear state', () => {

        const state = calendarSlice.reducer(calendarWithActiveEventState, onLogoutCalendar());
        expect(state).toEqual(initialState);

    });
});
