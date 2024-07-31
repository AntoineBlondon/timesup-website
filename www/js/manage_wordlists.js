function new_wordlist() {
    createWordList("Nouvelle liste", ["mot1"]).then(() => {
        wordlists_screen();
    });
}


function edit_wordlist(id) {
    edit_wordlist_screen();
    getWordLists().then(lists => {
        lists = JSON.parse(lists);
        for(let element of lists) {
            if(element.id == id) {
                list = element;
            }
        }
        document.getElementById('edit-wordlist-title').value = list.title;
        document.getElementById('edit-wordlist-share').backgroundColor = list.secret ? "blue" : "purple" ;
        document.getElementById('edit-wordlist-share').innerHTML = list.secret ? "Partager" : "Partagée";
        document.getElementById('edit-wordlist-play').innerHTML = Number(localStorage.getItem('current_wordlist_id')) == id ? "Choisie" : "Choisir";
        document.getElementById('edit-wordlist-delete').onclick = () => {
            localStorage.setItem('current_wordlist_id', "");
            localStorage.setItem('current_wordlist', "");
            deleteWordList(id).then(() => {
                wordlists_screen();
            });
        };

        document.getElementById('edit-wordlist-share').onclick = () => {
            toggle_secret(id, !list.secret);
        }
        document.getElementById('edit-wordlist-settitle').onclick = () => {
            change_title(id, document.getElementById('edit-wordlist-title').value);
        };

        document.getElementById('edit-wordlist-add').onclick = () => {
            add_word(id, document.getElementById('edit-wordlist-word').value);
        };

        document.getElementById('edit-wordlist-play').onclick = () => {
            select_wordlist(id);
            document.getElementById('edit-wordlist-play').innerHTML = Number(localStorage.getItem('current_wordlist_id')) == id ? "Choisie" : "Choisir";
        }

        for(let word in list.words) {
            document.getElementById('edit-wordlist-words').innerHTML += `<li class="worditem" id="edit-wordlist-worditem-${list.words[word]}">${list.words[word]} <button class="worditem_delete_button" id="edit-wordlist-worditem-${list.words[word]}-delete">Supprimer</button></li>`;
        }
        for(let word in list.words) {
            document.getElementById(`edit-wordlist-worditem-${list.words[word]}`).onclick = () => {
                remove_word(id, list.words[word]);
            }
        }
    });
}




function change_title(id, new_title) {
    updateWordList(id, new_title, [], [], null);
    edit_wordlist(id);
  
}


function remove_word(id, word) {
    document.getElementById(`edit-wordlist-worditem-${word}`).remove();
    updateWordList(id, null, [], [word], null);

    edit_wordlist(id);

}

function add_word(id, word) {
    updateWordList(id, null, [word], [], null).then(() => {
        edit_wordlist(id);
    }).catch(error => {
        console.error('Error adding word:', error);
    });
}


function toggle_secret(id, new_value) {
    updateWordList(id, null, [], [], new_value).then(() => {
        edit_wordlist(id);
    }).catch(error => {
        console.error('Error toggling secret:', error);
    });
}

function select_wordlist(id) {
    localStorage.setItem('current_wordlist_id', id);
    load_wordlist(id);
}