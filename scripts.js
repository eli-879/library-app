let myLibrary = [];

class Book {
    constructor(title, author, status) {
        this.title = title;
        this.author = author;
        this.status = status;
    }
}

function returnLocalStorage() {
    if (localStorage.getItem("library")) {
        let library = JSON.parse(localStorage.getItem("library"));
        return library;
    }
    return myLibrary;
}

function updateLocalStorage() {
    window.localStorage.setItem("library", JSON.stringify(myLibrary));
}

function updateIndexData() {
    const tableRows = document.querySelector(".data").children;
    for (let i = 0; i < myLibrary.length; i++) {
        tableRows[i].setAttribute("index", i);
    }
} 

function addBookToLibrary(array, book) {
    array.push(book);
}

function createBook(event) {
    const data = getBookData(event);
    if (data == -1) return;
    const index = generateBookObject(data);
}

// gets data from input and packages it into list
// alerts user if empty forms and clears forms after use
function getBookData(event) {
    const bookTitle = document.getElementById("title").value;
    const bookAuthor = document.getElementById("author").value;
    const bookRead = document.getElementById("read").value;

    if (bookTitle.trim() == "") {
        alert("Please fill in title!");
        return -1;
    }
    else if (bookAuthor.trim() == "") {
        alert("Please fill in author!");
        return -1;
    }

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("read").value = "Read";

    return [bookTitle, bookAuthor, bookRead];
}

// addes book object to start of list
function generateBookObject(data) {
    const newBook = new Book(data[0], data[1], data[2]);
    myLibrary.unshift(newBook);
    return myLibrary.length - 1;
}

function createBookElements(index) {
    // row element
    const tableRow = document.createElement("tr");
    tableRow.classList.add("data-row");
    
    // creating elements that go into row
    const bookNameElement = document.createElement("td");
    const bookAuthorElement = document.createElement("td");
    const bookReadElement = document.createElement("td");
    const bookDeleteElement = document.createElement("td");

    // creating bookReadButton which changes book status on press
    const bookReadButton = document.createElement("button");
    bookReadButton.classList.add("status-button");
    bookReadButton.innerText = myLibrary[index].status;
    bookReadButton.addEventListener("click", (e) => {
        changeBookStatus(e);
    })
    bookReadElement.appendChild(bookReadButton);
    
    // creating bookDeleteButton which deletes a row when clicked
    const bookDeleteButton = document.createElement("button");
    bookDeleteButton.classList.add("delete-book");
    bookDeleteButton.innerText = "Delete";
    bookDeleteButton.addEventListener("click", (e) => {
        deleteRow(e);
    })
    bookDeleteElement.appendChild(bookDeleteButton);

    bookNameElement.innerText = myLibrary[index].title;
    bookAuthorElement.innerText = myLibrary[index].author;

    // adding elements into row
    tableRow.appendChild(bookNameElement);
    tableRow.appendChild(bookAuthorElement);
    tableRow.appendChild(bookReadElement);
    tableRow.appendChild(bookDeleteElement);

    // adding row to table
    const table = document.querySelector(".data");
    table.appendChild(tableRow);
}  

// changes status of book when button clicked and redraws all
function changeBookStatus(event) {
    const button = event.target;
    const bookObjectIndex = button.parentElement.parentElement.getAttribute("index");

    if (myLibrary[bookObjectIndex].status == "Not Read") myLibrary[bookObjectIndex].status = "Reading";
    else if (myLibrary[bookObjectIndex].status == "Reading") myLibrary[bookObjectIndex].status = "Read";
    else if (myLibrary[bookObjectIndex].status == "Read") myLibrary[bookObjectIndex].status = "Not Read";
    else myLibrary[bookObjectIndex].status = "Not Read";
    
    displayBooks();
}

// deletes Book object from library and removes DOM elements
function deleteRow(event) {
    
    const button = event.target;
    const parent = button.parentElement.parentElement;
    const index = parent.getAttribute("index");
    myLibrary.splice(index, 1); 
    parent.remove();

    displayBooks();
    
}

// draws all books onto the screen
function renderToScreen() {
    const table = document.querySelector(".data");
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    myLibrary = returnLocalStorage();
    for (let i = 0; i < myLibrary.length; i++) {
        createBookElements(i);
    }
}

// sorts books first by status, then author, then title
function sortBooks(a, b) {
    if (a.status.toLowerCase() > b.status.toLowerCase()) {
        return 1;
    }
    else if (a.status.toLowerCase() == b.status.toLowerCase()) {
        if (a.author.toLowerCase() > b.author.toLowerCase()) {
            return 1;
        }
        else if (a.author.toLowerCase() == b.author.toLowerCase()) {
            if (a.title.toLowerCase() > b.title.toLowerCase()) {
                return 1;
            }
            return -1;
        }
        return -1;
    }
    return -1;
}

function displayBooks() {
    updateLocalStorage();
    renderToScreen();
    updateIndexData();
}

const submitButton = document.querySelector(".submit");
submitButton.addEventListener("click", (e) => {
    // creates book object, sorts m
    createBook(e);
    myLibrary.sort((a, b) => {
        return sortBooks(a, b);
    });
    displayBooks();
})

myLibrary = returnLocalStorage();
// sorts list on load from page
myLibrary.sort((a, b) => {
    return sortBooks(a, b);
});

displayBooks();