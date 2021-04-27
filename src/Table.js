import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from './components/button/Button.jsx';
import Cartes from './views/carte/Cartes';
import StartGame from './views/startGame/StartGame.jsx';

const cardArray = [
  'KS',
  'QS',
  'JS',
  'AS',
  '2S',
  '3S',
  '4S',
  '5S',
  '6S',
  '7S',
  '8S',
  '9S',
  '0S',
  'KD',
  'QD',
  'JD',
  'AD',
  '2D',
  '3D',
  '4D',
  '5D',
  '6D',
  '7D',
  '8D',
  '9D',
  '0D',
  'KH',
  'QH',
  'JH',
  'AH',
  '2H',
  '3H',
  '4H',
  '5H',
  '6H',
  '7H',
  '8H',
  '9H',
  '0H',
  'KC',
  'QC',
  'JC',
  'AC',
  '2C',
  '3C',
  '4C',
  '5C',
  '6C',
  '7C',
  '8C',
  '9C',
  '0C',
];

class Table extends React.Component {
  constructor() {
    super();

    this.state = {
      counterPlayer: 0,
      counterDealer: 0,
      playerCardList: [],
      dealerCardList: [],
      startGame: false,
      premierLance: 'yes',
      endGame: false,
      nameOfWinner: '',
    };
  }

  // Tirage random cartes
  rndCarte() {
    let rndCarteTemp = '';

    let rndNumTemp = Math.floor(Math.random() * 53);

    if (rndNumTemp > 52) {
      rndNumTemp = rndNumTemp - 10;
    } else if (rndNumTemp < 1) {
      rndNumTemp = rndNumTemp + 10;
    }

    rndCarteTemp = cardArray[rndNumTemp - 1];

    return rndCarteTemp;
  }

  onClickStop = () => {
    //  Tirage random des deux premières cartes du dealer
    const cardSelectedDealer = this.rndCarte();
    const cardSelectedDealer2 = this.rndCarte();

    //  Conserve le premier caractère de la random carte du dealer (ex: KC donne K ) et lui donne la valeur de type number 10 si le premier caractère = K,Q,J et 0 sinon parseInt la valeur de la carte
    const valueCarteDealer = this.transformCardIntoInt(
      cardSelectedDealer.split('')[0]
    );
    const valueCarteDealer2 = this.transformCardIntoInt(
      cardSelectedDealer2.split('')[0]
    );

    // Les deux cartes du dealer sous forme d'array de string
    const cardsDealer = [cardSelectedDealer, cardSelectedDealer2];

    // Valeur de la main du dealer
    let dealerValue = valueCarteDealer + valueCarteDealer2;

    // Déclaration de la variable utilisé dans le while
    let endGameAndWinner = {
      endGame: false,
      nameOfWinner: '',
    };

    // While qui détermine le vainqueur et met à jour la variable endGameAndWinner
    while (dealerValue < 17) {
      const cardSelectedDealer = this.rndCarte();
      const valueCarteDealer = this.transformCardIntoInt(
        cardSelectedDealer.split('')[0]
      );

      cardsDealer.push(cardSelectedDealer);

      dealerValue += valueCarteDealer;

      if (dealerValue > 21) {
        endGameAndWinner = {
          endGame: true,
          nameOfWinner: 'Player',
        };

        break;
      }
    }
    if (dealerValue <= 21) {
      if (this.state.counterPlayer > 21) {
        endGameAndWinner = {
          endGame: true,
          nameOfWinner: 'Dealer',
        };
      } else if (this.state.counterPlayer < dealerValue) {
        endGameAndWinner = {
          endGame: true,
          nameOfWinner: 'Dealer',
        };
      } else {
        endGameAndWinner = {
          endGame: true,
          nameOfWinner: 'Player',
        };
      }
    }

    this.setState({
      counterDealer: dealerValue,
      dealerCardList: cardsDealer,
      nameOfWinner: endGameAndWinner.nameOfWinner,
      endGame: endGameAndWinner.endGame,
    });
  };

  // Distribue une carte et met à jour la main du joueur et la valeur de sa main
  onClickGive = () => {
    const cardSelected = this.rndCarte();
    const valueCarte = this.transformCardIntoInt(cardSelected.split('')[0]);
    const totalPlayerValue = this.state.counterPlayer + valueCarte;

    this.setState({
      counterPlayer: totalPlayerValue,
      playerCardList: [...this.state.playerCardList, cardSelected],
    });
  };

  // Calcul la valeur de la main et la transforme en value de type number
  transformCardIntoInt(cardValue) {
    if (
      cardValue === 'K' ||
      cardValue === 'Q' ||
      cardValue === 'J' ||
      cardValue === 'A' ||
      cardValue === '0'
    ) {
      cardValue = '10';
    }

    return parseInt(cardValue);
  }

  // Distribution des deux premiètes cartes au joueur dès le début du jeu et maj du state correspondant
  startGame = () => {
    const cardSelected = this.rndCarte();
    const cardSelected2 = this.rndCarte();

    const valueCarte = this.transformCardIntoInt(cardSelected.split('')[0]);
    const valueCarte2 = this.transformCardIntoInt(cardSelected2.split('')[0]);

    const firstPlayerValue = valueCarte + valueCarte2;

    const firstTwoCardsPlayer = [cardSelected, cardSelected2];

    this.setState({
      counterPlayer: firstPlayerValue,
      playerCardList: firstTwoCardsPlayer,
      startGame: true,
    });
  };

  render() {
    if (this.state.startGame == false) {
      return <StartGame startGame={this.startGame} />;
    } else {
      return (
        <div>
          <div className='playGame'>
            <div style={{ height: '100vh', position: 'relative' }}>
              <h1 style={{ color: '#feb236', textAlign: 'center' }}>
                Black Jack
              </h1>
              <Cartes key={'dealer'} cardList={this.state.dealerCardList} />
              {this.state.endGame && (
                <div className='winlost'>
                  <h1>Winner is {this.state.nameOfWinner}</h1>
                </div>
              )}
              <Cartes key={'player'} cardList={this.state.playerCardList} />

              <div
                style={{ bottom: '20px', position: 'absolute' }}
                className='row col-6 offset-3 flex d-flex justify-content-between'
              >
                <div className='d-grid gap-2'>
                  <Button
                    onClick={this.onClickGive}
                    classe='btn btn-outline-warning btn-lg rounded-pill'
                    color='white'
                    bcolor='#0d6efd'
                    name='Give'
                  />
                </div>
                <div></div>
                <div className='d-grid gap-2'>
                  <Button
                    onClick={this.onClickStop}
                    classe='btn btn-outline-warning btn-lg rounded-pill'
                    color='white'
                    bcolor='#dc3545'
                    name='Stop'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Table;
