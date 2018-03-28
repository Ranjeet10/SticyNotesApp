var notes = document.getElementById("list-items");
var factory = new Factory();

// Observer Definition
function SaveToLocalStorage() {
    this.handlers = [];  // observers
}

//Demonstarting the use of prototype
SaveToLocalStorage.prototype = {

    subscribe: function(fn) {
        this.handlers.push(fn);
    },

    unsubscribe: function(fn) {
        this.handlers = this.handlers.filter(
            function(item) {
                if (item !== fn) {
                    return item;
                }
            }
        );
    },

    fire: function(o, thisObj) {
        var scope = thisObj || window;
        this.handlers.forEach(function(item) {
            item.call(scope, o);
        });
    }
}

//Making use of Factory pattern to create Note objects
function Factory() {

    this.createNote = function (title, content) {
        var note = new Note();

        note.title = title;
        note.content = content;

        note.description = function () {
            console.log("Title: " + this.title + "Content: " + this.content);
        }

        return note;
    }
}

(function (){
    function onCreateNoteClick(){
      notes.classList.add("list-items-blur");

        var html = "<div class=\"modal-container\">\n" +
            "    <section class=\"create-modal\">\n" +
            "        <div class=\"form-group title\">\n" +
            "            <label class=\"sr-only\">Title</label>\n" +
            "             <p id=\"error-title\">Please give a content to save the details.</p>"+
            "            <input type=\"text\" id=\"id-title\" placeholder=\"Title...\" class=\"form-control\">\n" +
            "        </div>\n" +
            "        <div class=\"form-group\">\n" +
            "            <label class=\"sr-only\">Content</label>\n" +
            "             <p id=\"error-content\">Please give a content to save the details.</p>"+
            "            <textarea type=\"text\" id=\"id-content\" placeholder=\"Content...\" class=\"form-control\"></textarea>\n" +
            "        </div>\n" +
            "        <div class=\"form-group action-btn\">\n" +
            "            <button class=\"btn btn-primary \" id='cancel-button'>Cancel</button>\n" +
            "            <button class=\"btn btn-primary\" id='save-button'>Save</button>\n" +
            "        </div>\n" +
            "    </section>\n" +
            "</div>";

        document.getElementById('modal-container').innerHTML = html;

        document.getElementById('cancel-button').addEventListener('click',function(){
            document.getElementById('modal-container').innerHTML = "";
            notes.classList.remove("list-items-blur");
        });


        document.getElementById('save-button').addEventListener('click',function(){

            var title = document.getElementById('id-title').value;
            var content = document.getElementById('id-content').value;

            if(title == "" || title === undefined) {
              document.getElementById('error-title').style.display = "block";
              return;

            }else {
              document.getElementById('error-title').style.display = "none";
            }

            if(content == "" || content === undefined) {

              document.getElementById('error-content').style.display = "block";
              return;
            }else {
              document.getElementById('error-content').style.display = "none";
            }

            //var newNoteSaved = new Note(title, content);
            var newNoteSaved = factory.createNote(title, content);

            addNewNote(newNoteSaved);

        });

    }

    function main(){
        document.getElementById('add-note').addEventListener('click',onCreateNoteClick);
        loadNotes();
    }

  main();

})();

//Using Note as a Class
function Note(title, content) {
  this.title = title;
  this.content = content;
}

function editNote(element) {
  notes.classList.add("list-items-blur");
  var title = element.getElementsByTagName("h2")[0].innerHTML;
  var content = element.getElementsByTagName("p")[0].innerHTML;

  var html = "<div class='modal-container'>" +
      "    <section class='create-modal'>" +
      "        <div class='form-group title'>" +
      "            <label class='sr-only'>Title</label>" +
      "             <p id='error-title'>Please give a content to save the details.</p>"+
      "            <input type='text' id='id-title' value='"+ title + "' class='form-control'> " +
      "        </div>" +
      "        <div class='form-group'>" +
      "            <label class='sr-only'>Content</label>" +
      "             <p id='error-content'>Please give a content to save the details.</p>"+
      "            <textarea type='text' id='id-content' class='form-control'>"+ content +"</textarea>\n" +
      "        </div>" +
      "        <div class='form-group action-btn'>" +
      "            <button class='btn btn-primary' id='cancel-edit'>Cancel</button>" +
      "            <button class='btn btn-primary' id='edit-button'>Save</button>" +
      "        </div>" +
      "    </section>" +
      "</div>";

      document.getElementById('modal-container').innerHTML = html;

      document.getElementById('cancel-edit').addEventListener('click',function(){
          document.getElementById('modal-container').innerHTML = "";
          notes.classList.remove("list-items-blur");
      });


      document.getElementById('edit-button').addEventListener('click',function(){


        var title = document.getElementById('id-title').value;
        var content = document.getElementById('id-content').value;

        if(title == "" || title === undefined) {
          document.getElementById('error-title').style.display = "block";
          return;

        }else {
          document.getElementById('error-title').style.display = "none";
        }

        if(content == "" || content === undefined) {

          document.getElementById('error-content').style.display = "block";
          return;
        }else {
          document.getElementById('error-content').style.display = "none";
        }

        element.getElementsByTagName("h2")[0].innerHTML = title;
        element.getElementsByTagName("p")[0].innerHTML = content;

        saveNotes();

        document.getElementById('modal-container').innerHTML = "";
        notes.classList.remove("list-items-blur");

      });

}

