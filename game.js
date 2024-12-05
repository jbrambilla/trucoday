export default class Game {
    
    state = {
        jogadores: {},
        mao: {},
        rodada: {},
        jogo: {},
        movimentacoes: {},
    };

    observers = [];
    subscribe(observerFunction) {
        this.observers.push(observerFunction)
    }

    notifyAll(command) {
        for (const observerFunction of this.observers) {
            observerFunction(command)
        }
    }

    get quantidadeJogadores() { return Object.keys(this.state.jogadores).length; }

    constructor() {
    }

    AdicionarJogador(command) {
        const { socketId, id, nome, sal_id, eqp_id } = command;
        this.state.jogadores[socketId] = {
            id,
            nome,
            sal_id,
            eqp_id
        }

        this.notifyAll({
            type: 'add-player',
            jogador: this.state.jogadores[socketId]
        });
    }

    RemoverJogador(socketId) {
        const jogador = this.state.jogadores[socketId];
        delete this.state.jogadores[socketId];

        this.notifyAll({
            type: 'player-disconnected',
            jogador
        });
    }
}