import { getRepositoryToken } from "@nestjs/typeorm";
import { createQueryBuilder, Repository } from "typeorm";
import { EventsService } from "./events.service";
import { Test } from '@nestjs/testing';
import { Event } from "./event.entity";
import * as paginator from './../../pagination/paginator';

jest.mock('./../../pagination/paginator');

describe('EventsService', () => {
    let service: EventsService;
    let repository: Repository<Event>;
    let selectQueryBuilder;
    let deleteQueryBuilder;
    let mockedPaginator;

    beforeEach(async () => {
        mockedPaginator = paginator.paginate as jest.Mock;

        deleteQueryBuilder = {
            where: jest.fn(),
            execute: jest.fn()
        };
        selectQueryBuilder = {
            delete: jest.fn().mockReturnValue(deleteQueryBuilder),
            where: jest.fn(),
            execute: jest.fn(),
            orderBy: jest.fn(),
            leftJoin: jest.fn()
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

    describe('getEventsAttendedByUseIdPaginated', () => {
        it('should return a list of paginated events', async () => {
            const orderBySpy = jest.spyOn(selectQueryBuilder, 'orderBy').mockReturnValue(selectQueryBuilder);
            const leftJoinSpy = jest.spyOn(selectQueryBuilder, 'leftJoin').mockReturnValue(selectQueryBuilder);
            const whereSpy = jest.spyOn(selectQueryBuilder, 'where').mockReturnValue(selectQueryBuilder);

            mockedPaginator.mockResolvedValue({
                first: 1,
                last: 1,
                total: 10,
                limit: 10,
                data: []
            });

            expect(service.getEventsAttendedByByUserIdPaginated(500, {
                currentPage: 1,
                limit: 1
            })).resolves.toEqual({
                first: 1,
                last: 1,
                total: 10,
                limit: 10,
                data: []
            });
            expect(orderBySpy).toBeCalledTimes(1);
            expect(orderBySpy).toBeCalledWith('e.id', 'DESC');
            expect(leftJoinSpy).toBeCalledTimes(1);
            expect(leftJoinSpy).toBeCalledWith('e.attendees', 'a');
            expect(whereSpy).toBeCalledTimes(1);
            expect(whereSpy).toBeCalledWith('a.userId = :userId', {
                userId: 500
            });
            expect(mockedPaginator).toBeCalledTimes(1);
            expect(mockedPaginator).toBeCalledWith(selectQueryBuilder, {
                currentPage: 1,
                limit: 1
            });
        }) ;
    });
});