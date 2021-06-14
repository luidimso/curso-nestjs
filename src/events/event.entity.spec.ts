import { Event } from "./event.entity";

test('Event should be initialized through constructor', () => {
    const event = new Event({
        name: "Testing",
        description: "Testing"
    });

    expect(event).toEqual({
        name: "Testing",
        description: "Testing",
        id: undefined,
        when: undefined,
        address: undefined,
        attendees: undefined,
        organizer: undefined,
        organizerId: undefined,
        event: undefined,
        attendeeCount: undefined,
        attendeeRejected: undefined,
        attendeeMaybe: undefined,
        attendeeAccepted: undefined
    });
});