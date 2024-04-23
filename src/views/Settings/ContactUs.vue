<template>
  <div>
    <h1>Contact Us</h1>
    <h2>Get in touch!</h2>
    <div class="email"> 
      <font-awesome-icon icon="envelope" class="emailicon" />
      <h3>ecoharbour@gmail.com</h3>
    </div>
    <div class="telegram">
      <font-awesome-icon icon="fa-brands fa-telegram" class="telegramicon"/>
      <h3>@ecoharbour</h3>
    </div>
  </div>
</template>

<script>
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
  import { faTelegram } from '@fortawesome/free-brands-svg-icons'

  library.add(faEnvelope)
  library.add(faTelegram)

  export default {
    components: {
      FontAwesomeIcon
    }
  };
</script>

<style scoped>
/* Use the parent component's CSS to target the child component */
.settings-wrapper h1 {
  margin-right: 960px;
}

.settings-wrapper h2 {
  margin-right: 900px;
  margin-bottom: 30px
}

.settings-wrapper .email,
.settings-wrapper .telegram {
    display: flex;
    align-items: center;
    margin-left: 50px;
  }
  
.settings-wrapper .emailicon {
    margin-right: 10px;
    size: 20px;
    color: var(--primary-color);
    font-size: 20px;
  }

  .settings-wrapper .telegramicon {
    margin-right: 10px;
    size: 20px;
    color: #24A1DE;
    font-size: 20px;
  }
</style>
