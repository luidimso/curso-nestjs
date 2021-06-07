import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe } from "@nestjs/common";
import { CreateEventDTO } from "./input/create-event.dto";
import { UpdateEventDTO } from "./input/update-event.dto";
import { Event } from "./event.entity";
import { Like, MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Attendee } from "./attendee.entity";
import { EventsService } from "./events,.service";
import { ListEvents } from "./input/lits.events";

@Controller('/events')
export class EventsController {
    private readonly logger = new Logger(EventsController.name);

    constructor(
        @InjectRepository(Event) private readonly repository: Repository<Event>,
        @InjectRepository(Attendee) private readonly attendeeRepository: Repository<Attendee>,
        private readonly eventsService: EventsService
    ) {}

    @Get()
    async findall(@Query() filter:ListEvents) {
        this.logger.log('Hit the findAll route');
        this.logger.log(filter);
        const events = await this.eventsService.getEventsWithAttendeeCountFiltered(filter);
        this.logger.debug("Found "+events.length+" events");
        return events;
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id:number) {
        const event = await this.eventsService.getEvent(id);

        if(!event) {
            throw new NotFoundException();
        }

        return event;
    }

    // @Get('/practice')
    // async practice() {
    //     return await this.repository.find({
    //         select: ['id', 'when'],
    //         where: [{
    //             id: MoreThan(3),
    //             when: MoreThan(new Date('2021-02-12T13:00:00'))
    //         },{
    //             description: Like('%meet%')
    //         }],
    //         take: 2,
    //         order: {
    //             id: 'DESC'
    //         }
    //     });
    // }

    @Get('/test')
    async test() {
        // return await this.repository.findOne(1, {
        //     relations: ['attendees']
        // });
        const event = await this.repository.findOne(1, {
            relations: ['attendees']
        });
        const attendee = new Attendee();
        attendee.name = 'Luidi 3';
        event.attendees = [];

        await this.repository.save(event);
        return event;
    }

    @Post()
    async create(@Body() input:CreateEventDTO) {
        return await this.repository.save({
            ...input,
            when: new Date(input.when)
        });
    }

    @Patch(':id')
    async update(@Param('id') id, @Body() input:UpdateEventDTO) {
        const event = await this.repository.findOne(id);

        if(!event) {
            throw new NotFoundException();
        }

        return await this.repository.save({
            ...event,
            ...input,
            when: input.when ? new Date(input.when) : event.when
        });
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id) {
        const event = await this.repository.findOne(id);

        if(!event) {
            throw new NotFoundException();
        }
        
        await this.repository.remove(event);
    }
}