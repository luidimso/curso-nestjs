import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";

@Controller('/events')
export class EventsController {
    @Get()
    findall() {
        return [
            {
                id: 1,
                name: "Test 1"
            },
            {
                id: 2,
                name: "Test 2"
            }
        ]
    }

    @Get(':id')
    findOne(@Param('id') id) {
        return {
            id: 1,
            name: "Test 1"
        };
    }

    @Post()
    create(@Body() input) {
        return input;
    }

    @Patch(':id')
    update(@Param('id') id, @Body() input) {
        return input;
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id') id) {

    }
}