var Contacts = {
    index: window.localStorage.getItem("Contacts:index"),
    $table: document.getElementById("contacts-table"),
    $form: document.getElementById("contacts-form"),
    $buttonSave: document.getElementById("contacts-save"),
    $buttonCancel: document.getElementById("contacts-cancel"),

    initialize: function() {
        // initialize the storage index
        if (!Contacts.index) {
            window.localStorage.setItem("Contacts:index", Contacts.index = 1);
        }

        // initialize the form
        Contacts.$form.reset();
        Contacts.$buttonCancel.addEventListener("click", function(event) {
            Contacts.$form.reset();
            Contacts.$form.id_entry.value = 0;
        }, true);
        Contacts.$form.addEventListener("submit", function(event) {
            var entry = {
                id: parseInt(this.id_entry.value),
                first_name: this.first_name.value,
                last_name: this.last_name.value,
                email: this.email.value
            };
            if (entry.id == 0) { // add
                Contacts.storageAdd(entry);
                Contacts.tableAdd(entry);
            }
            else { // edit
                Contacts.storageEdit(entry);
                Contacts.tableEdit(entry);
            }

            this.reset();
            this.id_entry.value = 0;
            event.preventDefault();
        }, true);

        // initialize the table
        if (window.localStorage.length - 1) {
            var $contactsList = [], i, key;
            for (i = 0; i < window.localStorage.length; i++) {
                key = window.localStorage.key(i);
                if (/Contacts:\d+/.test(key)) {
                    $contactsList.push(JSON.parse(window.localStorage.getItem(key)));
                }
            }

            if ($contactsList.length) {
                $contactsList
                    .sort(function(a, b) {
                        return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
                    })
                    .forEach(Contacts.tableAdd);
            }
        }

        Contacts.$table.addEventListener("click", function(event) {
            var op = event.target.getAttribute("data-op");
            if (/edit|remove/.test(op)) {
                var entry = JSON.parse(window.localStorage.getItem("Contacts:"+ event.target.getAttribute("data-id")));
                if (op == "edit") {
                    Contacts.$form.first_name.value = entry.first_name;
                    Contacts.$form.last_name.value = entry.last_name;
                    Contacts.$form.email.value = entry.email;
                    Contacts.$form.id_entry.value = entry.id;
                }
                else if (op == "remove") {
                    if (confirm('Are you sure you want to remove "'+ entry.first_name +' '+ entry.last_name +'" from your contacts?')) {
                        Contacts.storageRemove(entry);
                        Contacts.tableRemove(entry);
                    }
                }
                event.preventDefault();
            }
        }, true);
    },

    storageAdd: function(entry) {
        entry.id = Contacts.index;
        window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
        window.localStorage.setItem("Contacts:index", ++Contacts.index);
    },

    tableAdd: function(entry) {
        var $tr = document.createElement("tr"), $td, key;
        for (key in entry) {
            if (entry.hasOwnProperty(key)) {
                $td = document.createElement("td");
                $td.appendChild(document.createTextNode(entry[key]));
                $tr.appendChild($td);
            }
        }
        $td = document.createElement("td");
        $td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'" style="cursor:pointer">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'" style="cursor:pointer">Remove</a>';
        $tr.appendChild($td);
        $tr.setAttribute("id", "entry-"+ entry.id);
        Contacts.$table.appendChild($tr);
    },

    storageEdit: function(entry) {
        window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
    },

    tableEdit: function(entry) {
        var $tr = document.getElementById("entry-"+ entry.id), $td, key;
        $tr.innerHTML = "";
        for (key in entry) {
            if (entry.hasOwnProperty(key)) {
                $td = document.createElement("td");
                $td.appendChild(document.createTextNode(entry[key]));
                $tr.appendChild($td);
            }
        }
        $td = document.createElement("td");
        $td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Remove</a>';
        $tr.appendChild($td);
    },

    storageRemove: function(entry) {
        window.localStorage.removeItem("Contacts:"+ entry.id);
    },

    tableRemove: function(entry) {
        Contacts.$table.removeChild(document.getElementById("entry-"+ entry.id));
    }
};
Contacts.initialize();
