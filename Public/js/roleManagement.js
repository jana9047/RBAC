
function fetchRoles() {
    fetch('http://localhost:9092/api/roles')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#roleTable tbody');
            tableBody.innerHTML = '';
            data.forEach(role => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${role.role_name}</td>
                    <td>${role.role_description}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editRole(${role.id}, '${role.role_name}', '${role.role_description}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteRole(${role.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching roles:', error);
        });
}


function deleteRole(id) {
    fetch(`http://localhost:9092/api/roles/${id}`, {
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
        fetchRoles(); 
    })
    .catch(error => {
        console.error('Error deleting role:', error);
    });
}


function editRole(id, name, description) {
    document.getElementById('roleId').value = id; 
    document.getElementById('roleName').value = name;
    document.getElementById('roleDescription').value = description;

    document.getElementById('roleForm').scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchRoles();

  
    document.getElementById('roleForm').addEventListener('submit', function (event) {
        event.preventDefault(); 

        const roleId = document.getElementById('roleId').value; 
        const roleName = document.getElementById('roleName').value;
        const roleDescription = document.getElementById('roleDescription').value;

        const role = { role_name: roleName, role_description: roleDescription };

        if (roleId) {
            
            fetch(`http://localhost:9092/api/roles/${roleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(role)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.message);
                fetchRoles();
                document.getElementById('roleForm').reset();
                document.getElementById('roleId').value = ''; 
            })
            .catch(error => {
                console.error('Error updating role:', error);
            });
        } else {
            
            fetch('http://localhost:9092/api/roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(role)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.message);
                fetchRoles(); 
                document.getElementById('roleForm').reset(); 
            })
            .catch(error => {
                console.error('Error adding role:', error);
            });
        }
    });
});
