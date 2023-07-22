import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/entities/Event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
  ) {}

  public async genEvents(): Promise<Array<Event>> {
    return await this.eventRepository.find({});
  }

  public async genNullableEventById(eventId: number): Promise<Event | null> {
    return await this.eventRepository.findOne({
      where: {
        id: eventId,
      },
    });
  }
}
