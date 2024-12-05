import Game from '../game.js';

export default function socket(socketList) {
    
  const game = new Game();

  game.subscribe((command) => {
    console.log(`> Emitindo o evento ${command.type}`)
    socketList.emit(command.type, command)
  });
    
  socketList.on('connection', (socket) => {

    console.log(`Jogador ao server conectado: ${socket.id}`);

    socket.emit('setup', game.state);

    socket.on('disconnect', () => {
      game.RemoverJogador(socket.id);
      console.log(game.state);
    });

    socket.on('add-player', (command) => {    
      game.AdicionarJogador({...command, socketId: socket.id});
      console.log(game.state);
    });

  });
}