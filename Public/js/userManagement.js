
function fetchProperties() {
    fetch('http://localhost:9092/api/properties')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#userTable tbody');
            tableBody.innerHTML = '';
            data.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.role}')"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-danger" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i> Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching properties:', error);
        });
}

function deleteUser(id) {
    fetch(`http://localhost:9092/api/properties/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);
        fetchProperties(); 
    })
    .catch(error => {
        console.error('Error deleting user:', error);
    });
}

function editUser(id, name, email, role) {
    document.getElementById('userId').value = id; 
    document.getElementById('userName').value = name;
    document.getElementById('userEmail').value = email;
    document.getElementById('userRole').value = role;

    document.getElementById('userForm').scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProperties();

    document.getElementById('userForm').addEventListener('submit', function (event) {
        event.preventDefault(); 

        const userId = document.getElementById('userId').value; 
        const userName = document.getElementById('userName').value;
        const userEmail = document.getElementById('userEmail').value;
        const userRole = document.getElementById('userRole').value;

        const user = { name: userName, email: userEmail, role: userRole };

        if (userId) {
           
            fetch(`http://localhost:9092/api/properties/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.message);
                fetchProperties();
                document.getElementById('userForm').reset(); 
                document.getElementById('userId').value = ''; 
            })
            .catch(error => {
                console.error('Error updating user:', error);
            });
        } else {
            
            fetch('http://localhost:9092/api/properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.message);
                fetchProperties();
                document.getElementById('userForm').reset(); 
            })
            .catch(error => {
                console.error('Error adding user:', error);
            });
        }
    });
});
