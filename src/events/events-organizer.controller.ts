import { ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query, SerializeOptions, UseInterceptors } from "@nestjs/common";
import { EventsService } from "./events.service";

@Controller('events-organizer/:userId')
@SerializeOptions({
    strategy: 'excludeAll'
})
export class EventsOrganizerController {

    constructor(
        private readonly eventsService: EventsService
    ) {}

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Param('userId', ParseIntPipe) userId:number, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1) {
        return await this.eventsService.getEventsOrganizedByUserIdPaginated(userId, {
            currentPage: page,
            limit: 5
        });
    }

}