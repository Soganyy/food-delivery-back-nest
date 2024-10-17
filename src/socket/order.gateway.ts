import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(1025, {
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    const merchantId = client.handshake.query.merchantId;
    const courierId = client.handshake.query.courierId;

    if (userId) {
      client.join(`user-${userId}`);
    } else if (merchantId) {
      client.join(`merchant-${merchantId}`);
    } else if (courierId) {
      client.join(`courier-${courierId}`);
      console.log('courier connected for order:' + courierId);
    }
  }

  handleDisconnect(client: Socket) {
    // Client disconnect logic
  }

  @SubscribeMessage('orderStatusUpdate')
  handleOrderStatusUpdate(
    client: Socket,
    payload: {
      orderId: string;
      status: string;
      targetId: string;
      targetType: string;
    },
  ) {
    const { orderId, status, targetId, targetType } = payload;

    if (targetType === 'user') {
      this.server
        .to(`user-${targetId}`)
        .emit('orderStatusUpdate', { orderId, status });
    } else if (targetType === 'merchant') {
      this.server
        .to(`merchant-${targetId}`)
        .emit('orderStatusUpdate', { orderId, status });
    } else if (targetType === 'courier') {
      this.server
        .to(`courier-${targetId}`)
        .emit('orderStatusUpdate', { orderId, status });
    }
  }

  @SubscribeMessage('acceptOrder')
  handleAcceptOrder(
    client: Socket,
    payload: { orderId: string; userId: string; merchantId: string },
  ) {
    this.server
      .to(`user-${payload.userId}`)
      .emit('orderAccepted', { orderId: payload.orderId });
  }

  async handleCourierResponse(
    courierId: string,
    orderId: string,
    accepted: boolean,
  ) {
    if (accepted) {
      this.server.to(`user-${orderId}`).emit('courierAssigned', { courierId });
    } else {
      this.server.to(`user-${orderId}`).emit('courierDeclined');
    }
  }
}
