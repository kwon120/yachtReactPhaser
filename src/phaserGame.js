// src/PhaserGame.js
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import './phaserGame.css';
import Peer from 'peerjs';

const PhaserGame = () => {
  const gameRef = useRef(null);
  const containerRef = useRef(null);
  const peerRef = useRef(null);
  const connRef = useRef(null);
  
  useEffect(() => {
    peerRef.current = new Peer();
    peerRef.current.on('open', id => {
        console.log('My peer ID is: ' + id); //내 ID 출력
    })

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      backgroundColor: '#ffffff'
    };

    gameRef.current = new Phaser.Game(config);

    function preload() {}

    function create() {
      // 게임 로직 변수
      const centerBoard = this.add.graphics();
      const rollingDice = [];
      const holdDice = [];
      const diceButton = this.add.graphics();
      const score = [];
      const textArray = ['player','Aces', 'Deuces', 'Threes', 'Fours', 'Fives', 'Sixes', '+35Bonus', 'sum', '4 of a Kind', 'Full House', 'S. Straight', 'L.Straight', 'Yacht', 'Total'];
      const diceTexts = [];
      const clickTexts = [];
      const scoreTextsA = [];
      const scoreTextsB = [];
      const limitScoreBoardA = [];
      const limitScoreBoardB = [];
      const clickTest = [];
      let limitRolling = 3;
      let holdCount = 0;
      let currentPlayer = 'A';
      let userPlayer = 'A';
      // peer 변수
      const connectButtonFill = this.add.graphics();
      connectButtonFill.fillStyle(0xafafaf, 1).fillRect(5,5, 155, 25);
      //호스트 피어 관련
      peerRef.current.on('connection', conn => {
        connRef.current = conn;
        //호스트가 데이터를 받는 위치
        conn.on('data', data => {
            //순서
            switch(data){
                case 'differ':
                    togglePlayer();
                    break;
                case 'same':
                    break;
                default:
            }
            //굴림 주사위
            switch(data.result){
                case '':
                    console.log('null');
                case 1:
                    diceTexts[data.isDice].setText(1);
                    break;
                case 2:
                    diceTexts[data.isDice].setText(2);
                    break;
                case 3:
                    diceTexts[data.isDice].setText(3);
                    break;
                case 4:
                    diceTexts[data.isDice].setText(4);
                    break;
                case 5:
                    diceTexts[data.isDice].setText(5);
                    break;
                case 6:
                    diceTexts[data.isDice].setText(6);
                    break;
                default:
            }
            for(let i=4;i>4-data.isHold;i--){
                diceTexts[i].setText();
            }
            //홀드 주사위
            if(data.isClick === true){
                clickTexts[data.isHolding].setText(diceTexts[data.isCounting].text);
            }
            else{}
            //주사위 정리
            if(data.diceCleaner === true){
                for(let i=0; i<5; i++){
                    clickTexts[i].setText();
                    diceTexts[i].setText();
                }
            }
            //점수판
            if(data.player === 'A'){    
                scoreTextsA[data.number].setText(data.score);
                scoreTextsA[8].setText(data.sum);
                scoreTextsA[14].setText(data.total);
                if(data.sum >= 63){
                    scoreTextsA[7].setText(35);
                }
            }
            else if(data.player === 'B'){
                console.log(data.number, data.score);
                scoreTextsB[data.number].setText(data.score);
                scoreTextsB[8].setText(data.sum);
                scoreTextsB[14].setText(data.total);
                if(data.sum >= 63){
                    scoreTextsB[7].setText(35);
                }
            }
            else{}
        });
        conn.on('open', () => {
            console.log('누군가가 연결했티비');
            for(let i=0; i<5; i++){
                holdCount = 0;
                currentPlayer = 'A';
                limitRolling = 3;
                diceTexts[i].setText();
                clickTexts[i].setText();
            }
        })
    });
      // 연결 입력 버튼
      const connectButton = this.add.text(10, 10, 'Connect to Peer',{ fill: '#e3f' })
        .setInteractive()
        .on('pointerdown', () => {
          const peerId = prompt('Enter peer ID:');
          const conn = peerRef.current.connect(peerId);
          connRef.current = conn;

          conn.on('open', () => {
            console.log('Connected to: ' + peerId);
            userPlayer = 'B'
            for(let i=0; i<5; i++){
                holdCount = 0;
                currentPlayer = 'A';
                limitRolling = 3;
                diceTexts[i].setText();
                clickTexts[i].setText();
            }
          });
          //게스트가 데이터를 받는 위치
          conn.on('data', data => {
            //순서
            switch(data){
                case 'differ':
                    togglePlayer();
                    break;
                case 'same':
                    break;
                default:
            }
            //굴림 주사위
            switch(data.result){
                case 1:
                    diceTexts[data.isDice].setText(1);
                    break;
                case 2:
                    diceTexts[data.isDice].setText(2);
                    break;
                case 3:
                    diceTexts[data.isDice].setText(3);
                    break;
                case 4:
                    diceTexts[data.isDice].setText(4);
                    break;
                case 5:
                    diceTexts[data.isDice].setText(5);
                    break;
                case 6:
                    diceTexts[data.isDice].setText(6);
                    break;
                default:
            }
            for(let i=4;i>4-data.isHold;i--){
                diceTexts[i].setText();
            }
            //홀드 주사위
            if(data.isClick === true){
                clickTexts[data.isHolding].setText(diceTexts[data.isCounting].text);
            }
            else{}
            //주사위 정리
            if(data.diceCleaner === true){
                for(let i=0; i<5; i++){
                    clickTexts[i].setText();
                    diceTexts[i].setText();
                }
            }
            //점수판
            if(data.player === 'A'){    
                scoreTextsA[data.number].setText(data.score);
                scoreTextsA[8].setText(data.sum);
                scoreTextsA[14].setText(data.total);
                if(data.sum >= 63){
                    scoreTextsA[7].setText(35);
                }
            }
            else if(data.player === 'B'){
                scoreTextsB[data.number].setText(data.score);
                scoreTextsB[8].setText(data.sum);
                scoreTextsB[14].setText(data.total);
                if(data.sum >= 63){
                    scoreTextsB[7].setText(35);
                }
            }
            else {}
          });
        });
      // 중앙 보드
      centerBoard.fillStyle(0xf5dcb7, 1);
      centerBoard.fillRect(40, 130, 450, 300);
      centerBoard.lineStyle(2,0xffffff, 1);
      centerBoard.strokeRect(40, 130, 520, 300);
      //주사위 세트
      for(let i=0; i<5; i++){
        //굴릴 주사위
        rollingDice[i] = this.add.graphics();
        rollingDice[i].fillStyle(0xd1180b, 1);
        rollingDice[i].fillRect(25+i*100, 350, 85, 85);

        diceTexts[i] = this.add.text(50+i*100, 375, '',{
            fontSize: "50px",
            color: "#ffffff",
          });

        rollingDice[i].setInteractive(new Phaser.Geom.Rectangle(25+i*100, 350, 85, 85), Phaser.Geom.Rectangle.Contains);
        rollingDice[i].on('pointerdown', () => {
            if(userPlayer === currentPlayer){
                clickDice(i);
                holdCount ++;
            }
        })
        //홀드 주사위
        holdDice[i] = this.add.graphics();
        holdDice[i].fillStyle(0x0019F4,1);
        holdDice[i].fillRect(25+i*100, 100, 85, 85);
        
        clickTexts[i] = this.add.text(50+i*100, 125, '', {
            fontSize: "50px",
            color: "#ffffff",
        });
      }
      //굴림 버튼
      diceButton.fillStyle(0x00e007, 1);
      diceButton.fillRect(20, 470, 500, 50);
      diceButton.lineStyle(2, 0x0a3711, 1);
      diceButton.strokeRect(20, 470, 500, 50);
      diceButton.setInteractive(new Phaser.Geom.Rectangle(20, 470, 500, 50), Phaser.Geom.Rectangle.Contains);
      
      diceButton.on('pointerdown', () => {
        if(userPlayer === currentPlayer){
            if(limitRolling !== 0){
                randomRolling();
                if(limitRolling === 1){
                    diceButton.fillStyle(0xeeeeee, 1);
                    diceButton.fillRect(20, 470, 500, 50);
                }
                limitRolling--;
            }
            else{
                alert('limit');
            }
        }
      });
      //점수판
      for(let i=0; i<15; i++){
        score[i] = this.add.graphics();
        for(let j=0; j<3; j++){
            switch(i) {
                case 7:
                    score[i].fillStyle(0xffd400, 1);
                    break;
                case 8:
                    score[i].fillStyle(0xffd400, 1);
                    break;
                case 14:
                    score[i].fillStyle(0xffd400, 1);
                    break;
                default:
                    score[i].fillStyle(0xeeeeee, 1);
            }
            score[i].fillRect(530+j*80, 70+i*30, 80, 30);
            score[i].lineStyle(1,0x000000);
            score[i].strokeRect(530+j*80, 70+i*30, 80, 30);
        }
        score[0].fillStyle(0x3df56f,1);
        score[0].fillRect(530+80, 70, 80, 30);
        score[0].lineStyle(1,0x000000);
        score[0].strokeRect(530+80, 70, 80, 30);

        this.add.text(530, 77+i*30, textArray[i]).setColor('0x000000');
        if(i === 0){
            this.add.text(555+80, 70+i*30, 'A').setColor('0x000000');
            this.add.text(555+160, 70+i*30, 'B').setColor('0x000000');
        }
        else{
            scoreTextsA[i] = this.add.text(555+80, 70+i*30).setColor('0x000000');
            scoreTextsB[i] = this.add.text(555+160, 70+i*30).setColor('0x000000');
            score[i].setInteractive(new Phaser.Geom.Rectangle(530, 70+i*30, 80, 30), Phaser.Geom.Rectangle.Contains);
            score[i].on('pointerdown', () => {
                if(userPlayer === currentPlayer){
                    writeScore(i);
                }
            })
        }
      }
      //랜덤주사위 굴리기 함수
      function randomRolling(){
        for(let i=0; i<5; i++){
            clickTest[i] = 0;
        }
        for(let i=0; i<5-holdCount; i++){
            const rollingResult = Math.floor(Math.random()*6)+1;
            diceTexts[i].setText(rollingResult);
            if(connRef.current && connRef.current.open) {
                connRef.current.send({
                    result : rollingResult,
                    isDice : i,
                    isHold : holdCount,
                    diceCleaner : false,
                    isClick : false,
                });
            }
        }
        for(let i=4; i>4-holdCount; i--){
            diceTexts[i].setText();
        }

      }
      //홀드주사위 이동 함수
      function clickDice(i){
        if(diceTexts[i].text === ''){
            holdCount--;
            return;
        }
        if(clickTest[i] === 1){
            holdCount--;
            return;
        }
        clickTest[i] = 1;
        if(5-holdCount > 0){
            clickTexts[holdCount].setText(diceTexts[i].text);
            if(connRef.current && connRef.current.open) {
                connRef.current.send({
                    isCounting : i,
                    isHolding : holdCount,
                    isClick : true,
                });
            }
        }
        else {
            holdCount --;
        }
      }
      //점수판 기록 함수
      function writeScore(number){
        let sum = 0;
        let total = 0;
        if(clickTexts.some((e) => e.text === '')){
            return;
        }
        if(currentPlayer === 'A'){
            if(limitScoreBoardA[number] === 1){
                alert('limit');
                return;
            }
            else{
                limitScoreBoardA[number] = 1;
            }
        }
        else {
            if(limitScoreBoardB[number] === 1){
                alert('limit');
                return;
            }
            else{
                limitScoreBoardB[number] = 1;
            }
        }
        switch(number){
            case 0:
                return;
            case 7:
                return;
            case 8:
                return;
            case 14:
                return;
            default:{
                limitRolling = 3;
                holdCount = 0;
                diceButton.fillStyle(0x00e007, 1);
                diceButton.fillRect(20, 470, 500, 50);
            }
        }
        let getScore = calculator(number);
        if(currentPlayer === 'A'){
            scoreTextsA[number].setText(getScore);
            for(let i=1; i<8; i++){
                if(i === 7){
                    if(sum >= 63){
                        scoreTextsA[7].setText(35);
                    }
                }
                sum+=Number(scoreTextsA[i].text);
            }
            scoreTextsA[8].setText(sum);
            for(let i=8; i<14; i++){
                total+=Number(scoreTextsA[i].text);
            }
            scoreTextsA[14].setText(total);
        }
        else {
            scoreTextsB[number].setText(getScore);
            for(let i=1; i<8; i++){
                if(i === 7){
                    if(sum >= 63){
                        scoreTextsB[7].setText(35);
                    }
                }
                sum+=Number(scoreTextsB[i].text);
            }
            scoreTextsB[8].setText(sum);
            for(let i=8; i<14; i++){
                total+=Number(scoreTextsB[i].text);
            }
            scoreTextsB[14].setText(total);
        }
        if (connRef.current && connRef.current.open) {
            connRef.current.send({
                player: currentPlayer, 
                sum: sum, 
                total: total, 
                number: number,
                score: getScore,
                diceCleaner : true,
            });
          }
        for(let i=0; i<5; i++){
            clickTexts[i].setText();
            diceTexts[i].setText();
        }
        holdCount = 0;
        togglePlayer();
        if (connRef.current && connRef.current.open) {
            if(currentPlayer !== userPlayer){
                connRef.current.send('differ');
            }
            else {
                connRef.current.send('same');
            }
          }
      }
      //점수판 계산 함수
      function calculator(number){
        let count = 0;
        let setCount = 0;
        let setArray = [];
        switch(number){
            //aces
            case 1:
                for(let i=0;i<5;i++){
                    if(Number(clickTexts[i].text) === 1){
                        count += Number(clickTexts[i].text);
                    }
                }
                return count;
            //deuces
            case 2:
                for(let i=0;i<5;i++){
                    if(Number(clickTexts[i].text) === 2){
                        count += Number(clickTexts[i].text);
                    }
                }
                return count;
            //threes
            case 3:
                for(let i=0;i<5;i++){
                    if(Number(clickTexts[i].text) === 3){
                        count += Number(clickTexts[i].text);
                    }
                }
                return count;
            //fours
            case 4:
                for(let i=0;i<5;i++){
                    if(Number(clickTexts[i].text) === 4){
                        count += Number(clickTexts[i].text);
                    }
                }
                return count;
            //fives
            case 5:
                for(let i=0;i<5;i++){
                    if(Number(clickTexts[i].text) === 5){
                        count += Number(clickTexts[i].text);
                    }
                }
                return count;
            //sixes
            case 6:
                for(let i=0;i<5;i++){
                    if(Number(clickTexts[i].text) === 6){
                        count += Number(clickTexts[i].text);
                    }
                }
                return count;
            //4 of a Kind
            case 9:
                for(let i=1;i<=6;i++){
                    for(let j=0; j<5; j++){
                        if(i === Number(clickTexts[j].text)){
                            setCount++;
                        }
                    }
                    if(setCount >= 4){
                        return i*4;
                    }
                    setCount = 0;
                }
                return 0;
            //Full House
            case 10:
                let fullCount = [false,false];
                for(let i=1;i<=6;i++){
                    for(let j=0; j<5; j++){
                        if(i === Number(clickTexts[j].text)){
                            setCount++;
                        }
                    }
                    if(setCount === 3){
                        count += i*3;
                        fullCount[0] = true;
                    }
                    else if(setCount === 2){
                        count += i*2;
                        fullCount[1] = true;
                    }
                    setCount = 0;
                }
                if(fullCount[0] === true && fullCount[1] === true){
                    return count;
                }
                return 0;
            //S. Straight
            case 11:
                setArray = clickTexts.map((e) => Number(e.text)).sort();
                for(let i=0; i<3; i++){
                    if(setArray[i]+1 === setArray[i+1]){
                        setCount++;
                    }
                }
                setCount === 3? count = 30: setCount = 0
                for(let i=1; i<4; i++){
                    if(setArray[i]+1 === setArray[i+1]){
                        setCount++;
                    }
                }
                setCount === 3? count = 30 : setCount = 0;
                return count;
            //L.Straight
            case 12:
                setArray = clickTexts.map((e) => Number(e.text)).sort();
                for(let i=0; i<4; i++){
                    if(setArray[i]+1 === setArray[i+1]){
                        setCount++;
                    }
                }
                setCount === 4? count = 40: count = 0;
                return count;
            //Yacht
            case 13:
                setArray = clickTexts.map((e) => Number(e.text));
                for(let i=0; i<4; i++){
                    if(setArray[i] === setArray[i+1]){
                        setCount++;
                    }
                }
                if(setArray[0] === 0){
                    setCount = 0;
                }
                setCount === 4? count = 50: count = 0;
                return count;
        }
      }
      //순서 변경 함수
      function togglePlayer(){
        if(currentPlayer === 'A'){
            currentPlayer = 'B';
            score[0].fillStyle(0x3df56f, 1);
            score[0].fillRect(530+160, 70, 80, 30);
            score[0].lineStyle(1,0x000000);
            score[0].strokeRect(530+160, 70, 80, 30);

            score[0].fillStyle(0xeeeeee, 1);
            score[0].fillRect(530+80, 70, 80, 30);
            score[0].lineStyle(1,0x000000);
            score[0].strokeRect(530+80, 70, 80, 30);
        }
        else {
            currentPlayer = 'A';
            score[0].fillStyle(0x3df56f, 1);
            score[0].fillRect(530+80, 70, 80, 30);
            score[0].lineStyle(1,0x000000);
            score[0].strokeRect(530+80, 70, 80, 30);

            score[0].fillStyle(0xeeeeee, 1);
            score[0].fillRect(530+160, 70, 80, 30);
            score[0].lineStyle(1,0x000000);
            score[0].strokeRect(530+160, 70, 80, 30);
        }
      }
    }
    function update() {}
    
    return () => {
      gameRef.current.destroy(true);
    };
  }, []);

  return <div id="phaser-game" ref={containerRef} >
    
  </div>;
};

export default PhaserGame;
