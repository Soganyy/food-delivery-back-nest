import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../redis.service';

@WebSocketGateway({ cors: true })
export class LocationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private redisService: RedisService) {}

  handleConnection(client: Socket) {
    console.log(`Courier connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Courier disconnected: ${client.id}`);
    this.redisService.removeLocation(client.id);
  }

  @SubscribeMessage('updateLocation')
  async handleLocationUpdate(
    client: Socket,
    data: { latitude: number; longitude: number },
  ) {
    const locationKey = `courier:${client.id}:location`;

    await this.redisService.setLocation(locationKey, {
      latitude: data.latitude,
      longitude: data.longitude,
    });

    this.server.emit('courierLocationUpdated', {
      courierId: client.id,
      location: data,
    });
  }
}
