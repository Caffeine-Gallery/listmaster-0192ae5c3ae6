import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as backend_idl, canisterId as backend_canister_id } from 'declarations/backend';

let backend;

async function init() {
  const agent = new HttpAgent();
  backend = Actor.createActor(backend_idl, { agent, canisterId: backend_canister_id });
  setupEventListeners();
  await loadItems();
}

function setupEventListeners() {
  const addButton = document.getElementById('add-button');
  const itemInput = document.getElementById('item-input');

  addButton.addEventListener('click', addItem);
  itemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addItem();
    }
  });
}

async function addItem() {
  const itemInput = document.getElementById('item-input');
  const itemName = itemInput.value.trim();
  if (itemName) {
    showLoading();
    await backend.addItem(itemName);
    itemInput.value = '';
    await loadItems();
    hideLoading();
  }
}

async function loadItems() {
  showLoading();
  const itemsList = document.getElementById('items-list');
  itemsList.innerHTML = '';
  const items = await backend.getItems();

  items.forEach(item => {
    const listItem = document.createElement('li');
    listItem.className = item.completed ? 'completed' : '';

    const itemText = document.createElement('span');
    itemText.textContent = item.name;
    itemText.addEventListener('click', async () => {
      showLoading();
      await backend.toggleItem(item.id);
      await loadItems();
      hideLoading();
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&#10005;';
    deleteButton.addEventListener('click', async () => {
      showLoading();
      await backend.deleteItem(item.id);
      await loadItems();
      hideLoading();
    });

    listItem.appendChild(itemText);
    listItem.appendChild(deleteButton);
    itemsList.appendChild(listItem);
  });
  hideLoading();
}

function showLoading() {
  document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

window.onload = init;
