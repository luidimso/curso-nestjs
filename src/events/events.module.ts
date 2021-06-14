import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { AttendeesService } from './attendees.service';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';
import { EventAttendeesController } from './events-attendees.controller';
import { EventsOrganizerController } from './events-organizer.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Event, Attendee]),
    ],
    controllers: [
        EventsController,
        CurrentUserEventAttendanceController,
        EventAttendeesController,
        EventsOrganizerController
    ],
    providers: [
        EventsService, 
        AttendeesService
    ]
})
export class EventsModule {}
