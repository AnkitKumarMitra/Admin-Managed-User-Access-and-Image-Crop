function approveUser(userId) {
    fetch(`/approveUser/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function deleteAndReload(userId) {
    fetch(`/deleteUser/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
