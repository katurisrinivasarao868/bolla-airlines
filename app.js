// ===============================
// STUDENT DATA
// ===============================

let students = [

    {
        name: "Rahul Kumar",
        email: "rahul@gmail.com",
        course: "B.Tech",
        year: "1st Year",
        gender: "Male",
        phone: "9876543210"
    },

    {
        name: "Priya Sharma",
        email: "priya@gmail.com",
        course: "B.Tech",
        year: "2nd Year",
        gender: "Female",
        phone: "9876543211"
    },

    {
        name: "Arjun Reddy",
        email: "arjun@gmail.com",
        course: "B.Tech",
        year: "3rd Year",
        gender: "Male",
        phone: "9876543212"
    },

    {
        name: "Sneha Rao",
        email: "sneha@gmail.com",
        course: "B.Tech",
        year: "1st Year",
        gender: "Female",
        phone: "9876543213"
    },

    {
        name: "Kiran Teja",
        email: "kiran@gmail.com",
        course: "B.Tech",
        year: "4th Year",
        gender: "Male",
        phone: "9876543214"
    },

    {
        name: "Anjali Devi",
        email: "anjali@gmail.com",
        course: "BCA",
        year: "1st Year",
        gender: "Female",
        phone: "9876543215"
    },

    {
        name: "Vamsi Krishna",
        email: "vamsi@gmail.com",
        course: "BCA",
        year: "2nd Year",
        gender: "Male",
        phone: "9876543216"
    },

    {
        name: "Pooja Singh",
        email: "pooja@gmail.com",
        course: "BCA",
        year: "3rd Year",
        gender: "Female",
        phone: "9876543217"
    },

    {
        name: "Rohit Kumar",
        email: "rohit@gmail.com",
        course: "BCA",
        year: "4th Year",
        gender: "Male",
        phone: "9876543218"
    },

    {
        name: "Meena Kumari",
        email: "meena@gmail.com",
        course: "MBA",
        year: "1st Year",
        gender: "Female",
        phone: "9876543219"
    },

    {
        name: "Suresh Babu",
        email: "suresh@gmail.com",
        course: "MBA",
        year: "2nd Year",
        gender: "Male",
        phone: "9876543220"
    },

    {
        name: "Divya Sri",
        email: "divya@gmail.com",
        course: "MBA",
        year: "3rd Year",
        gender: "Female",
        phone: "9876543221"
    }

];


// ===============================
// GET HTML ELEMENTS
// ===============================

const studentForm =
    document.getElementById("studentForm");

const studentTable =
    document.getElementById("studentTable");

const clearButton =
    document.getElementById("clearButton");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const showAllButton =
    document.getElementById("showAllButton");


// ===============================
// STATISTICS
// ===============================

function updateStatistics() {

    document.getElementById("totalStudents")
        .textContent = students.length;


    const btech =
        students.filter(
            student => student.course === "B.Tech"
        ).length;


    const bca =
        students.filter(
            student => student.course === "BCA"
        ).length;


    const mba =
        students.filter(
            student => student.course === "MBA"
        ).length;


    document.getElementById("btechStudents")
        .textContent = btech;


    document.getElementById("bcaStudents")
        .textContent = bca;


    document.getElementById("mbaStudents")
        .textContent = mba;
}


// ===============================
// DISPLAY STUDENTS
// ===============================

function displayStudents(data = students) {

    studentTable.innerHTML = "";


    data.forEach((student) => {

        const originalIndex =
            students.indexOf(student);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${student.name}
                </strong>
            </td>

            <td>
                ${student.email}
            </td>

            <td>
                ${student.course}
            </td>

            <td>
                ${student.year}
            </td>

            <td>
                ${student.gender}
            </td>

            <td>
                ${student.phone}
            </td>

            <td>

                <button
                    class="delete-button"
                    onclick="deleteStudent(${originalIndex})"
                >
                    Delete
                </button>

            </td>

        `;


        studentTable.appendChild(row);

    });


    document.getElementById("recordCount")
        .textContent =
        data.length +
        (data.length === 1 ? " record" : " records");


    updateStatistics();
}


// ===============================
// ADD STUDENT
// ===============================

studentForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            document.getElementById("name")
                .value.trim();


        const email =
            document.getElementById("email")
                .value.trim();


        const course =
            document.getElementById("course")
                .value;


        const year =
            document.getElementById("year")
                .value;


        const phone =
            document.getElementById("phone")
                .value.trim();


        const gender =
            document.querySelector(
                'input[name="gender"]:checked'
            ).value;


        const newStudent = {

            name: name,

            email: email,

            course: course,

            year: year,

            gender: gender,

            phone: phone

        };


        students.push(newStudent);


        displayStudents();


        studentForm.reset();


        document.querySelector(
            'input[value="Male"]'
        ).checked = true;

    }
);


// ===============================
// CLEAR FORM
// ===============================

clearButton.addEventListener(
    "click",
    function() {

        studentForm.reset();


        document.querySelector(
            'input[value="Male"]'
        ).checked = true;

    }
);


// ===============================
// SEARCH
// ===============================

function searchStudents() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    if (searchText === "") {

        displayStudents();

        return;

    }


    const result =
        students.filter(
            student =>

                student.name
                    .toLowerCase()
                    .includes(searchText)

                ||

                student.course
                    .toLowerCase()
                    .includes(searchText)

                ||

                student.email
                    .toLowerCase()
                    .includes(searchText)

        );


    displayStudents(result);

}


// Search button

searchButton.addEventListener(
    "click",
    searchStudents
);


// Search using Enter

searchInput.addEventListener(
    "keyup",
    function(event) {

        if (event.key === "Enter") {

            searchStudents();

        }

    }
);


// ===============================
// SHOW ALL
// ===============================

showAllButton.addEventListener(
    "click",
    function() {

        searchInput.value = "";

        displayStudents();

    }
);


// ===============================
// DELETE STUDENT
// ===============================

function deleteStudent(index) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmDelete) {

        return;

    }


    students.splice(index, 1);


    displayStudents();

}


// ===============================
// INITIAL DISPLAY
// ===============================

displayStudents();