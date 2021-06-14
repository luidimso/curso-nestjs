import { Expose } from "class-transformer";
import { PaginationResult } from "pagination/paginator";
import { User } from "src/auth/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Attendee, AttendeeAnswerEnum } from "./attendee.entity";

@Entity()
export class Event {
    @PrimaryGeneratedColumn() @Expose() id: number;
    @Column() @Expose() name: string;
    @Column() @Expose() description: string;
    @Column() @Expose() when: Date;
    @Column() @Expose() address: string;
    @OneToMany(() => Attendee, (attendee) => attendee.event, {
        cascade: true
    }) @Expose() attendees: Attendee[];
    @ManyToOne(() => User, (user) => user.organized) @JoinColumn({
        name: 'organizerId'
    }) @Expose() organizer: User;
    @Column({
        nullable: true
    }) organizerId: number;
    @Expose() attendeeCount? :number;
    @Expose() attendeeAccepted?: number;
    @Expose() attendeeMaybe?: number;
    @Expose() attendeeRejected?: number;
}

export type PaginatedEvents = PaginationResult<Event>;