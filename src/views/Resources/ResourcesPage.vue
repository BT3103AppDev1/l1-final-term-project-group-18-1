<template>
    <div class="resources-page">
      <h1>Resources</h1>
      <!-- Infographics Button -->
      <router-link to="/resources/Infographics" class="resource-button">Infographics</router-link>
      <!-- Blue Bin Locator Button -->
      <router-link to="/resources/ThriftLocator" class="resource-button">Thrift Locator</router-link>
    </div>
  </template>

  <style>
  .resource-button {
    display: inline-block;
    background-color: #4CAF50; /* Green background */
    color: white; /* White text */
    padding: 10px 20px; /* Some padding */
    margin: 10px; /* Space around buttons */
    border: none; /* No border */
    border-radius: 4px; /* Rounded corners */
    text-decoration: none; /* Remove underline */
    text-align: center;
    cursor: pointer; /* Cursor on hover */
    transition: background-color 0.3s; /* Smooth background color change on hover */
  }

  .resource-button:hover {
    background-color: #27792b; /* Darker shade of green on hover */
  }
  </style>
