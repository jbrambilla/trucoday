'use client'
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from 'next/navigation';
import { getSocket } from "@/app/libs/socket";
import useSocketEvent from '@/app/hooks/useSocketEvent';


export default function Sala() {
    const params = useParams(); 
    const { sal_id, eqp_id } = params; 
    const URL = 'http://localhost:5000';
    const router = useRouter();
    const [nomeJogador, setNomeJogador] = useState(''); 
    const [idJogador, setIdJogador] = useState(''); 
    const [eventos, setEventos] = useState([]);
    const [jogadores, setJogadores] = useState([]);

    const posicoesEquipe1 = [
        { top: '10%', left: '50%' },
        { bottom: '10%', left: '50%' },
    ];
    
    const posicoesEquipe2 = [
        { top: '50%', left: '0%' },
        { top: '50%', right: '0%' },
    ];

    useSocketEvent('setup', (command) => {
        console.log('Recebendo o evento setup');
        setJogadores(Object.values(command.jogadores));
    });

    useSocketEvent('add-player', (command) => {
        console.log('Recebendo o evento add-player');
        setJogadores((prev) => [...prev, command.jogador]);
    });

    useSocketEvent('player-disconnected', (command) => {
        console.log('Recebendo o evento player-disconnected');
        setJogadores((prev) => prev.filter((jogador) => jogador.id !== command.jogador.id));
    });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    
    useEffect(() => {
        const token = getCookie('token');

        fetch(URL + '/usuarios/info', {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
        .then(r => {
            if (!r.ok) {
                console.log('r:', r);
                throw new Error('Erro ao buscar informações do jogador');
            }
            return r.json();
        })
        .then(data => {
            if (data.nome) {
                const socket = getSocket();
                socket.emit('add-player',{id: data.id, nome: data.nome, sal_id: sal_id, eqp_id: eqp_id});
                setNomeJogador(data.nome);
                setIdJogador(data.id);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }, [sal_id, eqp_id, URL]);
   
    return (
        <div style={styles.jogoContainer}>
            <div style={styles.mesaJogo}>

                {/* POSICIONANDO EQUIPE 1*/}
                {jogadores.filter((jogador) => jogador.eqp_id != 2).map((jogador, index) => (
                    <div key={index} style={{ ...styles.jogadorEquipe1, ...posicoesEquipe1[index] }}>
                        <h3>{jogador.nome} {jogador.id == idJogador ? ' (Você)' : ''}</h3>
                    </div> 
                ))}
                {/* POSICIONANDO EQUIPE 2*/}
                {jogadores.filter((jogador) => jogador.eqp_id != 1).map((jogador, index) => (
                    <div key={index} style={{ ...styles.jogadorEquipe2, ...posicoesEquipe2[index] }}>
                        <h3>{jogador.nome} {jogador.id == idJogador ? ' (Você)' : ''}</h3>
                    </div> 
                ))}
                <div style={styles.mesa}>
                    <h2>Mesa de Truco</h2>
                </div>
            </div>
            <div style={styles.menuLateral}>
                <div style={styles.botaoContainer}>
                    <h2 style={styles.menuLateralTitle}>Jogadores na Sala</h2>
                </div>
                <br />
                {jogadores.map((jogador, index) => (
                    <p key={index}>{jogador.nome}</p>
                ))}
                <br />

                <br />
                <div style={styles.botaoContainer}>
                    <button style={styles.buttonTruco} onClick={() => socket.current.emit("teste", { codSala: sal_id })}>Pedir truco</button>
                </div>
            </div>
            <button style={styles.buttonSair} className="button-sair" onClick={() => router.push('/') }>Sair do Jogo</button>
        </div>
    );

}
const styles = {
    jogoContainer: {
        display: 'flex',
        height: '100vh',
    },

    mesaJogo: {
        position: 'relative',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#004d00', 
    },

    mesa: {
        position: 'absolute',
        backgroundColor: '#004d00', /* Cor da mesa */
        borderRadius: '15px',
        width: '60%',
        height: '60%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    jogadorEquipe1: {
        position: 'absolute',
        backgroundColor: '#FF0000', /* Cor dos jogadores */
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center',
        margin: '5px 10px 5px 10px',
    },

    jogadorEquipe2: {
        position: 'absolute',
        backgroundColor: 'blue', /* Cor dos jogadores */
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center',
        margin: '5px 10px 5px 10px',
    },

    menuLateral: {
        width: '260px', 
        backgroundColor: '#808080', 
        padding: '20px',
        overflowY: 'auto',
    },

    menuLateralTitle: {
        color: '#000',
        margin: '10px 0 10px',
        backgroundColor: '#808080',
    },
    buttonApertar: {
        display: 'block',
        margin: '20px auto',
        padding: '10px 15px',
        backgroundColor: '#ff8c00',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
    },
    buttonSair: {
        position: 'fixed',
        bottom: '20px',
        right: '20px', 
        padding: '10px 20px',
        color: '#fff',
        backgroundColor: '#FF0000',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        border: 'none',
        fontSize: '16px',
    },  
    botaoContainer: {
        display: 'flex', 
        justifyContent: 'center', 
        gap: '10px', 
        marginBottom: '20px', 
    },

    buttonEquipe1: {
        padding: '10px 20px',
        color: '#000',
        backgroundColor: '#FFFF00',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        border: 'none',
        fontSize: '16px',
    },   

    buttonEquipe2: {
        padding: '10px 20px',
        color: '#000',
        backgroundColor: '#FFA500',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        border: 'none',
        fontSize: '16px',
    }, 
    buttonTruco: { 
        padding: '10px 20px',
        color: '#fff',
        backgroundColor: '#4682B4',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        border: 'none',
        fontSize: '16px',
    },  
};
