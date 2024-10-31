// Define the loadTips function
async function loadTips() {
  const response = await fetch('/api/admin/tips');
  const tips = await response.json();
  const tipList = document.getElementById('tipList');
  tipList.innerHTML = '';

  tips.forEach((tip) => {
    const conditionContainer = document.createElement('div');
    conditionContainer.classList.add('condition-container');

    const conditionHeader = document.createElement('h3');
    conditionHeader.textContent = tip.condition;
    conditionContainer.appendChild(conditionHeader);

    const tipsUl = document.createElement('ul');
    tip.tips.forEach((tipText) => {
      const listItem = document.createElement('li');
      listItem.textContent = tipText;
      listItem.innerHTML += ` <button class='delete-btn' onclick="deleteTip('${tip._id}', '${tipText}')">Delete</button>`;
      tipsUl.appendChild(listItem);
    });

    conditionContainer.appendChild(tipsUl);
    tipList.appendChild(conditionContainer);
  });
}

// Load tips on page load
document.addEventListener('DOMContentLoaded', loadTips);

// Delete a specific tip
async function deleteTip(tipId, tipText) {
  await fetch(`/api/admin/tips/${tipId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipText }),
  });
  loadTips();
}

// Handle form submission for adding a new tip
document
  .getElementById('addTipForm')
  .addEventListener('submit', async (event) => {
    event.preventDefault();
    const condition = document.getElementById('condition').value;
    const tipText = document.getElementById('tipText').value;

    await fetch('/api/admin/tips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ condition, tipText }),
    });

    document.getElementById('tipText').value = '';
    loadTips();
  });
