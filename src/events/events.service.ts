import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate, PaginateOptions } from "../../pagination/paginator";
import { User } from "./../auth/user.entity";
import { Event, PaginatedEvents } from './../events/event.entity';
import { DeleteResult, Repository, SelectQueryBuilder } from "typeorm";
import { AttendeeAnswerEnum } from "./attendee.entity";
import { CreateEventDTO } from "./input/create-event.dto";
import { ListEvents, WhenEventFilter } from "./input/lits.events";
import { UpdateEventDTO } from "./input/update-event.dto";

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name);

    constructor(
        @InjectRepository(Event) private readonly eventsRepository: Repository<Event>
    ){}

    private getEventsBaseQuery(): SelectQueryBuilder<Event> {
        return this.eventsRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
    }

    public async getEventWithAttendeeCount(id:number): Promise<Event | undefined> {
        const query = this.getEventsWithAttendeeCountQuery().andWhere('e.id = :id', {id});
        this.logger.debug(query.getSql());
        return await query.getOne();
    }

    public getEventsWithAttendeeCountQuery(): SelectQueryBuilder<Event> {
        return this.getEventsBaseQuery()
        .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
        .loadRelationCountAndMap('e.attendeeAccepted', 'e.attendees', 'attendee', (qb) => qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted
        }))
        .loadRelationCountAndMap('e.attendeeMaybe', 'e.attendees', 'attendee', (qb) => qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Maybe
        }))
        .loadRelationCountAndMap('e.attendeeRejected', 'e.attendees', 'attendee', (qb) => qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Rejected
        }));
    }

    private getEventsWithAttendeeCountFilteredQuery(filter?:ListEvents): SelectQueryBuilder<Event> {
        let query = this.getEventsWithAttendeeCountQuery();

        if(!filter) {
            return query;
        }

        if(filter.when) {
            if(filter.when == WhenEventFilter.Today) {
                query = query.andWhere(`e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`);
            }

            if(filter.when == WhenEventFilter.Tomorrow) {
                query = query.andWhere(`e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`);
            }

            if(filter.when == WhenEventFilter.ThisWeek) {
                query = query.andWhere(`YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)`);
            }

            if(filter.when == WhenEventFilter.NextWeek) {
                query = query.andWhere(`YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1`);
            }
        }

        return query;
    }

    public async getEventsWithAttendeeCountFilteredPaginated(filter:ListEvents, paginateOptions:PaginateOptions): Promise<PaginatedEvents> {
        return await paginate(await this.getEventsWithAttendeeCountFilteredQuery(filter), paginateOptions);
    }

    public async deleteEvent(id:number):Promise<DeleteResult> {
        return await this.eventsRepository.createQueryBuilder('e').delete().where('id = :id', {id}).execute();
    }

    public async createEvent(input:CreateEventDTO, user:User):Promise<Event> {
        return await this.eventsRepository.save(new Event({
            ...input,
            organizer: user,
            when: new Date(input.when)
        }));
    }

    public async updateEvent(event:Event, input:UpdateEventDTO): Promise<Event> {
        return await this.eventsRepository.save(new Event({
            ...event,
            ...input,
            when: input.when ? new Date(input.when) : event.when
        }));
    }

    private getEventsOrganizedByUserIdQuery(userId:number): SelectQueryBuilder<Event> {
        return this.getEventsBaseQuery().where('e.organizerId = :userId', {
            userId
        });
    }

    public async getEventsOrganizedByUserIdPaginated(userId:number, paginatedOptions: PaginateOptions): Promise<PaginatedEvents> {
        return await paginate<Event>(this.getEventsOrganizedByUserIdQuery(userId), paginatedOptions);
    }

    private getEventsAttendedByUserIdQuery(userId:number): SelectQueryBuilder<Event> {
        return this.getEventsBaseQuery().leftJoin('e.attendees', 'a').where('a.userId = :userId', {
            userId
        });
    }

    public async getEventsAttendedByByUserIdPaginated(userId:number, paginatedOptions: PaginateOptions): Promise<PaginatedEvents> {
        return await paginate<Event>(this.getEventsAttendedByUserIdQuery(userId), paginatedOptions);
    }

    public async findOne(id:number): Promise<Event | undefined> {
        return await this.eventsRepository.findOne(id);
    }
}