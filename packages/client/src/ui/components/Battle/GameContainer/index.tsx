import React from "react";
import { useSelector } from "react-redux";
import { Application } from "@pixi/app";
import { Socket } from "socket.io-client"

import * as Shared from "@bombers/shared/src/idnex";
import * as GameSelecors from "../../../redux/selectors/game-selectors";
import Game from "../../../../game/Game";
import styles from "./game-container.module.scss";
import { EmotionEntity, PlayerEntity } from "../../../../game/entities";
import { getEntityFrame } from "../../../../game/core/frames";
import EntityFactory from "../../../../game/core/EntityFactory";
import { debug } from "@bombers/shared/src/tools/debugger";

/**
 * Создаем оболочку для канваса. Элемент должен отрисоваться
 * только один раз, поэтому мемозируем через React.memeo(...).
 */
const GameCanvas = React.memo(() => {
    debug(
        "Canvas wrapper has been created",
        `timestamp: ${Date.now()}`
    ); 

    return (
        <div 
            className={styles.canvas} 
            id={Shared.Constants.GAME_CANVAS_VIEW_ID}
        >
        </div>
    );
});

let currentEmotion: EmotionEntity;

const applyEmotion = (
    playerEntity: PlayerEntity, 
    emotionEntityId: number
) => {
    if (currentEmotion !== undefined) {
        currentEmotion.destroy();
    }

    currentEmotion = EntityFactory.create(emotionEntityId);

    playerEntity.addChild(currentEmotion);
};

const initMenuCanvas = (
    color: number, 
    TCPSocket: Socket
) => {
    const { EntityNumbers, MoveDirections } = Shared.Enums;
    const { 
        GAME_RESOLUTION_TILE_SIZE, 
        GAME_RESOLUTION_TILE_OFFSET 
    } = Shared.Constants;

    const app = new Application({
        width: GAME_RESOLUTION_TILE_SIZE * 3,
        height: GAME_RESOLUTION_TILE_SIZE * 2,
        backgroundAlpha: 0
    });

    const { x: frameX, y: frameY } = getEntityFrame(
        EntityNumbers.PLAYER, 
        +color, 
        MoveDirections.DOWN
    );
    const playerEntity = new PlayerEntity(frameX, frameY, +color);

    playerEntity.x = GAME_RESOLUTION_TILE_SIZE * 2 + GAME_RESOLUTION_TILE_OFFSET;
    playerEntity.y = GAME_RESOLUTION_TILE_OFFSET + GAME_RESOLUTION_TILE_SIZE / 2;

    const emotions = [
        EntityNumbers.EMOTION_1_FRONT,
        EntityNumbers.EMOTION_2_FRONT,
        EntityNumbers.EMOTION_3_FRONT,
        EntityNumbers.EMOTION_4_FRONT
    ];

    for (let emotion of emotions) {
        const emotionEntity: EmotionEntity = EntityFactory.create(emotion);

        if (emotion === EntityNumbers.EMOTION_1_FRONT) {
            applyEmotion(playerEntity, emotion);
            emotionEntity.x = 0;
            emotionEntity.y = 0;
        }
        else if (emotion === EntityNumbers.EMOTION_2_FRONT) {
            emotionEntity.x = GAME_RESOLUTION_TILE_SIZE;
            emotionEntity.y = 0;
        }
        else if (emotion === EntityNumbers.EMOTION_3_FRONT) {
            emotionEntity.x = 0;
            emotionEntity.y = GAME_RESOLUTION_TILE_SIZE;
        }
        else if (emotion === EntityNumbers.EMOTION_4_FRONT) {
            emotionEntity.x = GAME_RESOLUTION_TILE_SIZE;
            emotionEntity.y = GAME_RESOLUTION_TILE_SIZE;
        }

        emotionEntity.interactive = true;
        emotionEntity.buttonMode = true;

        emotionEntity.on('pointerdown', () => {
            TCPSocket.emit(
                String(Shared.Enums.SocketChannels.GAME_ON_EMOTION_UPDATE),
                emotion
            );

            applyEmotion(playerEntity, emotion);
        });

        app.stage.addChild(emotionEntity);
    }

    app.stage.addChild(playerEntity);
    
    document.getElementById("menu-cnv").innerHTML = null;
    document.getElementById("menu-cnv").appendChild(app.view);
};

const GameContainer: React.FC<{ 
    game: Game; 
}> = ({ game }) => {
    const localColor = useSelector(GameSelecors.select_game_color);
    const gameSlots = useSelector(GameSelecors.select_game_slots);
    const TCPSocket = useSelector(GameSelecors.select_game_tcp_socket);

    const readyToPlay = () => {
        TCPSocket.emit(
            String(Shared.Enums.SocketChannels.GAME_ON_READY_TO_PLAY)
        );
    };

    React.useEffect(() => {
        game.init();
        
        debug(
            "Method init() of the game has been called",
            `timestamp: ${Date.now()}`
        );
    }, []);

    React.useEffect(() => {
        // если игрок не подтведил готовность, рисуем менюшку
        if (!gameSlots[localColor].isReady)
            initMenuCanvas(localColor, TCPSocket);
    }, [localColor]);

    return (
        <div className={styles.game}>
            <div className={styles.menu}>
                {
                    !gameSlots[localColor].isReady &&
                    <div className={styles.test}>
                        <span>Выбери эмоцию!</span>
                        <div id="menu-cnv"></div>
                        <button onClick={readyToPlay}>играть</button>
                    </div>
                }
            </div>
            <GameCanvas />
        </div>
    );
};

export default GameContainer;
