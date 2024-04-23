<template>
  <div class="about-container">
    <!-- Navigation bar would be included above this section -->

    <!-- Main Content Section -->
    <div class="content-section">
      <!-- Title -->
      <h1 class="main-title">Our EcoHarbour</h1>
      <!-- Subtitle -->
      <h2 class="subtitle">Navigating Sustainability, One Recycled Item at a Time!</h2>
      <!-- Description -->
      <p class="description">
        Welcome to EcoHarbour, where recycling meets innovation and sustainability becomes a game! Every action counts in
        preserving our planet. Transform your recycling journey into an adventure, building your virtual farm with each bottle,
        can, or piece of paper recycled. Join our community dedicated to making a difference, explore educational resources,
        and sync your calendar to stay on track with eco-friendly habits. Let's create a greener world, one item at a time!
      </p>
    </div>

    <!-- Banner Image Section -->
    <div class="banner-section">
      <img src="@/assets/Banner.png" alt="EcoHarbour Banner" class="banner-image" />
    </div>
  </div>
</template>


<style scoped>
.about-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90vh; 
  padding-top: 10vh
}

.content-section {
  text-align: center; 
}

.main-title,
.subtitle {
  font-weight: bold; 
}

.main-title {
  font-size: 2rem;
  color: #457247;
}

.subtitle {
  font-size: 1.2rem;
  color: #457247;
}

.description {
  font-size: 1rem;
  color: #666666;
  max-width: 1000px;
  margin: 1em auto; 
}

.banner-section {
  position: fixed; 
  bottom: 0; 
  left: 0;
  width: 100vw; 
}

.banner-image {
  display: block;
  width: 100%;
  height: auto; 
}
</style>