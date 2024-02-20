

function screen(title="screen", content="", parent=false) {
    document.getElementById('title').innerHTML = title;
    document.getElementById('logout').style.display = localStorage.getItem('jwt') ? 'block' : 'none';
    document.getElementById('content').innerHTML = content;

    document.getElementById('back-arrow').style.display = parent ? 'block' : 'none';
    document.getElementById('back-arrow').onclick = parent ? parent : null;
    document.getElementById('logout').onclick = logoutUser ? logoutUser : null;
    
}



function login_screen() {
    screen(
        title='Se connecter',
        content=`
        <div = "login-screen">
            <div class="switch_button" id="switch-to-register" onclick="register_screen()">Pas encore de compte ?</div>
            <form id="login-form">
                <h2>Se connecter</h2>
                <label for="login-username">Username:</label>
                <input type="text" id="login-username" name="username"><br>
                <label for="login-password">Mot de passe:</label>
                <input type="password" id="login-password" name="password"><br>
                <input class="btn" type="button" value="Se connecter" onclick="loginUser(document.getElementById('login-username').value, document.getElementById('login-password').value)">
            </form>
        </div>
    `);
}

function register_screen() {
    screen(
        title='Créer un compte',
        content=`
        <div = "register-screen">
            <div class="switch_button" id="switch-to-login" onclick="login_screen()">Deja un compte ?</div>
            <form id="register-form">
                <h2>Créer un compte</h2>
                <label for="register-username">Username:</label>
                <input type="text" id="register-username" name="username"><br>
                <label for="register-password">Mot de passe:</label>
                <input type="password" id="register-password" name="password"><br>
                <input class="btn" type="button" value="Créer un compte" onclick="registerUser(document.getElementById('register-username').value, document.getElementById('register-password').value)">
            </form>
        </div>
    `);
}




function menu_screen() {
    screen(
        title='Menu',
        content=`
        
        <div id="menu-screen">
            <button id="play-button" onclick="start_game()">Jouer</button>
            <button id="wordlists-button" onclick="wordlists_screen()">Mes listes</button>
        </div>


        `
    )
}



function wordlists_screen() {
    getWordLists().then(lists => {
        let formatted = "";
        lists = JSON.parse(lists);
        for(let element of lists) {
            formatted += `<button id="${element.id}" onclick="edit_wordlist(${element.id})">${element.title}</button>`;
        } 
        
        screen(
            title='Wordlists',
            content=`
            <div id="wordlists-screen">
            ${formatted}
            <button id="add-wordlist-button" onclick="new_wordlist()">Ajouter une liste</button>
            </div>
            `,
            parent=menu_screen,
        );
    }).catch(error => {
        console.error('Error fetching wordlists:', error);
    });
}






function game_screen() {

    screen(
        title='Play',
        content=`
        <div id="play-screen">
            <div id="current_word">word</div>
            <div id="timer">Ça commence !</div>
            <div id="current_team">team</div>
            <div id="points">points</div>
            <button id="continue" onclick="continue_with_other_team()" style="display: none">Continuer</button>
            <button id="find_word" onclick="find_word()">Trouvé !</button>
            <button id="pass_word" onclick="pass_word()">Passer</button>
        </div>
        `,
        parent=menu_screen
    );

}


function edit_wordlist_screen() {
    screen(
        title='Modifier',
        content=`
        <div id="edit-wordlist-screen">
            <button id="edit-wordlist-delete" onclick="deleteWordList()">Supprimer</button>
            <form id="edit-wordlist-form">
                <h2>Modifier une liste</h2>
                <label for="edit-wordlist-title">Titre:</label>
                <input type="text" id="edit-wordlist-title" name="title"><br>
                <button id="edit-wordlist-settitle">Modifier</button>
                <label for="edit-wordlist-words">Mots:</label>
                <ul id="edit-wordlist-words">
                </ul>
                <input type="text" id="edit-wordlist-word" name="words"><br>
                <input type="button" value="Ajouter" id="edit-wordlist-add">
            </form>
        </div>
        
        `,
        parent=wordlists_screen
    );
}