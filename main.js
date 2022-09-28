const round = document.getElementById('round') //Ronda en la que va a ir el usuario
const simonButtons = document.getElementsByClassName('sqare') //Los 4 botones de colores
const startButton = document.getElementById('startButton') //Botón para iniciar el juego

class Simon {
    constructor(simonButtons, startButton, round) {
        //Propiedades:
        this.round = 0 //En qué ronda del juego está el usuario, incializada en 0
        this.userPosition = 0 //Para saber en qué momento se encuentra el usuario del total de la secuencia de colores que tiene que tocar
        this.totalRounds = 10 //Cuántas rondas tiene el juego para determinar cuándo el jugador gana
        this.sequence = [] //Secuencia de colores que tiene que seguir el usuario
        this.speed = 1000 //Tiempo entre un color y otro
        this.blockedButtons = true //Significa cuándo los botones están bloqueados, que lo estarán cuando se marque la secuencia que deberça seguir el jugador
        this.buttons = Array.from(simonButtons) //Matriz de los botones
        this.display = {
            startButton,
            round
        }
        //Sonidos:
        this.errorSound = new Audio('./sounds/error.wav')
        history.buttonSounds = [
            new Audio('./sounds/1.mp3'),
            new Audio('./sounds/2.mp3'),
            new Audio('./sounds/3.mp3'),
            new Audio('./sounds/4.mp3')
        ]
    }
    //Métodos:

    //Iniciar el Simon:
    init() {
        this.display.startButton.onclick = () => this.startGame();
    }

    //Iniciar el juego:
    startGame() {
        this.display.startButton.disabled = true 
        this.updateRound(0)
        this.userPosition = 0
        this.sequence = this.createSequence()
        this.buttons.forEach((element, index) => {
            element.classList.remove('winner')
            element.onclick = () => this.buttonClick(index)
        })
        this.showSequence() 
    }

    //Actualizar la ronda y el tablero:
    updateRound(value) {
        this.round = this.display.round.textContent = `Round ${this.round}`
    }

    //Crear la matriz de botones aleatoriamente:
    createSequence() {
        return Array.from({length: this.totalRounds}, () => this.getRandomColor())
    }

    //Devolver un número al azar entre 0 y 3:
    getRandomColor() {
        return Math.floor(Math.random() * 4) 
    }

    //Ejecutar función cuando se hace click en un botón:
    buttonClick(value) {
        !this.blockedButtons && this.validateChosenColor(value)
    }

    //Validar si el botón tocado por el jugador corresponde con el de la secuencia dada:
    validateChosenColor(value) {
        if(this.sequence[this.userPosition] === value) {
            this.buttonSounds[value].play()
            if(this.round === this.userPosition) {
                this.updateRound(this.round + 1)
                this.speed /= 1.025
                this.isGameOver()
            }
            else {
                this.userPosition++
            }
        }
        else {
            this.gameLost()
        }
    }

    //Verificar que le juego no haya terminado:
    isGameOver() {
        if(this.round === this.totalRounds) {
            this.gameWon()
        }
        else {
            this.userPosition = 0
            this.showSequence()
        }
    }

    //Mostrar secuencia de botones que va a tener uqe seguir el jugador:
    showSequence() {
        this.blockedButtons = true;
        let sequenceIndex = 0;
        let timer = setInterval(() => {
            const button = this.buttons[this.sequence[sequenceIndex]];
            this.buttonSounds[this.sequence[sequenceIndex]].play();
            this.toggleButtonStyle(button)
            setTimeout( () => this.toggleButtonStyle(button), this.speed / 2)
            sequenceIndex++;
            if (sequenceIndex > this.round) {
                this.blockedButtons = false;
                clearInterval(timer);
            }
        }, this.speed);
    }

    //Pintar botones para cuando se muestra la secuencia:
    toggleButtonStyle(button) {
        button.classList.toggle('active')
    }

    //Actualiza el Simón cuando el jugador pierde:
    gameLost() {
        this.errorSound.play()
        this.display.startButton.disabled = false
        this.blockedButtons = true
    }

    //Mostrar animación de victoria y actualizar el Simón si el jugador gana:
    gameWon() {
        this.display.startButton.disabled = false
        this.blockedButtons = true
        this.buttons.forEach(element =>{
            element.classList.add('winner')
        })
        this.updateRound('🏆')
    }
}

const simon = new Simon(simonButtons, startButton, round)
simon.init()