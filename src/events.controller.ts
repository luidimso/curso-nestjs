import { Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

@Controller('/events')
export class EventsController {
    @Get()
    findall() {

    }

    @Get(':id')
    findOne(@Param('id') id) {
        return id;
    }

    @Post()
    create() {

    }

    @Patch(':id')
    update(@Param('id') id) {

    }

    @Delete(':id')
    remove(@Param('id') id) {

    }
}