<template>
    <div class="resources-page">
      <h1 class="title">Resources</h1>

      <!-- Infographics Button -->
      <router-link to="/resources/Infographics" class="resource-button">Infographics</router-link>
     
      <!-- Thift Locator Button -->
      <router-link to="/resources/ThriftLocator" class="resource-button">Thrift Locator</router-link>
    
    </div>
  </template>

  <style>
  .title{
    color:#457247;
  }
  .resource-button {
    display: inline-block;
    background-color: var(--primary-color); 
    color: white;
    padding: 10px 20px; 
    margin: 10px; 
    border: none; 
    border-radius: 4px; 
    text-decoration: none; 
    text-align: center;
    cursor: pointer; 
    transition: background-color 0.3s; 
  }

  .resource-button:hover {
    background-color: rgb(0, 51, 34); /* Darker shade of green on hover */
  }
  </style>
