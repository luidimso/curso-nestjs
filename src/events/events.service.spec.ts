import { getRepositoryToken } from "@nestjs/typeorm";
import { createQueryBuilder, Repository } from "typeorm";
import { EventsService } from "./events.service";
import { Test } from '@nestjs/testing';
import { Event } from "./event.entity";

describe('EventsService', () => {
    let service: EventsService;
    let repository: Repository<Event>;
    let selectQueryBuilder;
    let deleteQueryBuilder;

    beforeEach(async () => {
        deleteQueryBuilder = {
            where: jest.fn(),
            execute: jest.fn()
        };
        selectQueryBuilder = {
            delete: jest.fn().mockReturnValue(deleteQueryBuilder),
            where: jest.fn(),
            execute: jest.fn(),
            orderBy: jest.fn(),
            leftJoinAndSelect: jest.fn()
        };
        
        const module = await Test.createTestingModule({
            providers: [
                EventsService,
                {
                    provide: getRepositoryToken(Event),
                    useValue: {
                        save: jest.fn(),
                        createQueryBuilder: jest.fn().mockReturnValue(selectQueryBuilder),
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

    describe('deleteEvent', () => {
        it('should delete an event', async () => {
            const createQueryBuilderSpy = jest.spyOn(repository, 'createQueryBuilder');
            const deleteSpy = jest.spyOn(selectQueryBuilder, 'delete');
            const whereSpy = jest.spyOn(deleteQueryBuilder, 'where').mockReturnValue(deleteQueryBuilder);
            const executeSpy = jest.spyOn(deleteQueryBuilder, 'execute');

            expect(service.deleteEvent(1)).resolves.toBe(undefined);
            expect(createQueryBuilderSpy).toHaveBeenCalledTimes(1);
            expect(createQueryBuilderSpy).toHaveBeenCalledWith('e');
            expect(deleteSpy).toHaveBeenCalledTimes(1);
            expect(whereSpy).toHaveBeenCalledTimes(1);
            expect(whereSpy).toHaveBeenCalledWith('id = :id', {
                id: 1
            });
            expect(executeSpy).toHaveBeenCalledTimes(1);
        });
    });
});