document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/api/admin/users');
  const users = await response.json();
  const userTableBody = document
    .getElementById('userTable')
    .querySelector('tbody');

  users.forEach((user) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.gender}</td>
        <td>${user.role}</td>
        <td>
          <button class='update-btn' onclick="openUpdateModal('${user._id}')">Update</button>
          <button class='delete-btn' onclick="deleteUser('${user._id}')">Delete</button>
        </td>
      `;
    userTableBody.appendChild(row);
  });
});

async function deleteUser(userId) {
  await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
  location.reload();
}

// Open the modal with dropdown for updating user role
function openUpdateModal(userId) {
  const updateModal = document.getElementById('updateModal');
  updateModal.style.display = 'block';

  document.getElementById('updateUserForm').onsubmit = async (e) => {
    e.preventDefault();
    const newRole = document.getElementById('role').value;
    await updateUserRole(userId, newRole);
  };
}

async function updateUserRole(userId, newRole) {
  fetch(`/api/admin/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: newRole }),
  })
    .then((response) => {
      if (response.ok) {
        alert('User role updated successfully.');
        location.reload();
      } else {
        alert('Failed to update user role.');
      }
    })
    .catch((error) => console.error('Error updating user role:', error));
}

// Close the modal when clicking on the 'x'
document.getElementById('closeModal').onclick = function () {
  document.getElementById('updateModal').style.display = 'none';
};

// Close the modal when clicking outside of the modal content
window.onclick = function (event) {
  const modal = document.getElementById('updateModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};
