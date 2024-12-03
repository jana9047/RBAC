
function fetchPermissions() {
    fetch('http://localhost:9092/api/permissions') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#permissionTable tbody');
            tableBody.innerHTML = '';
            data.forEach(permission => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${permission.id}</td> <!-- Assuming permission has an 'id' field -->
                    <td>${permission.permissionName}</td>
                    <td>${permission.permissionDescription}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editPermission(${permission.id}, '${permission.permissionName}', '${permission.permissionDescription}')"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-danger" onclick="deletePermission(${permission.id})"><i class="fas fa-trash"></i> Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching permissions:', error);
        });
}


function deletePermission(id) {
    fetch(`http://localhost:9092/api/permissions/${id}`, {
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
        fetchPermissions(); 
    })
    .catch(error => {
        console.error('Error deleting permission:', error);
    });
}


function editPermission(id, name, description) {
    document.getElementById('permissionId').value = id; 
    document.getElementById('permissionName').value = name;
    document.getElementById('permissionDescription').value = description;

    document.getElementById('permissionForm').scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPermissions();

   
    document.getElementById('permissionForm').addEventListener('submit', function (event) {
        event.preventDefault(); 

        const permissionId = document.getElementById('permissionId').value; 
        const permissionName = document.getElementById('permissionName').value;
        const permissionDescription = document.getElementById('permissionDescription').value;

        const permission = { permissionName, permissionDescription };

        if (permissionId) {
            
            fetch(`http://localhost:9092/api/permissions/${permissionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(permission)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.message);
                fetchPermissions(); 
                document.getElementById('permissionForm').reset(); 
                document.getElementById('permissionId').value = ''; 
            })
            .catch(error => {
                console.error('Error updating permission:', error);
            });
        } else {
           
            fetch('http://localhost:9092/api/permissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(permission)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.message);
                fetchPermissions();
                document.getElementById('permissionForm').reset();
            })
            .catch(error => {
                console.error('Error adding permission:', error);
            });
        }
    });
});
