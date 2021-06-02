import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { CreateEventDTO } from "./create-event.dto";
import { UpdateEventDTO } from "./update-event.dto";
import { Event } from "./event.entity";

@Controller('/events')
export class EventsController {
    private events: Event[] = [];

    @Get()
    findall() {
        return this.events;
    }

    @Get(':id')
    findOne(@Param('id') id) {
        const event = this.events.find(event => {
            return event.id === parseInt(id); 
        });
        return event;
    }

    @Post()
    create(@Body() input:CreateEventDTO) {
        const event = {
            ...input,
            when: new Date(input.when),
            id: this.events.length + 1
        };
        this.events.push(event);

        return this.events;
    }

    @Patch(':id')
    update(@Param('id') id, @Body() input:UpdateEventDTO) {
        const index = this.events.findIndex(event => {
            event.id === parseInt(id);
        });

        this.events[index] = {
            ...this.events[index],
            ...input,
            when: input.when ? new Date(input.when) : this.events[index].when
        };

        return this.events[index];
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id') id) {
        this.events = this.events.filter(event => {
            return event.id !== parseInt(id);
        });
    }
}