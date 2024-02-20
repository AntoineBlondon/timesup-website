function load_wordlist(wordListId) {
    getWordLists().then(lists => {
        lists = JSON.parse(lists);
        for(let element of lists) {
            if(element.id == wordListId) {
                localStorage.setItem('current_wordlist', JSON.stringify(element));
            }
        }
    })
}




function start_game() {
    
    load_wordlist(1);
    
    let wordlist = JSON.parse(localStorage.getItem('current_wordlist')).words;
    localStorage.setItem('current_game', JSON.stringify({"points": [0, 0], 
                                          "current_team": 0,
                                          "found_words": [],
                                          "words": wordlist,
                                          "current_word": wordlist[0]}));
    
    shuffle_words();
    pick_word();
    game_screen();
    start_timer();
    update_display();
}

function add_points_to_team(points, team) {
    let game = localStorage.getItem('current_game');
    game = JSON.parse(game);
    game.points[team] += points;
    localStorage.setItem('current_game', JSON.stringify(game));
}

function get_points() {
    let game = localStorage.getItem('current_game');
    game = JSON.parse(game);
    return game.points;
}

function get_words() {
    let game = localStorage.getItem('current_game');
    game = JSON.parse(game);
    return game.words;
}

function switch_team() {
    let game = localStorage.getItem('current_game');
    game = JSON.parse(game);
    game.current_team = (game.current_team + 1) % 2;
    localStorage.setItem('current_game', JSON.stringify(game));

    update_display();
}

function get_current_team() {
    let game = localStorage.getItem('current_game');
    game = JSON.parse(game);
    return game.current_team;
}

function get_current_word() {
    let game = localStorage.getItem('current_game');
    game = JSON.parse(game);
    return game.current_word;
}

function set_current_word(word) {
    let game = localStorage.getItem('current_game');
    game = JSON.parse(game);
    game.current_word = word;
    localStorage.setItem('current_game', JSON.stringify(game));
}


function shuffle_words() {
    let game = localStorage.getItem('current_game');
    game = JSON.parse(game);
    game.words = game.words.sort(() => Math.random() - 0.5);
    localStorage.setItem('current_game', JSON.stringify(game));
}




function pick_word() {
    let old_word = get_current_word();
    let new_word = old_word;
    if(old_word == "done") {
        return;
    }
    
    while(new_word == old_word) {
        new_word = get_words()[Math.floor(Math.random() * get_words().length)];
    }
    set_current_word(new_word);
}



function find_word() {
    let game = localStorage.getItem('current_game');
    game = JSON.parse(game);
    game.found_words.push(game.current_word);
    game.words.splice(game.words.indexOf(game.current_word), 1);
    localStorage.setItem('current_game', JSON.stringify(game));
    add_points_to_team(1, get_current_team());

    if(game.words.length != 0) {
        pick_word();
    } else {
        set_current_word("Terminé !");
    }
    update_display()
}


function pass_word() {
    let game = localStorage.getItem('current_game');
    game = JSON.parse(game);
    if(game.words.length != 0) {
        pick_word();
    }
    update_display()
}

function continue_with_other_team() {
    document.getElementById('continue').style.display = 'none';
    document.getElementById('current_team').style.display = 'block';
    document.getElementById('points').style.display = 'block';
    pick_word();
    switch_team();
    start_timer();
    update_display();
}



function update_display() {
    document.getElementById('current_team').innerHTML = `Equipe ${get_current_team() + 1}`;
    let points = get_points();
    document.getElementById('points').innerHTML = `Equipe 1: ${points[0]} | Equipe 2: ${points[1]}`;
    document.getElementById('current_word').innerHTML = get_current_word();
}

function start_timer() {
    let max_time;
    if(localStorage.getItem("max_time")) {
        max_time = parseInt(localStorage.getItem("max_time"));
    } else {
        localStorage.setItem("max_time", 30);
        max_time = 30;
    }
    let time = max_time;
    let timer = setInterval(() => {
        time--;
        try {
            document.getElementById('timer').innerHTML = `${Math.floor(time / 60)}:${time % 60 < 10 ? '0' + time % 60 : time % 60}`;
        } catch(error) {
            clearInterval(timer);
        }
        if(time == 0) {
            clearInterval(timer);
            time_done();
        }
    }, 1000);
}


function time_done() {
    set_current_word("STOP !");
    document.getElementById('continue').style.display = 'block';
    document.getElementById('current_team').style.display = 'none';
    document.getElementById('points').style.display = 'none';
    update_display();

}