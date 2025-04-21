export const events = [
    {
        id: '12',
        title: 'switch 2 launch',
        notes: 'drop the price',
        start: new Date('2025-04-21 14:00:00'),
        end: new Date('2025-04-21 16:00:00'),
        bgColor: '#fafafa',
    },
    {
        id: '11',
        title: 'qwert',
        notes: 'asdf',
        start: new Date('2025-07-21 14:00:00'),
        end: new Date('2025-07-21 16:00:00'),
        bgColor: '#fafafa',
    },
];

export const initialState = {
    isLoadingEvents: true,
    events: [
        // tempEvent
    ],
    activeEvent: null
};

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [
       ...events
    ],
    activeEvent: null
};

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [
       ...events
    ],
    activeEvent: {...events[0]}
};