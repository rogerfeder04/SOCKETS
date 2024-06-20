document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();


    const searchParams = new URLSearchParams(window.location.search);
    if (!searchParams.has('escritorio')) {
        window.location = 'index.html';
        throw new Error('El escritorio es obligatorio');
    }


    const escritorio = searchParams.get('escritorio');
    const lblAtendiendo = document.querySelector('small');
    const btnAtender = document.querySelector('button');
    const lblPendientes = document.querySelector('#lblPendientes');

    document.querySelector('h1').innerText = `Escritorio ${escritorio.toUpperCase()}`;

    btnAtender.addEventListener('click', () => {
        socket.emit('atender-ticket', { escritorio }, ({ ok, ticket, pendientes }) => {
            if (!ok) {
                lblAtendiendo.innerText = '...';
                return alert('No hay más tickets');
                
            }

            lblAtendiendo.innerText = `Ticket ${ticket.numero}`;
            lblPendientes.innerText = pendientes;
        });
    });

    socket.on('tickets-pendientes', (pendientes) => {
        lblPendientes.innerText = pendientes;
    });
});
