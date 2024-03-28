<template>
    <div>
      <div class="page-header">
        <h1>Farm Page</h1>
        <div class="header-buttons">
          <router-link to="/Social" class="button">Social</router-link>
          <router-link to="/Shop" class="button">Shop</router-link>
        </div>
      </div>
    </div>
  </template>
  
  
  <style scoped>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header-buttons {
    display: flex;
    gap: 10px;
  }
  
  .button {
    padding: 10px;
    background-color: #3498db;
    border: none;
    border-radius: 4px;
    color: white;
    text-decoration: none;
    cursor: pointer;
  }
  
  </style>
  