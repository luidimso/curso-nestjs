import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { AttendeesService } from './attendees.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Event, Attendee]),
    ],
    controllers: [EventsController],
    providers: [
        EventsService, 
        AttendeesService
    ]
})
export class EventsModule {}
