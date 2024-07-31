

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
            <h1>Timesup</h1>
            <button id="play-button" class="main-button" onclick="start_game()">Jouer</button>
            <button id="wordlists-button" class="main-button" onclick="wordlists_screen()">Listes</button>
            <button id="settings-button" class="main-button" onclick="edit_settings()">Paramètres</button>
        </div>


        `
    )
}



function wordlists_screen() {
    getWordLists().then(lists => {
        let formatted = "";
        lists = JSON.parse(lists);
        let selected = Number(localStorage.getItem('current_wordlist_id'));
        for(let element of lists) {
            formatted += `<button class="wordlist_element ${selected == element.id ? 'selected' : ''}" id="${element.id}" onclick="edit_wordlist(${element.id})">${element.title}</button>`;
        } 
        
        screen(
            title='Mes Listes',
            content=`
            <div id="wordlists-screen">
            ${formatted}
            <div id="goto-shared-wordlist-button" onclick="sharedwordlists_screen()"><p class="shared_wordlist_text">Listes partagées</p></div>
            <div id="add-wordlist-button" onclick="new_wordlist()"><p class="add_wordlist_text">Ajouter</p></div>
            </div>
            `,
            parent=menu_screen,
        );
    }).catch(error => {
        console.error('Error fetching wordlists:', error);
    });
}




function sharedwordlists_screen() {
    getSharedWordLists().then(lists => {
        let formatted = "";
        lists = JSON.parse(lists);
        let selected = Number(localStorage.getItem('current_wordlist_id'));
        for(let element of lists) {
            formatted += `<button class="wordlist_element ${selected == element.id ? 'selected' : ''}" id="${element.id}" onclick="select_wordlist(${element.id});sharedwordlists_screen()">${element.title}</button>`;
        } 
        
        screen(
            title='Listes Partagées',
            content=`
            <div id="wordlists-screen">
            ${formatted}
            <div id="goto-private-wordlist-button" onclick="wordlists_screen()"><p class="shared_wordlist_text">Mes Listes</p></div>
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
        title='Jouer',
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
            <div class="button_panel">
                <button id="edit-wordlist-delete" class="panel_button" onclick="deleteWordList()">Supprimer</button>
                <button id="edit-wordlist-share" class="panel_button">Partager</button>
                <button id="edit-wordlist-play" class="panel_button">Choisir</button>
            </div>
            <form id="edit-wordlist-form">
                <div id="change_title">
                    <label for="edit-wordlist-title" id="title_title">Titre</label>
                    <input type="text" id="edit-wordlist-title" name="title">
                    <button id="edit-wordlist-settitle">Modifier</button>
                </div>
                <div id="edit_words">
                    <label for="edit-wordlist-words" id="words_title">Mots</label>
                    <ul id="edit-wordlist-words">
                    </ul>
                    <input type="text" id="edit-wordlist-word" name="words">
                    <input type="button" value="Ajouter" id="edit-wordlist-add">
                </div>
            </form>
        </div>
        
        `,
        parent=wordlists_screen
    );
}


function settings_screen() {
    screen(
        title='Paramètres',
        content=`
        <div id="settings-screen">
            <form id="settings-form">
                <div id="change_gametime">
                    <label for="edit-gametime" id="time_title">Temps d'un round (en secondes)</label>
                    <input type="number" id="edit-gametime" name="title">
                    <button id="edit-gametime-set">Modifier</button>
                </div>
            </form>
        </div>
        `,
        parent=menu_screen
    );
}