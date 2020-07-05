'use strict';

const apiUrl = 'http://127.0.0.1:9999/api';
const header = {
    'Content-type': 'application/json',
};
const rootEl = document.getElementById('root');

const appName = document.createElement('h1');
appName.textContent = 'Контакты';
rootEl.appendChild(appName);

const loaderEl = document.createElement('div');
loaderEl.dataset.id = 'loader';
const loadAnimation = document.createElement('div');
loadAnimation.innerHTML = '<span data-id="action-loader"><img src=./img/loader.gif> Пожалуйста подождите</span>';
loaderEl.appendChild(loadAnimation);
rootEl.appendChild(loaderEl);

const messageError = document.createElement('div');
messageError.dataset.id = 'message';
messageError.style.color = 'red';
messageError.style.display = 'none';
rootEl.appendChild(messageError);

const searchInputEl = document.createElement('input');
searchInputEl.dataset.id = 'search-input';
rootEl.appendChild(searchInputEl);

const searchInputButton = document.createElement('button');
searchInputButton.dataset.id = 'search-button';
searchInputButton.textContent = 'Поиск';
rootEl.appendChild(searchInputButton);

const clearSearchResults = document.createElement('button');
clearSearchResults.dataset.id = 'clear-results';
clearSearchResults.textContent = 'X';
clearSearchResults.style.display = 'none';
rootEl.appendChild(clearSearchResults);

const searchResults = document.createElement('div');
searchResults.dataset.id = 'search-results';
rootEl.appendChild(searchResults);

searchInputButton.onclick = () => {
    contactsEl.style.display = 'none';
    searchResults.textContent = '';
    const filterItems = (query) => {
        return contacts.filter((el) =>
            el.name.toLowerCase().indexOf(query.toLowerCase()) > -1
        );
    }
    renderContacts(searchResults, filterItems(searchInputEl.value));
    clearSearchResults.style.display = 'block';
}

clearSearchResults.onclick = () => {
    searchResults.textContent = '';
    searchInputEl.value = '';
    contactsEl.style.display = 'block';
    clearSearchResults.style.display = 'none';
}

const addContactButton = document.createElement('button');
addContactButton.dataset.id = 'add-button';
addContactButton.class = 'add-button';
addContactButton.textContent = '+ Добавить новый контакт';
rootEl.appendChild(addContactButton);

const formEl = document.createElement('form');
formEl.dataset.id = 'contact-form';
formEl.style.display = 'none';
rootEl.appendChild(formEl);

const saveEl = document.createElement('button');
saveEl.dataset.id = 'save';
saveEl.textContent = 'Сохранить';

const cancelEl = document.createElement('button');
cancelEl.dataset.id = 'cancel';
cancelEl.textContent = 'Отмена';

addContactButton.onclick = () => {
    formEl.style.display = 'block';
    rootEl.removeChild(addContactButton);
    fieldEl.appendChild(cancelEl);
    if (fieldEl.querySelector('[data-id="save"]')) { fieldEl.removeChild(saveEl); }
}

cancelEl.onclick = () => {
    formEl.style.display = 'none';
    contactsEl.style.display = 'block';
    rootEl.insertBefore(addContactButton, formEl);
    fieldEl.removeChild(cancelEl);
    if (document.getElementById('save')) { fieldEl.removeChild(saveEl); }
    formEl.reset();
    fieldEl.appendChild(addEl);
    contactIdEl.value = 0;
    if (fieldEl.disabled = true) { fieldEl.disabled = false; }
}

const fieldEl = document.createElement('fieldset');
fieldEl.dataset.id = 'contact-fields';
formEl.appendChild(fieldEl);

const nameLabel = document.createElement('label');
nameLabel.textContent = ' ФИО: ';
nameLabel.htmlFor = 'name';
fieldEl.appendChild(nameLabel);
const nameEl = document.createElement('input');
nameEl.dataset.input = 'name';
nameEl.id = 'name';
fieldEl.appendChild(nameEl);

const newString1 = document.createElement('br');
fieldEl.appendChild(newString1);

const phoneLabel = document.createElement('label');
phoneLabel.textContent = ' Телефон: ';
phoneLabel.htmlFor = 'phone';
fieldEl.appendChild(phoneLabel);
const phoneEl = document.createElement('input');
phoneEl.dataset.input = 'phone';
phoneEl.id = 'phone';
fieldEl.appendChild(phoneEl);

