import { Uuid } from '../value-object/uuid';
import { IDomainEventIntegration } from './domain-event-integration';

export interface IDomainEvent {
  aggregateId: Uuid;
  occurredOn: Date;
  eventVersion: number;

  getIntegrationEvent?(): IDomainEventIntegration;
}