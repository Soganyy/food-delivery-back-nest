import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway(1024, {
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class LocationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private redisService: RedisService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

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
    const { userId } = await this.verifyUser(
      client.handshake.auth.token as string,
    );
    const locationKey = `courier:${userId}:location`;

    await this.redisService.setLocation(locationKey, {
      latitude: data.latitude,
      longitude: data.longitude,
    });

    this.redisService.getLocation(locationKey);

    this.server.emit('courierLocationUpdated', {
      courierId: client.id,
      location: data,
    });
  }

  private async verifyUser(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
    });

    const userId = payload.id;

    return { userId };
  }
}
