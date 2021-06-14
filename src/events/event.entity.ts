import { User } from "src/auth/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Attendee, AttendeeAnswerEnum } from "./attendee.entity";

@Entity()
export class Event {
    @PrimaryGeneratedColumn() id: number;
    @Column() name: string;
    @Column() description: string;
    @Column() when: Date;
    @Column() address: string;
    @OneToMany(() => Attendee, (attendee) => attendee.event, {
        cascade: true
    }) attendees: Attendee[];
    @ManyToOne(() => User, (user) => user.organized) @JoinColumn({
        name: 'organizerId'
    }) organizer: User;
    @Column({
        nullable: true
    }) organizerId: number;
    attendeeCount? :number;
    attendeeAccepted?: number;
    attendeeMaybe?: number;
    attendeeRejected?: number;
}