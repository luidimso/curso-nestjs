import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventsService } from "./events.service";
import { Test } from '@nestjs/testing';
import { Event } from "./event.entity";

describe('EventsService', () => {
    let service: EventsService;
    let repository: Repository<Event>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                EventsService,
                {
                    provide: getRepositoryToken(Event),
                    useValue: {
                        save: jest.fn(),
                        createQueryBuilder: jest.fn(),
                        delete: jest.fn(),
                        where: jest.fn(),
                        execute: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<EventsService>(EventsService);
        repository = module.get<Repository<Event>>(getRepositoryToken(Event));
    });

    describe('updateEvent', () => {
        it('shoud update the event', async () => {
            const repositorySpy = jest.spyOn(repository, 'save').mockResolvedValue({
                id: 1
            } as Event);
            expect(service.updateEvent(new Event({
                id: 1
            }), {
                name: "New name"
            })).resolves.toEqual({
                id: 1
            });
            expect(repositorySpy).toBeCalledWith({
                id: 1,
                name: "New name"
            });
        });
    });
});