// save the notes into local storage
function saveNotes() {
    var notesArray = [];
    // For each of the notes add a note object to the array
    notes.querySelectorAll(".note").forEach(function (i, e) {
        // Save the class attribute of the div, as well as the text for the title and content text areas
        var colourClass = i.childNodes[0].getAttribute("class");

        var title = i.childNodes[0].getElementsByTagName("h2")[0].innerHTML;
        var content = i.childNodes[0].getElementsByTagName("p")[0].innerHTML;

        notesArray.push({ Index: e, Title: title, Content: content});
    });

    // encode json
    //var jsonStr = JSON.stringify(notesArray);

    // Save the json string into local storage
    //localStorage.setItem("notes", jsonStr);

    var subscriberHandler = function storeToLocalStorage(notesArray) {
      console.log("Observer being called");
      // encode json
      var jsonStr = JSON.stringify(notesArray);

      // Save the json string into local storage
      localStorage.setItem("notes", jsonStr);

    }

    // Use of Observer pattern
    var subscriber = new SaveToLocalStorage();

    subscriber.subscribe(subscriberHandler);
    subscriber.fire(notesArray);
    subscriber.unsubscribe(subscriberHandler);

    //storeToLocalStorage(notesArray);
}



//  adds a new note to the 'notes' list
function addNewNote(note) {

  var title = note.title;
  var content = note.content;

	// add a new note to the end of the list
	notes.insertAdjacentHTML("beforeend","<li class='note' draggable='true' ondragstart='dragstart_handler(event);' ondrop='drop_handler(event);' ondragover='dragover_handler(event);'><a href='#'>" +
          "<img class='delete' width='15' height='15' src='images/delete.png'/>" +
          "<img class='edit' width='15' height='15' src='images/edit.png'/>" +
					"<h2 class='title'>"+title+"</h2>" +
					"<p class='content'>"+content+"</p>" +
					"</a></li>");

	// get the new note that's just been added and attach the click event handler to its close button
	var newNote = notes.lastChild;

  newNote.getElementsByClassName("delete")[0].addEventListener('click', function() {
    newNote.remove();
    saveNotes();
  });

  newNote.getElementsByClassName("edit")[0].addEventListener('click', function() {
    editNote(newNote);
    saveNotes();
  });

  // save
  saveNotes();
  document.getElementById('modal-container').innerHTML = "";
  notes.classList.remove("list-items-blur");
}

// load the notes saved in the local storage
function loadNotes() {
    var storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
        // passes the stored json back into an array of note objects
        var notesArray = JSON.parse(storedNotes);
        console.log(notesArray);
        count = notesArray.length;

        var i;
        for (i = 0; i < count; i++) {
            var storedNote = notesArray[i];
            //var newNote = new Note(storedNote.Title, storedNote.Content);
            var factory = new Factory();
            var newNote = factory.createNote(storedNote.Title, storedNote.Content);
            addNewNote(newNote);
        }
    }
}


var source;
function dragstart_handler(e) {
  source = e.target;
  console.log(e.target);
  if (e.target.localName === 'li') {
    e.dataTransfer.setData("text/html", e.target);
    e.dataTransfer.effectAllowed = "move";
  }

}

function dragover_handler(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function drop_handler(e) {
   console.log(e.target);
    e.preventDefault();
    e.stopPropagation();

    if (e.target.localName === 'li') {
        console.log(e.target);
        e.target.parentNode.insertBefore(source, e.target.nextSibling);
        saveNotes();
    }

}