const newString2 = document.createElement('br');
fieldEl.appendChild(newString2);

const homePhone = document.createElement('input');
homePhone.dataset.input = 'home-phone';
homePhone.id = 'home-phone';
fieldEl.insertBefore(homePhone, newString2);
const homePhoneLabel = document.createElement('label');
homePhoneLabel.textContent = ' Домашний: ';
homePhoneLabel.htmlFor = 'home-phone';
fieldEl.insertBefore(homePhoneLabel, homePhone);
const brElement = document.createElement('br');
fieldEl.insertBefore(brElement, homePhoneLabel);

const emailLabel = document.createElement('label');
emailLabel.textContent = ' Email: ';
emailLabel.htmlFor = 'email';
fieldEl.appendChild(emailLabel);
const emailEl = document.createElement('input');
emailEl.dataset.input = 'email';
emailEl.id = 'email';
fieldEl.appendChild(emailEl);

const newString3 = document.createElement('br');
fieldEl.appendChild(newString3);

const email2Label = document.createElement('label');
email2Label.textContent = ' Email 2: ';
email2Label.htmlFor = 'email';
fieldEl.appendChild(email2Label);
const email2El = document.createElement('input');
email2El.dataset.input = 'email2';
email2El.id = 'email2';
fieldEl.appendChild(email2El);

const newString4 = document.createElement('br');
fieldEl.appendChild(newString4);

const addressLabel = document.createElement('label');
addressLabel.textContent = ' Адрес: ';
addressLabel.htmlFor = 'address';
fieldEl.appendChild(addressLabel);
const addressEl = document.createElement('input');
addressEl.dataset.input = 'address';
addressEl.id = 'address';
fieldEl.appendChild(addressEl);

const newString5 = document.createElement('br');
fieldEl.appendChild(newString5);

const address2Label = document.createElement('label');
address2Label.textContent = ' Aдрес 2: ';
address2Label.htmlFor = 'address2';
fieldEl.appendChild(address2Label);
const address2El = document.createElement('input');
address2El.dataset.input = 'address-2';
address2El.id = 'address-2';
fieldEl.appendChild(address2El);

const newString6 = document.createElement('br');
fieldEl.appendChild(newString6);

const contactIdEl = document.createElement('input');
contactIdEl.type = 'hidden';
contactIdEl.value = '0';
fieldEl.appendChild(contactIdEl);

const addEl = document.createElement('button');
addEl.dataset.action = 'add';
addEl.textContent = 'Создать';
fieldEl.appendChild(addEl);

formEl.addEventListener('submit', evt => {
    evt.preventDefault();
    messageError.textContent = '';
    messageError.style.display = 'none';
    if (nameEl.value.trim() === '') {
        nameEl.focus();
        messageError.textContent = 'Введите имя контакта';
        messageError.style.color = 'red';
        messageError.style.display = 'block';
        return;
    }

    contactIdEl.value = contactIdEl.value;
    let contact = {
        'id': +contactIdEl.value,
        'name': nameEl.value.trim(),
        'phone': phoneEl.value,
        'phone2': homePhone.value,
        'email': emailEl.value,
        'email2': email2El.value,
        'address': addressEl.value,
        'address2': address2El.value,
    };
    loaderEl.style.display = 'none';
    ajax('POST', `${apiUrl}/posts`, header, {
        onStart: () => {
            loaderEl.style.display = 'block';
            fieldEl.disabled = true;
        },
        onFinish: () => {
            loaderEl.style.display = 'none';
            fieldEl.disabled = false;
            formEl.reset();
            nameEl.focus();
        },
        onSuccess: data => {
            contact = JSON.parse(data);
            contacts.push(contact);
            contacts.sort(function(a, b) {
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                return 0;
            })
            contactsEl.textContent = '';
            renderContacts(contactsEl, contacts);
            formEl.style.display = 'none';
            rootEl.insertBefore(addContactButton, formEl);
        },
    }, JSON.stringify(contact)); //posting contact
});

const contactsEl = document.createElement('div');
contactsEl.dataset.id = 'contacts';
rootEl.appendChild(contactsEl);
let contacts = [];
ajax('GET', `${apiUrl}/posts`, '', {
    onStart: () => {
        loaderEl.style.display = 'block';
        fieldEl.disabled = true;
    },
    onError: error => {
        console.log(error.message);
        messageError.textContent = 'Соединение с сервером отсутствует. Пожалуйста проверьте подключение к сети и обновите страницу';
        messageError.style.display = 'block';
    },
    onFinish: () => {
        loaderEl.style.display = 'none';
    },
    onSuccess: data => {
        if (data) {
            contacts = JSON.parse(data);
            contacts.sort(function(a, b) {
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                return 0;
            })
            renderContacts(contactsEl, contacts);
            fieldEl.disabled = false;
        }
    },
}, ''); //load

