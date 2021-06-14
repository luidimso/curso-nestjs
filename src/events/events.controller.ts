import { Body, ClassSerializerInterceptor, Controller, Delete, ForbiddenException, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, SerializeOptions, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateEventDTO } from "./input/create-event.dto";
import { UpdateEventDTO } from "./input/update-event.dto";
import { EventsService } from "./events.service";
import { ListEvents } from "./input/lits.events";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/user.entity";
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";

@Controller('/events')
@SerializeOptions({
    strategy: 'excludeAll'
})
export class EventsController {
    private readonly logger = new Logger(EventsController.name);

    constructor(
        private readonly eventsService: EventsService
    ) {}

    @Get()
    @UsePipes(new ValidationPipe({
        transform: true
    }))
    @UseInterceptors(ClassSerializerInterceptor)
    async findall(@Query() filter:ListEvents) {
        const events = await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(filter, {
            total: true,
            currentPage: filter.page,
            limit: 2
        });
        return events;
    }

    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id', ParseIntPipe) id:number) {
        const event = await this.eventsService.getEventWithAttendeeCount(id);

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

    // @Get('/test')
    // async test() {
    //     // return await this.repository.findOne(1, {
    //     //     relations: ['attendees']
    //     // });
    //     const event = await this.repository.findOne(1, {
    //         relations: ['attendees']
    //     });
    //     const attendee = new Attendee();
    //     attendee.name = 'Luidi 3';
    //     event.attendees = [];

    //     await this.repository.save(event);
    //     return event;
    // }

    @Post()
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async create(@Body() input:CreateEventDTO, @CurrentUser() user: User) {
        return await this.eventsService.createEvent(input, user);
    }

    @Patch(':id')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async update(@Param('id', ParseIntPipe) id, @Body() input:UpdateEventDTO, @CurrentUser() user: User) {
        const event = await this.eventsService.findOne(id);

        if(!event) {
            throw new NotFoundException();
        }

        if(event.organizerId !== user.id) {
            throw new ForbiddenException(null, "You are not authorized to change this event");
        }

        return await this.eventsService.updateEvent(event, input);
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(AuthGuardJwt)
    async remove(@Param('id', ParseIntPipe) id, @CurrentUser() user: User) {
        const event = await this.eventsService.findOne(id);

        if(!event) {
            throw new NotFoundException();
        }

        if(event.organizerId !== user.id) {
            throw new ForbiddenException(null, "You are not authorized to remove this event");
        }

        await this.eventsService.deleteEvent(id);
    }
}