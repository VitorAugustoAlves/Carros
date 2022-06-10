class Game {
  constructor() {}

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();
    car1 = createSprite(width / 2 - 50, height - 100);
    car2 = createSprite(width / 2 + 100, height - 100);
    car1.addImage(carro1);
    car2.addImage(carro2);
    carros = [car1, car2];
  }

  getState() {
    var gamestater = database.ref("gameState");
    gamestater.on("value", function (data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state,
    });
  }
  play() {
    Player.getPlayerInfo();
    this.resetb()
    this.handleElement();
    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
      this.showLeaderboard();
      var index = 0;
      for (var ply in allPlayers) {
        index += 1;
        var x = allPlayers[ply].positionX;
        var y = height - allPlayers[ply].positionY;
        carros[index - 1].position.x = x;
        carros[index - 1].position.y = y;
        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
        }
      }
      drawSprites();
      this.playerControl();
    }
  }
  handleElement() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
    //criação dos botões de maneira 'tradicional'
    this.resetTitle.html("Reinicar Jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Placar");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }
  playerControl() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }
    if (keyIsDown(LEFT_ARROW)&&player.positionX>width/3-50) {
      player.positionX -= 5;
      player.update();
    }
    if (keyIsDown(RIGHT_ARROW)&&player.positionX<width/2+300) {
      player.positionY += 5;
      player.update();
    }
  }
  showLeaderboard() {
    var leader1, leader2;
    //retorna matriz de valores enumeraveis dos objetos
    var players = Object.values(allPlayers);
    //verifica se o jogador 1 está no rank 1
    if ((players[0].rank === 0 && players[1].rank === 0)
        || players[0].rank === 1){
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      //exibe o texto na tela por ordem de jogador
      leader1 = players[0].rank +
                "&emsp;" + players[0].name +
                "&emsp;" + players[0].score;

      leader2 = players[1].rank +
                "&emsp;" + players[1].name +
                "&emsp;" + players[1].score;
    }

    //verifica se o jogador 2 está no rank 1
    if (players[1].rank === 1) {
      leader1 = players[1].rank +
                "&emsp;" + players[1].name +
                "&emsp;" + players[1].score;

      leader2 = players[0].rank +
                "&emsp;" + players[0].name +
                "&emsp;" + players[0].score;
    }

    //passar lideres como elementos html
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  resetb(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({

        playerCount: 0,
        gameState: 0, players:{}
      })
      window.location.reload()
    })
  }
}