function ajax(method, url, headers, callbacks, body) {
    if (typeof callbacks.onStart === 'function') {
        callbacks.onStart();
    }
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = () => {
        if (xhr.status < 200 || xhr.status > 299) {
            const error = xhr.responseText;
            if (typeof callbacks.onError === 'function') {
                callbacks.onError(error);
            }
            return;
        }
        const data = xhr.responseText;
        if (typeof callbacks.onSuccess === 'function') {
            callbacks.onSuccess(data);
        }
    };
    xhr.onerror = () => {
        if (typeof callbacks.onError === 'function') {
            callbacks.onError({ error: 'network error' });
        }
    };
    xhr.onloadend = () => {
        if (typeof callbacks.onFinish === 'function') {
            callbacks.onFinish();
        }
    };
    for (const head of Object.keys(headers)) {
        xhr.setRequestHeader(head, headers[head]);
    }
    if (body) {
        xhr.send(body);
    } else {
        xhr.send();
    }
}

function makeContactEl(contact) {
    const newContactEl = document.createElement('div');
    newContactEl.dataset.type = 'contact';
    newContactEl.dataset.contactId = contact.id;

    const nameOfContact = document.createElement('div');
    nameOfContact.dataset.contactPart = 'name';
    nameOfContact.style.fontSize = '20px';
    nameOfContact.textContent = contact.name;
    newContactEl.appendChild(nameOfContact);

    const openContact = document.createElement('button');
    openContact.dataset.action = 'show';
    openContact.textContent = 'Подробнее';
    newContactEl.appendChild(openContact);

    openContact.onclick = () => {
        const phoneOfContact = document.createElement('div');
        phoneOfContact.style.fontWeight = 'bold';
        if (contact.phone.length !== 0) { phoneOfContact.textContent = `Мобильный: ${contact.phone}`; }
        newContactEl.appendChild(phoneOfContact);

        const phone2OfContact = document.createElement('div');
        if (contact.phone2.length !== 0) { phone2OfContact.textContent = `Домашний: ${contact.phone2}`; }
        newContactEl.appendChild(phone2OfContact);

        const emailOfContact = document.createElement('div');
        if (contact.email.length !== 0) { emailOfContact.textContent = `Email: ${contact.email}`; }
        newContactEl.appendChild(emailOfContact);

        const email2OfContact = document.createElement('div');
        if (contact.email2.length !== 0) { email2OfContact.textContent = `Email 2: ${contact.email2}`; }
        newContactEl.appendChild(email2OfContact);

        const addressOfContact = document.createElement('div');
        addressOfContact.dataset.postPart = 'address';
        if (contact.address.length !== 0) { addressOfContact.textContent = `Адрес: ${contact.address}`; }
        newContactEl.appendChild(addressOfContact);

        const address2OfContact = document.createElement('div');
        address2OfContact.dataset.postPart = 'address2';
        if (contact.address2.length !== 0) { address2OfContact.textContent = `Адрес 2: ${contact.address2}`; }
        newContactEl.appendChild(address2OfContact);

        const buttonsContainer = document.createElement('div');
        newContactEl.appendChild(buttonsContainer);

        editCurrentPost(buttonsContainer, contact, nameOfContact, phoneOfContact, emailOfContact, addressOfContact, phone2OfContact, email2OfContact, address2OfContact);

        const removeEl = document.createElement('button');
        removeEl.dataset.action = 'remove';
        removeEl.textContent = 'Удалить';
        buttonsContainer.appendChild(removeEl);

        removeContact(contact, newContactEl, removeEl);

        newContactEl.removeChild(openContact);

        const closeContact = document.createElement('button');
        closeContact.dataset.action = 'hide';
        closeContact.textContent = 'Скрыть';
        newContactEl.appendChild(closeContact);
        newContactEl.appendChild(lineEl);

        closeContact.onclick = () => {
            newContactEl.removeChild(lineEl);
            newContactEl.removeChild(phoneOfContact);
            newContactEl.removeChild(emailOfContact);
            newContactEl.removeChild(addressOfContact);
            newContactEl.removeChild(phone2OfContact);
            newContactEl.removeChild(email2OfContact);
            newContactEl.removeChild(address2OfContact);
            newContactEl.removeChild(buttonsContainer);
            newContactEl.removeChild(closeContact);
            newContactEl.appendChild(openContact);
            newContactEl.appendChild(lineEl);
        }
    };

    const lineEl = document.createElement('hr');
    newContactEl.appendChild(lineEl);
    return newContactEl;
}

