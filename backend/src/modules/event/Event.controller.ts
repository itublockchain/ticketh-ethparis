import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Event } from 'src/entities/Event.entity';
import { EventByIdParams } from 'src/modules/event/Event.dto';
import { EventService } from 'src/modules/event/Event.service';
import { DefaultApiOperation } from 'src/utils/docs';

@ApiTags('Event')
@Controller('events')
export class EventContoller {
  constructor(private eventService: EventService) {}

  @DefaultApiOperation('Get all events')
  @ApiOkResponse({
    type: Event,
    isArray: true,
  })
  @Get()
  public async genEvents(): Promise<Array<Event>> {
    return await this.eventService.genEvents();
  }

  @DefaultApiOperation('Get event by id')
  @ApiOkResponse({
    type: Event,
    isArray: true,
  })
  @Get('/:id')
  public async genNullableEventById(
    @Param() params: EventByIdParams,
  ): Promise<Event | null> {
    return await this.eventService.genNullableEventById(params.id);
  }
}
