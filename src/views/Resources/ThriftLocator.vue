<template>

    <div>
      <h1 style="color:#457247;">"I HAVE NO CLOTHES!"</h1>
      <p>Donate/sell preloved clothes and discover "NEW" fashion pieces that you love</p>
      <br>
      <iframe src="https://www.google.com/maps/d/embed?mid=1PBdtA9bt0NuMBSuusDvkiyPEwNm53fg&ehbc=2E312F&noprof=1" width=900 height=600></iframe>
    </div>
    <div class="list-container">
        <ul class="tips-list">
          <h3> Tips: </h3>
          <li>Click on <img :src="expandMapIcon"/> icon below to filter to region</li>
          <li>Click on the marker to see the store details</li>
        </ul>
      </div>
</template>

<script>
import expandMapIcon from '@/assets/ExpandMap.png'; // Use the @ alias for root directory if configured

export default {
  name: 'ThriftLocator',
  data() {
    return {
      // Now the imported image is available as a data property
      expandMapIcon: expandMapIcon,
    };
  },
};
</script>

<style>
.list-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
}

.tips-list {
  padding: 0;
  list-style: none;
}

.tips-list li {
  position: relative;
  padding-left: 20px; /* Adjust as needed for the bullet point or icon */
}

.tips-list li::before {
  content: '•'; /* Custom bullet point */
  position: absolute;
  left: 0; /* Align with the start of the text */
  color: black; /* Or any other color */
}
</style>