function editCurrentPost(divContainer, currentContact, authorOfContact, telephoneOfContact, mailOfContact, textofContact, telephone2OfContact, mail2OfContact, text2ofContact) {
    const editEl = document.createElement('button');
    editEl.dataset.action = 'edit';
    editEl.textContent = 'Изменить контакт';
    divContainer.appendChild(editEl);

    editEl.onclick = () => {
        formEl.style.display = 'block';
        contactsEl.style.display = 'none';
        nameEl.value = currentContact.name;
        phoneEl.value = currentContact.phone;
        emailEl.value = currentContact.email;
        addressEl.value = currentContact.address;
        homePhone.value = currentContact.phone2;
        email2El.value = currentContact.email2;
        address2El.value = currentContact.address2;
        contactIdEl.value = currentContact.id;
        fieldEl.removeChild(addEl);
        fieldEl.appendChild(saveEl);
        fieldEl.appendChild(cancelEl);
        if (rootEl.querySelector('[data-id="add-button"]')) {
            rootEl.removeChild(addContactButton);
        }
    };
    saveEl.onclick = () => {
        contactsEl.style.display = 'block';
        contactIdEl.value = contactIdEl.value;
        if (nameEl.value.trim() === '') {
            nameEl.focus();
            messageError.textContent = 'Введите имя контакта';
            messageError.style.color = 'red';
            messageError.style.display = 'block';
            return;
        }

        let editContact = {
            'id': +contactIdEl.value,
            'name': nameEl.value.trim(),
            'phone': phoneEl.value,
            'phone2': homePhone.value,
            'email': emailEl.value,
            'email2': email2El.value,
            'address': addressEl.value,
            'address2': address2El.value,
        };
        ajax('POST', `${apiUrl}/posts`, header, {
            onStart: () => {
                loaderEl.style.display = 'block';
                fieldEl.disabled = true;
            },
            onFinish: () => {
                loaderEl.style.display = 'none';
                fieldEl.disabled = false;
                formEl.reset();
                contactIdEl.value = 0;
                fieldEl.removeChild(saveEl);
                fieldEl.removeChild(cancelEl);
                fieldEl.appendChild(addEl);
                const index = contacts.findIndex(o => o.id === editContact.id);
                contacts[index].name = editContact.name;
                contacts[index].phone = editContact.phone;
                contacts[index].email = editContact.email;
                contacts[index].address = editContact.address;
                contacts[index].phone2 = editContact.phone2;
                contacts[index].email2 = editContact.email2;
                contacts[index].address2 = editContact.address2;
                if (fieldEl.disabled = true) { fieldEl.disabled = false; }
                formEl.style.display = 'none';
                rootEl.insertBefore(addContactButton, formEl);
            },
            onSuccess: (data) => {
                editContact = JSON.parse(data);
                authorOfContact.textContent = nameEl.value;
                telephoneOfContact.textContent = phoneEl.value;
                mailOfContact.textContent = emailEl.value;
                textofContact.textContent = addressEl.value;
                telephone2OfContact.textContent = homePhone.value;
                mail2OfContact.textContent = email2El.value;
                text2ofContact.textContent = address2El.value;
            },
        }, JSON.stringify(editContact)); //editing
    };
}

function renderContacts(el, items) {
    items.map(makeContactEl).forEach(element => {
        el.appendChild(element);
    });
}

function removeContact(currentContact, newContact, remove) {
    remove.onclick = () => {
        if (contactsEl.style.display === 'none') {
            searchResults.removeChild(newContact);
        } else { contactsEl.removeChild(newContact); }

        ajax('DELETE', `${apiUrl}/posts/${currentContact.id}`, '', {
            onStart: () => {
                loaderEl.style.display = 'block';
            },
            onFinish: () => {
                loaderEl.style.display = 'none';
            },
            onSuccess: () => {
                contacts = contacts.filter(o => o.id !== currentContact.id);
            },
        }, null); ///delete 
    };
}