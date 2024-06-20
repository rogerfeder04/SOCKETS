import { TicketControl } from '../models/control.js';

const ticketControl = new TicketControl();

const socketController = (socket) => {
    console.log('Cliente conectado', socket.id);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id);
    });

    // Emitir el último ticket
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    // Emitir el estado actual 4
    socket.emit('estado-actual', ticketControl.ultimos4);
    // Emitir la cantidad de tickets pendientes
    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    socket.on('siguiente-ticket', (payload, callback) => {
        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    });

    socket.on('atender-ticket', ({ escritorio }, callback) => {
        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'El escritorio es necesario'
            });
        }

        const ticket = ticketControl.atenderTicket(escritorio);

        // Emitir el estado actual 4
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        // Emitir la cantidad de tickets pendientes
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

         // Emitir el evento para reproducir el sonido
        socket.broadcast.emit('reproducir-sonido');

        if (!ticket) {
            return callback({
                ok: false,
                msg: 'Ya no hay tickets'
            });
        } else {
            callback({
                ok: true,
                ticket,
                pendientes: ticketControl.tickets.length
            });
        }
    });
};

export { socketController };
